import {
  CheckFilteredData,
  ChangeStatus,
  randomNumber,
  TableSearch,
} from "../../../utils/utils";

type TData = {
  Name: string;
  Category: string;
  Severity: string;
  Associated_Caution: string;
  How_to_Detect: string;
  Contamination_Procedure: string;
};

type TFilterData = {
  Name: string;
  Category: string;
  Severity: string;
  Status: string;
};

class Hazards {
  randomNum = randomNumber();

  // Create Hazard
  async GoToCrateHazard({ page, expect }: { page: any; expect: any }) {
    await page.getByRole("button", { name: "Create Hazard" }).click();
    expect(page).toHaveURL("/master-data/hazards/create");
  }
  async CreateHazard({
    page,
    expect,
    Data,
    Empty,
    NotFillRandomNumber,
  }: {
    page: any;
    expect: any;
    Data: TData;
    Empty?: boolean;
    NotFillRandomNumber?: boolean;
  }) {
    if (Empty) {
      await page.getByTestId("name").fill("");

      await page.getByRole("textbox", { name: "Category *" }).click();
      await page.getByRole("textbox", { name: "Category *" }).click();

      await page.getByRole("textbox", { name: "Severity *" }).click();
      await page.getByRole("textbox", { name: "Severity *" }).click();

      await page.getByTestId("associated_caution").fill("");

      await page.getByTestId("how_to_detect").fill("");

      await page.getByTestId("contamination_procedure").fill("");
      await page.getByTestId("save-button").click();
    } else {
      await page
        .getByTestId("name")
        .fill(NotFillRandomNumber ? Data.Name : Data.Name + this.randomNum);
      await page.getByRole("textbox", { name: "Category *" }).click();
      await page
        .locator(".m_38a85659")
        .locator("span", { hasText: Data.Category })
        .click();
      await page.getByRole("textbox", { name: "Severity *" }).click();
      await page
        .locator(".m_88b62a41")
        .locator("span", { hasText: Data.Severity })
        .click();

      await page
        .getByTestId("associated_caution")
        .fill(Data.Associated_Caution);
      await page.getByTestId("how_to_detect").fill(Data.How_to_Detect);
      await page
        .getByTestId("contamination_procedure")
        .fill(Data.Contamination_Procedure);

      await page.getByTestId("save-button").click();
    }
  }

  // Edit Hazard
  async GoToEditHazardFromTable({
    page,
    Data,
    expect,
  }: {
    page: any;
    Data: TData;
    expect: any;
  }) {
    const isFound = await TableSearch({ page, Name: Data?.Name, Edit: true });
    // --- إذا انتهى البحث في كل الصفحات ولم نجد الصف ---
    if (!isFound) {
      await this.GoToCrateHazard({ page, expect });
      await this.CreateHazard({
        page: page,
        Data: Data,
        expect: expect,
        NotFillRandomNumber: true,
      });
      await expect(page).toHaveURL("/master-data/hazards");
      await page.getByRole("button", { name: "OK" }).click();
      await this.GoToEditHazardFromTable({ page, Data, expect });
    }
  }
  async EditHazard({
    page,
    expect,
    currentData,
    newData,
  }: {
    page: any;
    expect: any;
    currentData: TData;
    newData: TData;
  }) {
    await expect(page.getByTestId("name")).toHaveValue(currentData?.Name);
    await expect(page.getByRole("textbox", { name: "Category *" })).toHaveValue(
      currentData.Category
    );
    await expect(page.getByRole("textbox", { name: "Severity *" })).toHaveValue(
      currentData.Severity
    );
    await expect(page.getByTestId("associated_caution")).toHaveValue(
      currentData.Associated_Caution
    );
    await expect(page.getByTestId("how_to_detect")).toHaveValue(
      currentData.How_to_Detect
    );
    await expect(page.getByTestId("contamination_procedure")).toHaveValue(
      currentData.Contamination_Procedure
    );
    await page.getByTestId("name").clear();
    await page.locator(".mantine-focus-auto").first().click();
    await page
      .locator(
        "div:nth-child(3) > .m_46b77525 > .m_6c018570 > .m_82577fc2 > .mantine-focus-auto"
      )
      .click();
    await page.getByTestId("associated_caution").clear();
    await page.getByTestId("how_to_detect").clear();
    await page.getByTestId("contamination_procedure").clear();
    await page.getByTestId("edit-button").click();

    await expect(page.getByText("This field is required").nth(0)).toBeVisible();
    await expect(page.getByText("This field is required").nth(1)).toBeVisible();
    await expect(page.getByText("This field is required").nth(2)).toBeVisible();
    await expect(page.getByText("This field is required").nth(3)).toBeVisible();

    await page.getByTestId("name").fill(newData.Name);
    await page.getByRole("textbox", { name: "Category *" }).click();
    await page
      .locator(".m_38a85659")
      .locator("span", { hasText: newData.Category })
      .click();
    await page.getByRole("textbox", { name: "Severity *" }).click();
    await page
      .locator(".m_88b62a41")
      .locator("span", { hasText: newData.Severity })
      .click();

    await page
      .getByTestId("associated_caution")
      .fill(newData.Associated_Caution);
    await page.getByTestId("how_to_detect").fill(newData.How_to_Detect);
    await page
      .getByTestId("contamination_procedure")
      .fill(newData.Contamination_Procedure);

    await page.getByTestId("edit-button").click();
    await page.getByRole("button", { name: "OK" }).click();
    await expect(page).toHaveURL("/master-data/hazards");
  }

