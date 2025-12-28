import { BlobOptions } from "buffer";
import {
  randomNumber,
  ChangeStatus,
  CheckFilteredData,
  TableSearch,
} from "../../../utils/utils";

type TData = {
  Name: string;
  Type: string;
  ParentCause?: string;
  Description?: string;
  Status?: string;
};

class Causes {
  randomNumber = randomNumber();

  //Create
  async GoToCreateCause({ page, expect }: { page: any; expect: any }) {
    await page.getByRole("button", { name: "Add Cause" }).click();
    await expect(page).toHaveURL("/master-data/causes/create");
  }
  async CreateCause({
    page,
    expect,
    Empty,
    Data,
    subCause,
    CategoryData,
    NotRandomNumber,
    Duplicate,
  }: {
    page: any;
    expect: any;
    Empty?: boolean;
    Data?: TData;
    subCause?: boolean;
    CategoryData?: TData;
    NotRandomNumber?: boolean;
    Duplicate?: boolean;
  }) {
    if (Empty) {
      if (subCause) {
        await page.getByRole("textbox", { name: "Type *" }).click();
        await page
          .locator(".m_c0783ff9")
          .locator("span", { hasText: "Sub-Cause" })
          .click();
        await page.getByTestId("save-button").click();

        await expect(
          page.getByText("This field is required").nth(0)
        ).toBeVisible();

        await expect(
          page.getByText("This field is required").nth(1)
        ).toBeVisible();
      } else {
        await page.getByTestId("save-button").click();

        await expect(
          page.getByText("This field is required").nth(0)
        ).toBeVisible();

        await expect(
          page.getByText("This field is required").nth(1)
        ).toBeVisible();
      }
    } else {
      await page
        .getByTestId("name")
        .fill(NotRandomNumber ? Data!.Name : Data!.Name + this.randomNumber);
      await page.getByRole("textbox", { name: "Type *" }).click();
      await page
        .locator(".m_c0783ff9")
        .locator("span", { hasText: Data?.Type })
        .click();
      if (subCause) {
        await page.getByRole("textbox", { name: "Parent Cause *" }).click();

        await page.getByRole("option", { name: Data?.ParentCause }).click();
      }
      await page.getByTestId("description").fill(Data?.Description);
      await page.getByTestId("save-button").click();
      if (Duplicate) {
        await expect(
          page.getByText("Cause with this name already")
        ).toBeVisible();
      } else {
        await expect(page).toHaveURL("/master-data/causes");
        await page.getByRole("button", { name: "OK" }).click();
      }
    }
  }
  //Edit
  async GoToEditCause({
    page,
    expect,
    Data,
    subCause,
  }: {
    page: any;
    expect: any;
    Data: TData;
    subCause?: boolean;
  }) {
    //go to edit & change status
    const isFound = await TableSearch({ page, Name: Data?.Name, Edit: true });
    // --- إذا انتهى البحث في كل الصفحات ولم نجد الصف ---
    if (!isFound) {
      await this.GoToCreateCause({ page, expect });
      // create with same data
      await this.CreateCause({
        page,
        expect,
        Data: Data,
        NotRandomNumber: true,
        subCause,
      });
      await expect(page).toHaveURL("/master-data/causes");
      await this.GoToEditCause({ page, Data, expect, subCause });
    }
  }

  async EditCause({
    page,
    expect,
    DataBefore,
    DataAfter,
    Category,
  }: {
    page: any;
    expect: any;
    DataBefore: TData;
    DataAfter: TData;
    Category?: Boolean;
  }) {
    await expect(page.getByTestId("name")).toHaveValue(DataBefore.Name);
    await expect(page.getByRole("textbox", { name: "Type *" })).toHaveValue(
      DataBefore.Type
    );
    if (!Category) {
      await expect(
        page.getByRole("textbox", { name: "Parent Cause *" })
      ).toHaveValue(DataBefore?.ParentCause);
    }
    await page.getByTestId("name").clear();
    await page.locator(".mantine-focus-auto").first().click();

    await page.getByTestId("name").fill(DataAfter.Name);
    if (Category) {
      await page.getByRole("textbox", { name: "Type *" }).click();
      await page
        .locator(".m_c0783ff9")
        .locator("span", { hasText: "Category" })
        .click();
    } else {
      await page.getByRole("textbox", { name: "Type *" }).click();
      await page
        .locator(".m_c0783ff9")
        .locator("span", { hasText: DataAfter.Type })
        .click();

      await page.getByRole("textbox", { name: "Parent Cause *" }).click();

      await page
        .getByRole("option", {
          name: DataBefore?.ParentCause,
          exact: true,
        })
        .click();
    }

    await page.getByTestId("edit-button").click();
    await expect(page).toHaveURL("/master-data/causes");
    await page.getByRole("button", { name: "OK" }).click();
  }

