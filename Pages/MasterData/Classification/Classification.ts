import { randomNumber, TableSearch } from "../../../utils/utils";

type TData = {
  Name: string;
  Parent: string;
  Description: string;
  Status?: Boolean;
};

class Classification {
  randomNumber = randomNumber();

  // Create
  async GoToCreateClassification({ page, expect }: { page: any; expect: any }) {
    await page.getByRole("button", { name: "Add Classification" }).click();
    await expect(page).toHaveURL("/master-data/classifications/create");
  }

  async CreateClassification({
    page,
    expect,
    Status,
    Data,
    NotRandomNumber,
    Duplicate,
  }: {
    page: any;
    expect: any;
    Status: string;
    Data?: TData;
    NotRandomNumber?: boolean;
    Duplicate?: boolean;
  }) {
    // if (Empty) {
    //   await page.getByTestId("save-button").click();
    //   await expect(
    //     page.getByText("This field is required").nth(0)
    //   ).toBeVisible();
    // } else {
    // }

    if (Status === "Empty") {
      await page.getByTestId("save-button").click();
      await expect(
        page.getByText("This field is required").nth(0)
      ).toBeVisible();
    } else if (Status === "Primary_Required") {
      await page
        .getByTestId("name")
        .fill(
          NotRandomNumber ? Data?.Name : `${Data?.Name}${this.randomNumber}`
        );
      await page.getByTestId("save-button").click();
      await expect(page).toHaveURL("/master-data/classifications");
      await page.getByRole("button", { name: "OK" }).click();
    } else if (Status === "Primary_AllFields") {
      await page
        .getByTestId("name")
        .fill(
          NotRandomNumber ? Data?.Name : `${Data?.Name}${this.randomNumber}`
        );
      await page.getByTestId("description").fill(Data?.Description);
      await page.getByTestId("save-button").click();

      if (Duplicate) {
        await expect(
          page.getByText("Classification with this name already exists")
        ).toBeVisible();
      } else {
        await expect(page).toHaveURL("/master-data/classifications");
        await page.getByRole("button", { name: "OK" }).click();
      }
    } else if (Status === "Secondary_Required") {
      await page
        .getByTestId("name")
        .fill(
          NotRandomNumber ? Data?.Name : `${Data?.Name}${this.randomNumber}`
        );
      await page
        .getByRole("textbox", { name: "Parent Classification" })
        .click();
      await page
        .getByRole("option")
        .getByText(Data?.Parent, { exact: true })
        .click();
      await page.getByTestId("save-button").click();
      await expect(page).toHaveURL("/master-data/classifications");
      await page.getByRole("button", { name: "OK" }).click();
    } else if (Status === "Secondary_AllFields") {
      await page
        .getByTestId("name")
        .fill(
          NotRandomNumber ? Data?.Name : `${Data?.Name}${this.randomNumber}`
        );
      await page.getByTestId("description").fill(Data?.Description);
      await page
        .getByRole("textbox", { name: "Parent Classification" })
        .click();
      await page
        .getByRole("option")
        .getByText(Data?.Parent, { exact: true })
        .click();
      await page.getByTestId("save-button").click();

      if (Duplicate) {
        await expect(
          page.getByText("Classification with this name already exists")
        ).toBeVisible();
      } else {
        await expect(page).toHaveURL("/master-data/classifications");
        await page.getByRole("button", { name: "OK" }).click();
      }
    }
  }

  // Edit

  async GoToEditClassification({
    page,
    expect,
    Data,
    Secondary,
  }: {
    page: any;
    expect: any;
    Data: TData;
    Secondary: boolean;
  }) {
    const Found = await TableSearch({
      page,
      Name: Data.Name,
      Edit: true,
    });
    if (!Found) {
      await this.GoToCreateClassification({ page, expect });
      await this.CreateClassification({
        page,
        expect,
        Status: Secondary ? "Secondary_Required" : "Primary_Required",
        NotRandomNumber: true,
        Data: Data,
      });

      await this.GoToEditClassification({
        page,
        Data,
        expect,
        Secondary: Secondary ? true : false,
      });
    }
  }
  async EditClassification({
    page,
    expect,
    DataBefore,
    DataAfter,
    Secondary,
  }: {
    page: any;
    expect: any;
    DataBefore: TData;
    DataAfter: TData;
    Secondary?: boolean;
  }) {
    await expect(page.getByTestId("name")).toHaveValue(DataBefore.Name);
    await expect(
      page.getByRole("textbox", { name: "Parent Classification" })
    ).toHaveValue(DataBefore.Parent);
    await expect(page.getByTestId("description")).toHaveValue(
      DataBefore.Description
    );

    await page.getByTestId("name").clear();
    if (Secondary) {
      await page.locator(".mantine-focus-auto").click();
    }
    await page.getByTestId("description").clear();

    await page.getByTestId("name").fill(DataAfter.Name);
    if (Secondary) {
      await page
        .getByRole("textbox", { name: "Parent Classification" })
        .click();
      await page
        .getByRole("option")
        .getByText(DataAfter?.Parent, { exact: true })
        .click();
    }
    await page.getByTestId("description").fill(DataAfter.Description);
    await page.getByTestId("edit-button").click();
    await expect(page).toHaveURL("/master-data/classifications");
    await page.getByRole("button", { name: "OK" }).click();
  }

  // Show
  async GoToShowClassification({
    page,
    DataAfter,
  }: {
    page: any;
    DataAfter: TData;
  }) {
    const Found = await TableSearch({
      page,
      Show: true,
      Name: DataAfter.Name,
    });

    if (!Found) {
      console.log("Data Not Found");
    }
  }
  async ShowClassification({
    page,
    expect,
    DataAfter,
  }: {
    page: any;
    expect: any;
    DataAfter: TData;
  }) {
    await expect(page.getByTestId("name")).toHaveValue(DataAfter.Name);
    await expect(page.getByTestId("parent_classification.name")).toHaveValue(
      DataAfter.Parent
    );
    await expect(page.getByTestId("description")).toHaveValue(
      DataAfter.Description
    );
  }
}
export default Classification;
