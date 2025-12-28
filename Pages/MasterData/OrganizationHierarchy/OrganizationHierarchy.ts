import {
  CheckFilteredData,
  ChangeStatus,
  randomNumber,
  safeAction,
  TableSearch,
} from "../../../utils/utils";

type TData = {
  LevelID: string;
  LevelName: string;
  Position: string;
  ReportsTo: string;
  Description: string;
};
type TFilterData = {
  Level: string;
  PositionName: string;
  ReportsTo: string;
  Status: string;
};

class OrganizationHierarchy {
  RandomNumber = randomNumber();

  // Create Organization Hierarchy
  async GoToCreateOrganizationHierarchy({
    page,
    expect,
  }: {
    page: any;
    expect: any;
  }) {
    await page
      .getByRole("button", { name: "Create Organization Hierarchy" })
      .click();
    await expect(page).toHaveURL("/master-data/organization-hierarchy/create");
  }
  async CreateOrganizationHierarchy({
    page,
    expect,
    data,
    empty,
    NotRandomNumber,
    Duplicate,
  }: {
    page: any;
    expect: any;
    data: TData;
    empty?: boolean;
    NotRandomNumber?: boolean;
    Duplicate?: boolean;
  }) {
    if (empty) {
      await page.getByTestId("save-button").click();
    } else {
      await page.getByRole("textbox", { name: "Level ID *" }).click();
      const LevelIdContainer = page.locator(".m_c0783ff9");
      await LevelIdContainer.locator("span", { hasText: data.LevelID })
        .first()
        .click();

      await page
        .getByTestId("name")
        .fill(
          NotRandomNumber ? data.LevelName : data.LevelName + this.RandomNumber
        );

      await page.getByRole("textbox", { name: "Position *" }).click();
      await page
        .getByRole("option", {
          name: data.Position,
        })
        .click();

      if (data.ReportsTo === "") {
        // مش عاوز يمسك العنصر و هو disabled
        expect(
          await page
            .locator("div:nth-child(4) > .m_46b77525 > .m_6c018570")
            .isDisabled()
        ).toBeFalsy();
      } else {
        await page.getByRole("textbox", { name: "Reports To *" }).click();
        const ReportsToContainer = page.locator(".m_c0783ff9");
        await ReportsToContainer.locator("span", {
          hasText: data.ReportsTo,
        })
          .first()
          .click();
      }

      await page.getByTestId("description").fill(data.Description);

      await page.getByTestId("save-button").click();
      if (Duplicate) {
        await expect(
          page.getByText(
            "This position is already assigned to a hierarchy level."
          )
        ).toBeVisible();
      } else {
        await expect(page).toHaveURL("/master-data/organization-hierarchy");
        await page.getByRole("button", { name: "OK" }).click();
      }
    }
  }

  // Show Organization Hierarchy
  async GoToShowOrganizationHierarchy({
    page,
    expect,
    DataBefore,
  }: {
    page: any;
    expect: any;
    DataBefore: TData;
  }) {
    const isFound = await TableSearch({
      page,
      Name: DataBefore.LevelName,
      Show: true,
    });

    if (!isFound) {
      await this.GoToCreateOrganizationHierarchy({ page, expect });
      await this.CreateOrganizationHierarchy({
        page,
        expect,
        data: DataBefore,
        NotRandomNumber: true,
      });
      await this.GoToShowOrganizationHierarchy({ page, expect, DataBefore });
    }
  }
  async ShowOrganizationHierarchy({
    page,
    expect,
    data,
  }: {
    page: any;
    expect: any;
    data: TData;
  }) {
    await expect(page.locator("input[data-testid='level']")).toHaveValue(
      data.LevelID
    );

    await expect(page.locator("input[data-testid='name']")).toHaveValue(
      data.LevelName
    );

    await expect(
      page.locator("input[data-testid='position.name']")
    ).toHaveValue(data.Position);
    await expect(
      page.locator("input[data-testid='report_to.name']")
    ).toHaveValue(data.ReportsTo);
    await expect(
      page.locator("textarea[data-testid='description']")
    ).toHaveValue(data.Description);
  }

  // Edit Organization Hierarchy

  async GoToEditOrganizationHierarchy({
    page,
    expect,
    data,
  }: {
    page: any;
    expect: any;
    data: TData;
  }) {
    await TableSearch({
      page,
      Name: data?.LevelName,
      Edit: true,
    });
  }
  async EditOrganizationHierarchy({
    page,
    expect,
    data,
  }: {
    page: any;
    expect: any;
    data: TData;
  }) {
    await expect(page.getByRole("textbox", { name: "Level ID *" })).toHaveValue(
      data.LevelID
    );
    await expect(page.getByTestId("name")).toHaveValue(data.LevelName);
    await expect(page.getByRole("textbox", { name: "Position *" })).toHaveValue(
      data.Position
    );
    await expect(
      page.getByRole("textbox", { name: "Reports To *" })
    ).toHaveValue(data.ReportsTo);
    await expect(page.getByTestId("description")).toHaveValue(data.Description);

    await page.locator(".mantine-focus-auto").first().click();
    await page.getByTestId("name").clear();
    await page
      .locator(
        "div:nth-child(3) > .m_46b77525 > .m_6c018570 > .m_82577fc2 > .mantine-focus-auto"
      )
      .click();
    await page.getByTestId("description").clear();
    await page.getByTestId("edit-button").click();

    await expect(page.getByText("Level ID is required")).toBeVisible();
    await expect(page.getByText("Level name is required")).toBeVisible();
    await expect(page.getByText("Position is required")).toBeVisible();

    await page.getByRole("textbox", { name: "Level ID *" }).click();
    const LevelIdContainer = page.locator(".m_c0783ff9");
    await LevelIdContainer.locator("span", { hasText: data.LevelID })
      .first()
      .click();

    await page.getByTestId("name").fill(data.LevelName);

    await page.getByRole("textbox", { name: "Position *" }).click();
    const PositionContainer = page.locator(".m_c0783ff9");
    await PositionContainer.locator("span", {
      hasText: data.Position,
    }).click();

    await page.getByRole("textbox", { name: "Reports To *" }).click();
    const ReportsToContainer = page.locator(".m_c0783ff9");
    await ReportsToContainer.locator("span", {
      hasText: data.ReportsTo,
    }).click();

    await page.getByTestId("description").fill(data.Description);
    await page.getByTestId("description").fill("");

    await page.getByTestId("edit-button").click();

    await expect(page).toHaveURL("/master-data/organization-hierarchy");
    await page.getByRole("button", { name: "OK" }).click();
  }
  // Filter Organization Hierarchy