  //Show
  async GoToShowCause({
    page,
    Data,
    expect,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    await TableSearch({
      page,
      Name: Data?.Name,
      Show: true,
    });
  }

  async ShowCause({
    page,
    Data,
    expect,
    Category,
  }: {
    page: any;
    expect: any;
    Data: TData;
    Category?: boolean;
  }) {
    await expect(page.locator("input[data-testid='name']")).toHaveValue(
      Data?.Name
    );
    await expect(page.locator("input[id='type']")).toHaveValue(Data?.Type);
    if (!Category) {
      await expect(
        page.locator("input[data-testid='parent_cause.name']")
      ).toHaveValue(Data?.ParentCause);
    }
    await expect(
      page.locator("textarea[data-testid='description']")
    ).toHaveValue(Data?.Description);
  }

  // Filter
  async FilterCause({
    page,
    expect,
    DataAfter,
    DataAfterCategory,
    isCategory,
  }: {
    page: any;
    expect: any;
    DataAfter: TData;
    DataAfterCategory?: TData;
    isCategory?: boolean;
  }) {
    if (isCategory) {
      await page.getByRole("button", { name: "Filter" }).click();
      await expect(
        await page.getByRole("heading", { name: "Filter" })
      ).toBeVisible();
      await page.getByTestId("name").fill(DataAfterCategory?.Name);
      await page.getByTestId("apply-filters").click();
      await page.waitForSelector("table tbody tr");
      const RowCount = await page
        .locator("table tbody tr td", { hasText: DataAfterCategory?.Name })
        .count();
      if (RowCount == 0) {
        console.log("No Data with this filter");
      } else {
        const AllNames = await page
          .locator("table tbody tr td:nth-of-type(1)")
          .allTextContents();
        await CheckFilteredData(AllNames, DataAfterCategory?.Name);
        await page.getByRole("button", { name: "Filter" }).click();
        await expect(
          page.getByRole("heading", { name: "Filter" })
        ).toBeVisible();
        await page.getByRole("textbox", { name: "Type" }).click();
        await page
          .locator(".m_c0783ff9")
          .locator("span", { hasText: DataAfterCategory?.Type })
          .click();
        await page.getByTestId("apply-filters").click();
        await page.waitForSelector("table tbody tr");
        const RowCount = await page
          .locator("table tbody tr", { hasText: DataAfterCategory?.Name })
          .count();
        if (RowCount == 0) {
          console.log("No Data with this filter");
        } else {
          const AllNames = await page
            .locator("table tbody tr td:nth-of-type(1)")
            .allTextContents();
          const AllTypes = await page
            .locator("table tbody tr td:nth-of-type(2)")
            .allTextContents();
          await CheckFilteredData(AllNames, DataAfterCategory?.Name);
          await CheckFilteredData(
            AllTypes,
            DataAfterCategory?.Type.toLowerCase()
          );
          await page.getByRole("button", { name: "Filter" }).click();
          await expect(
            page.getByRole("heading", { name: "Filter" })
          ).toBeVisible();
          await page.getByRole("textbox", { name: "Status" }).click();
          await page
            .getByRole("option", {
              name: DataAfterCategory?.Status,
              exact: true,
            })
            .click();
          await page.getByTestId("apply-filters").click();
          await page.waitForSelector("table tbody tr");
          const RowCount = await page
            .locator("table tbody tr", { hasText: DataAfterCategory?.Name })
            .count();
          if (RowCount == 0) {
            console.log("No Data with this filter Status");
          } else {
            const AllNames = await page
              .locator("table tbody tr td:nth-of-type(1)")
              .allTextContents();
            const AllTypes = await page
              .locator("table tbody tr td:nth-of-type(2)")
              .allTextContents();
            const AllStatus = await page
              .locator("table tbody tr td:nth-of-type(4)")
              .allTextContents();
            await CheckFilteredData(AllNames, DataAfterCategory?.Name);
            await CheckFilteredData(
              AllTypes,
              DataAfterCategory?.Type.toLowerCase()
            );
            await CheckFilteredData(AllStatus, DataAfterCategory?.Status, true);
          }
        }
      }
    } else {
      await page.getByRole("button", { name: "Filter" }).click();
      await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
      await page.getByTestId("name").fill(DataAfter.Name);
      await page.getByTestId("apply-filters").click();
      await page.waitForSelector("table tbody tr");
      const RowCount = await page
        .locator("table tbody tr td", { hasText: DataAfter.Name })
        .count();
      if (RowCount == 0) {
        console.log("No Data with this filter");
      } else {
        const AllNames = await page
          .locator("table tbody tr td:nth-of-type(1)")
          .allTextContents();
        await CheckFilteredData(AllNames, DataAfter.Name);
        await page.getByRole("button", { name: "Filter" }).click();
        await expect(
          page.getByRole("heading", { name: "Filter" })
        ).toBeVisible();
        await page.getByRole("textbox", { name: "Type" }).click();
        await page
          .locator(".m_c0783ff9")
          .locator("span", { hasText: DataAfter.Type })
          .click();
        await page.getByTestId("apply-filters").click();
        await page.waitForSelector("table tbody tr");
        const RowCount = await page
          .locator("table tbody tr", { hasText: DataAfter.Name })
          .count();
        if (RowCount == 0) {
          console.log("No Data with this filter");
        } else {
          const AllNames = await page
            .locator("table tbody tr td:nth-of-type(1)")
            .allTextContents();
          const AllTypes = await page
            .locator("table tbody tr td:nth-of-type(2)")
            .allTextContents();
          await CheckFilteredData(AllNames, DataAfter.Name);
          await CheckFilteredData(AllTypes, DataAfter.Type.toLowerCase());
          await page.getByRole("button", { name: "Filter" }).click();
          await expect(
            page.getByRole("heading", { name: "Filter" })
          ).toBeVisible();
          await page.getByRole("textbox", { name: "Parent Cause" }).click();
          await page
            .getByRole("option", { name: DataAfter.ParentCause })
            .click();
          await page.getByTestId("apply-filters").click();
          await page.waitForSelector("table tbody tr");
          const RowCount = await page
            .locator("table tbody tr", { hasText: DataAfter.Name })
            .count();
          if (RowCount == 0) {
            console.log("No Data with this filter");
          } else {
            const AllNames = await page
              .locator("table tbody tr td:nth-of-type(1)")
              .allTextContents();
            const AllTypes = await page
              .locator("table tbody tr td:nth-of-type(2)")
              .allTextContents();
            const AllParentCause = await page
              .locator("table tbody tr td:nth-of-type(3)")
              .allTextContents();
            await CheckFilteredData(AllNames, DataAfter.Name);
            await CheckFilteredData(AllTypes, DataAfter.Type.toLowerCase());
            await CheckFilteredData(
              AllParentCause,
              `${DataAfter?.ParentCause}`
            );
            page.getByRole("button", { name: "Filter" }).click();
            await expect(
              page.getByRole("heading", { name: "Filter" })
            ).toBeVisible();
            await page.getByRole("textbox", { name: "Status" }).click();
            await page
              .getByRole("option", { name: DataAfter.Status, exact: true })
              .click();
            await page.getByTestId("apply-filters").click();
            await page.waitForSelector("table tbody tr");
            const RowCount = await page
              .locator("table tbody tr", { hasText: DataAfter.Name })
              .count();
            if (RowCount == 0) {
              console.log("No Data with this filter Status");
            } else {
              const AllNames = await page
                .locator("table tbody tr td:nth-of-type(1)")
                .allTextContents();
              const AllTypes = await page
                .locator("table tbody tr td:nth-of-type(2)")
                .allTextContents();
              const AllParentCause = await page
                .locator("table tbody tr td:nth-of-type(3)")
                .allTextContents();
              const AllStatus = await page
                .locator("table tbody tr td:nth-of-type(4)")
                .allTextContents();
              await CheckFilteredData(AllNames, DataAfter.Name);
              await CheckFilteredData(AllTypes, DataAfter.Type.toLowerCase());
              await CheckFilteredData(
                AllParentCause,
                `${DataAfter?.ParentCause}`
              );
              await CheckFilteredData(AllStatus, DataAfter.Status, true);
            }
          }
        }
      }
    }
  }
}

export default Causes;