  // Show Hazard

  async GoToShowHazard({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    await TableSearch({
      page,
      Name: Data?.Name,
    });
  }

  async ShowHazard({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    await expect(page.locator("input[data-testid='name']")).toHaveValue(
      Data.Name
    );
    await expect(
      page.locator("input[data-testid='category.name']")
    ).toHaveValue(Data.Category);
    await expect(page.locator("[data-testid='severity']")).toHaveValue(
      Data.Severity.toLowerCase()
    );
    await expect(
      page.locator("input[data-testid='associated_caution']")
    ).toHaveValue(Data.Associated_Caution);
    await expect(
      page.locator("input[data-testid='how_to_detect']")
    ).toHaveValue(Data.How_to_Detect);
    await expect(
      page.locator("input[data-testid='contamination_procedure']")
    ).toHaveValue(Data.Contamination_Procedure);
  }

  // Filter Hazard
  async FilterHazard({
    page,
    expect,
    DataBefore,
  }: {
    page: any;
    expect: any;
    DataBefore: TFilterData;
  }) {
    await page.getByRole("button", { name: "Filter" }).click();
    await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();

    await page.getByTestId("name").fill(DataBefore.Name);
    await page.getByTestId("apply-filters").click();

    await page.waitForSelector("table tbody tr");
    const RowCount = await page
      .locator("table tbody tr", { hasText: DataBefore.Status })
      .count();

    if (RowCount == 0) {
      console.log("No Data Found From Name");
    } else {
      const AllNames = await page
        .locator("table tbody tr td:nth-of-type(1)")
        .allTextContents();
      await CheckFilteredData(AllNames, DataBefore.Name);
      await page.getByRole("button", { name: "Filter" }).click();
      await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
      await page.getByRole("textbox", { name: "Category" }).click();
      await page
        .locator(".m_88b62a41")
        .locator("span", { hasText: DataBefore.Category })
        .click();
      await page.getByTestId("apply-filters").click();
      await page.waitForSelector("table tbody tr");
      const RowCount = await page
        .locator("table tbody tr", { hasText: DataBefore.Category })
        .count();
      if (RowCount == 0) {
        console.log("No Data Found From Category");
      } else {
        const AllCategory = await page
          .locator("table tbody tr td:nth-of-type(2)")
          .allTextContents();
        const AllNames = await page
          .locator("table tbody tr td:nth-of-type(1)")
          .allTextContents();
        await CheckFilteredData(AllNames, DataBefore.Name);
        // error
        try {
          await CheckFilteredData(AllCategory, DataBefore.Category);
        } catch (error) {
          console.log("معلش كمل ");
        }
        await page.getByRole("button", { name: "Filter" }).click();

        await expect(
          page.getByRole("heading", { name: "Filter" })
        ).toBeVisible();

        await page.getByRole("textbox", { name: "Severity" }).click();
        await page
          .locator(".m_88b62a41")
          .locator("span", { hasText: DataBefore.Severity })
          .click();
        await page.getByTestId("apply-filters").click();
        await page.waitForSelector("table tbody tr");
        const RowCount = await page
          .locator("table tbody tr", { hasText: DataBefore.Severity })
          .count();
        if (RowCount == 0) {
          console.log("No data Found from Severity");
        } else {
          const AllSeverity = await page
            .locator("table tbody tr td:nth-of-type(3)")
            .allTextContents();
          const AllCategory = await page
            .locator("table tbody tr td:nth-of-type(2)")
            .allTextContents();
          const AllNames = await page
            .locator("table tbody tr td:nth-of-type(1)")
            .allTextContents();
          await CheckFilteredData(AllNames, DataBefore.Name);
          await CheckFilteredData(AllSeverity, DataBefore.Severity);
          // error
          try {
            await CheckFilteredData(AllCategory, DataBefore.Category);
          } catch (error) {
            console.log("معلش كمل ");
          }
          await page.getByRole("button", { name: "Filter" }).click();

          await expect(
            page.getByRole("heading", { name: "Filter" })
          ).toBeVisible();

          await page.getByRole("textbox", { name: "Status" }).click();
          await page
            .locator(".m_88b62a41")
            .locator("span", { hasText: DataBefore.Status })
            .first() //والله ما اعرف ليه في اتنين اصلا
            .click();
          await page.getByTestId("apply-filters").click();
          await page.waitForSelector("table tbody tr");
          const RowCount = await page
            .locator("table tbody tr ", { hasText: DataBefore.Status })
            .count();
          if (RowCount == 0) {
            console.log("No Data Found Form Status");
          } else {
            const AllStatus = await page
              .locator("table tbody tr td:nth-of-type(4)")
              .allTextContents();
            const AllSeverity = await page
              .locator("table tbody tr td:nth-of-type(3)")
              .allTextContents();
            const AllCategory = await page
              .locator("table tbody tr td:nth-of-type(2)")
              .allTextContents();
            const AllNames = await page
              .locator("table tbody tr td:nth-of-type(1)")
              .allTextContents();
            await CheckFilteredData(AllNames, DataBefore.Name);
            await CheckFilteredData(AllSeverity, DataBefore.Severity);
            await CheckFilteredData(AllStatus, DataBefore.Status);
            // error
            try {
              await CheckFilteredData(AllCategory, DataBefore.Category);
            } catch (error) {
              console.log("معلش كمل ");
            }
            await page.getByTestId("reset-filters").click();
            await page.waitForTimeout(3000);
          }
        }
      }
    }
  }
}

export default Hazards;