  async FilterOrganizationHierarchy(
    page: any,
    expect: any,
    CreateData: TData,
    FilterData: TFilterData
  ) {
    await page.getByRole("link", { name: "Organization Hierarchy" }).click();
    await page.waitForSelector("table tbody tr");
    const RowCount = await page.locator("table tbody tr").count();

    if (RowCount > 0) {
      await page.getByRole("button", { name: "Filter" }).click();
      await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
      await page.getByRole("textbox", { name: "Level" }).click();
      await page
        .locator(".m_b1336c6")
        .locator("span", { hasText: FilterData.Level })
        .click();
      await page.getByTestId("apply-filters").click();
      await page.waitForSelector("table tbody tr");
      const RowCount = await page.locator("table tbody tr").count();
      if (RowCount === 0) {
        console.log("No Data Found with this filter From Level");
      } else {
        const AllLevels = await page
          .locator("table tbody tr td:nth-of-type(2)")
          .allTextContents();
        CheckFilteredData(AllLevels, FilterData.Level);
        await page.getByRole("button", { name: "Filter" }).click();
        expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
        await page.getByRole("textbox", { name: "Position Name" }).click();
        await page
          .locator(".m_b1336c6")
          .locator("span", { hasText: FilterData.PositionName })
          .click();
        await page.getByTestId("apply-filters").click();
        await page.waitForSelector("table tbody tr");

        const RowCount = await page.locator("table tbody tr").count();
        if (RowCount === 0) {
          console.log("No Data Found with this filter From Position Name");
        } else {
          const AllLevels = await page
            .locator("table tbody tr td:nth-of-type(2)")
            .allTextContents();
          const AllPositionName = await page
            .locator("table tbody tr td:nth-of-type(3)")
            .allTextContents();
          CheckFilteredData(AllLevels, FilterData.Level);
          CheckFilteredData(AllPositionName, FilterData.PositionName);
          await page.getByRole("button", { name: "Filter" }).click();
          expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
          await page.getByRole("textbox", { name: "Reports To" }).click();
          await page
            .locator("div[role='presentation']")
            .locator("span", { hasText: FilterData.ReportsTo })
            .click();
          await page.getByTestId("apply-filters").click();
          await page.waitForSelector("table tbody tr");
          const RowCount = await page.locator("table tbody tr").count();
          if (RowCount === 0) {
            console.log("No Data Found with this filter From Reports To");
          } else {
            const AllLevels = await page
              .locator("table tbody tr td:nth-of-type(2)")
              .allTextContents();
            const AllPositionName = await page
              .locator("table tbody tr td:nth-of-type(3)")
              .allTextContents();
            const AllReportsTo = await page
              .locator("table tbody tr td:nth-of-type(4)")
              .allTextContents();
            CheckFilteredData(AllLevels, FilterData.Level);
            CheckFilteredData(AllPositionName, FilterData.PositionName);
            CheckFilteredData(AllReportsTo, FilterData.ReportsTo);
            await page.getByRole("button", { name: "Filter" }).click();
            expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
            await page.getByRole("textbox", { name: "Status" }).click();
            await page
              .locator(".m_38a85659")
              .locator("span", { hasText: FilterData.Status })
              .first()
              .click();
            await page.getByTestId("apply-filters").click();
            await page.waitForSelector("table tbody tr");
            const RowCount = await page.locator("table tbody tr").count();
            if (RowCount === 0) {
              console.log("No Data Found with this filter From Status");
            } else {
              const AllLevels = await page
                .locator("table tbody tr td:nth-of-type(2)")
                .allTextContents();
              const AllPositionName = await page
                .locator("table tbody tr td:nth-of-type(3)")
                .allTextContents();
              const AllReportsTo = await page
                .locator("table tbody tr td:nth-of-type(4)")
                .allTextContents();
              const AllStatus = await page
                .locator("table tbody tr td:nth-of-type(5)")
                .allTextContents();
              CheckFilteredData(AllLevels, FilterData.Level);
              CheckFilteredData(AllPositionName, FilterData.PositionName);
              CheckFilteredData(AllReportsTo, FilterData.ReportsTo);
              CheckFilteredData(AllStatus, FilterData.Status);
              await page.getByRole("button", { name: "Reset" }).click();
              await page.waitForTimeout(3000);
            }
          }
        }
      }
    } else {
      this.GoToCreateOrganizationHierarchy({ page, expect });
      this.CreateOrganizationHierarchy({ page, expect, data: CreateData });
      this.FilterOrganizationHierarchy(page, expect, CreateData, FilterData);
    }

    console.log(RowCount);
  }
}

export default OrganizationHierarchy;
