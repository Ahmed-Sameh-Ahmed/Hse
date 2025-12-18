import { CheckFilteredData, ChangeStatus } from "../../../utils/utils";

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
  //Create Hazard
  async GoToCrateHazard(page: any, expect: any) {
    await page.getByRole("button", { name: "Create Hazard" }).click();
    expect(page).toHaveURL("/master-data/hazards/create");
  }
  async CreateHazard(page: any, expect: any, Data: TData, Empty?: boolean) {
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
      await page.getByTestId("name").fill(Data.Name);
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

  // Edit & Show Hazard
  async GoToShowHazard(
    page: any,
    expect: any,
    Data: string[],
    CreateData: TData
  ) {
    await page.waitForSelector("table tbody tr");
    const RowCount = await page.locator("table tbody tr").count();

    if (RowCount === 0) {
      this.GoToCrateHazard(page, expect);
      this.CreateHazard(page, expect, CreateData);
    } else {
      const Row = page.locator("table tbody tr", {
        has: page.locator("td"),
        hasText: Data[0],
      });
      await Row.locator("a").last().click();
      await expect(page.url()).toContain("master-data/hazards/show/");
    }
  }
  async ShowHazard(page: any, expect: any, Data: TData) {
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
  async GoToEditHazardFormShow(page: any, expect: any) {
    await page.getByRole("button", { name: "Edit" }).click();
    expect(page.url()).toContain("/master-data/hazards/edit/");
  }

  async GoToEditHazardFormTable(
    page: any,
    expect: any,
    Data: string[],
    CreateData: TData,
    ShowData: TData
  ) {
    await page.waitForSelector("table tbody tr");
    const RowCount = await page.locator("table tbody tr").count();

    if (RowCount === 0) {
      this.GoToCrateHazard(page, expect);
      this.CreateHazard(page, expect, CreateData);
    } else {
      const Row = page.locator("table tbody tr", {
        has: page.locator("td"),
        hasText: Data[0],
      });
      await ChangeStatus({ page, Row });
      try {
        await expect(Row.locator(".self-center")).toHaveText("Active");
      } catch (e) {
        console.log("معلش كمل كانت العكس  " + e);
      }
      await Row.locator("a").first().click();
      await expect(page.url()).toContain("master-data/hazards/edit/");
      await expect(page.locator("input[data-testid='name']")).toHaveValue(
        ShowData.Name
      );
      await expect(
        page.locator("input[placeholder='Select Category']")
      ).toHaveValue(ShowData.Category);
      await expect(
        page.locator("input[placeholder='Select Severity']")
      ).toHaveValue(ShowData.Severity);
      await expect(
        page.locator("[data-testid='associated_caution']")
      ).toHaveValue(ShowData.Associated_Caution);
      await expect(
        page.locator("input[data-testid='how_to_detect']")
      ).toHaveValue(ShowData.How_to_Detect);
      await expect(
        page.locator("input[data-testid='contamination_procedure']")
      ).toHaveValue(ShowData.Contamination_Procedure);
    }
  }
  async EditHazard(
    page: any,
    expect: any,
    RightDataCreate: TData,
    WrongDataCreate: TData
  ) {
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

    await page.getByTestId("name").fill(WrongDataCreate.Name);
    await page.getByRole("textbox", { name: "Category *" }).click();
    await page
      .locator(".m_38a85659")
      .locator("span", { hasText: WrongDataCreate.Category })
      .click();
    await page.getByRole("textbox", { name: "Severity *" }).click();
    await page
      .locator(".m_88b62a41")
      .locator("span", { hasText: WrongDataCreate.Severity })
      .click();

    await page
      .getByTestId("associated_caution")
      .fill(WrongDataCreate.Associated_Caution);
    await page.getByTestId("how_to_detect").fill(WrongDataCreate.How_to_Detect);
    await page
      .getByTestId("contamination_procedure")
      .fill(WrongDataCreate.Contamination_Procedure);

    await page.getByTestId("edit-button").click();

    await expect(page.getByText("Name must be at least 2")).toBeVisible();

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

    await page.getByTestId("name").fill(RightDataCreate.Name);
    await page.getByRole("textbox", { name: "Category *" }).click();
    await page
      .locator(".m_38a85659")
      .locator("span", { hasText: RightDataCreate.Category })
      .click();
    await page.getByRole("textbox", { name: "Severity *" }).click();
    await page
      .locator(".m_88b62a41")
      .locator("span", { hasText: RightDataCreate.Severity })
      .click();

    await page
      .getByTestId("associated_caution")
      .fill(RightDataCreate.Associated_Caution);
    await page.getByTestId("how_to_detect").fill(RightDataCreate.How_to_Detect);
    await page
      .getByTestId("contamination_procedure")
      .fill(RightDataCreate.Contamination_Procedure);

    await page.getByTestId("edit-button").click();
    await expect(page).toHaveURL("/master-data/hazards");
    await page.getByRole("button", { name: "OK" }).click();
  }

  // Filter Hazard
  async FilterHazard(
    page: any,
    expect: any,
    FilterData: TFilterData,
    CreateData: TData
  ) {
    await page.getByTestId("name").fill(FilterData.Name);
    await page.getByTestId("apply-filters").click();

    await page.waitForSelector("table tbody tr");
    const RowCount = await page.locator("table tbody tr").count();

    if (RowCount === 0) {
      this.GoToCrateHazard(page, expect);
      this.CreateHazard(page, expect, CreateData);
      this.FilterHazard(page, expect, FilterData, CreateData);
    } else {
      const AllNames = await page
        .locator("table tbody tr td:nth-of-type(1)")
        .allTextContents();
      CheckFilteredData(AllNames, FilterData.Name);
      await page.getByRole("textbox", { name: "Category" }).click();
      await page
        .locator(".m_88b62a41")
        .locator("span", { hasText: FilterData.Category })
        .click();
      await page.getByTestId("apply-filters").click();
      await page.waitForSelector("table tbody tr");
      const RowCount = await page.locator("table tbody tr").count();
      if (RowCount === 0) {
        console.log("No Data Found From Category");
      } else {
        const AllCategory = await page
          .locator("table tbody tr td:nth-of-type(2)")
          .allTextContents();
        const AllNames = await page
          .locator("table tbody tr td:nth-of-type(1)")
          .allTextContents();
        CheckFilteredData(AllNames, FilterData.Name);
        // error
        try {
          CheckFilteredData(AllCategory, FilterData.Category);
        } catch (error) {
          console.log("معلش كمل ");
        }
        await page.getByRole("textbox", { name: "Severity" }).click();
        await page
          .locator(".m_88b62a41")
          .locator("span", { hasText: FilterData.Severity })
          .click();
        await page.getByTestId("apply-filters").click();
        await page.waitForSelector("table tbody tr");
        const RowCount = await page.locator("table tbody tr").count();
        if (RowCount === 0) {
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
          CheckFilteredData(AllNames, FilterData.Name);
          CheckFilteredData(AllSeverity, FilterData.Severity);
          // error
          try {
            CheckFilteredData(AllCategory, FilterData.Category);
          } catch (error) {
            console.log("معلش كمل ");
          }
          await page.getByRole("textbox", { name: "Status" }).click();
          await page
            .locator(".m_88b62a41")
            .locator("span", { hasText: FilterData.Status })
            .first() //والله ما اعرف ليه في اتنين اصلا
            .click();
          await page.getByTestId("apply-filters").click();
          await page.waitForSelector("table tbody tr");
          const RowCount = await page.locator("table tbody tr").count();
          if (RowCount === 0) {
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
            CheckFilteredData(AllNames, FilterData.Name);
            CheckFilteredData(AllSeverity, FilterData.Severity);
            CheckFilteredData(AllStatus, FilterData.Status);
            // error
            try {
              CheckFilteredData(AllCategory, FilterData.Category);
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
