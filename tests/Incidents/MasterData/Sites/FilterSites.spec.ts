import { expect, test } from "@playwright/test";
//Page
import login from "../../../../Pages/Login/Login";
import Sites from "../../../../Pages/MasterData/Sites/Sites";
//Data
import Data from "../../../../Data/MasterData/Sites.json";
import { CheckFilteredData } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToSites(page, expect);
});

test("Filter sites ", async ({ page }) => {
  await page.getByRole("button", { name: "Filter" }).first().click();
  await expect(
    await page.getByRole("heading", { name: "Filter" })
  ).toBeVisible();
  await page.getByTestId("site_name").fill(Data.Edit.After.name);
  await page.getByTestId("apply-filters").click();
  await page.waitForSelector("table tbody tr");
  const RowCount = await page
    .locator("table tbody tr td", { hasText: Data.Edit.After.name })
    .count();
  if (RowCount == 0) {
    console.log("No Data with this filter");
  } else {
    const AllNames = await page
      .locator("table tbody tr td:nth-of-type(1)")
      .allTextContents();
    await CheckFilteredData(AllNames, Data.Edit.After.name);
    await page.getByRole("button", { name: "Filter" }).first().click();
    await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
    await page.getByRole("textbox", { name: "Location" }).click();
    await page
      .getByRole("option")
      .getByText(Data.Edit.After.Location, { exact: true })
      .click();
    await page.getByTestId("apply-filters").click();
    await page.waitForSelector("table tbody tr");
    const RowCount = await page
      .locator("table tbody tr", { hasText: Data.Edit.After.name })
      .count();
    if (RowCount == 0) {
      console.log("No Data with this filter");
    } else {
      const AllNames = await page
        .locator("table tbody tr td:nth-of-type(1)")
        .allTextContents();
      const AllLocations = await page
        .locator("table tbody tr td:nth-of-type(2)")
        .allTextContents();
      await CheckFilteredData(AllNames, Data.Edit.After.name);
      await CheckFilteredData(AllLocations, Data.Edit.After.Location);
      await page.getByRole("button", { name: "Filter" }).first().click();

      await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();

      await page
        .locator("#react-select-7-input")
        .fill(Data.Edit.After.ResponsiblePerson);
      await page
        .getByRole("option", { name: Data.Edit.After.ResponsiblePerson })
        .click();
      await page.getByTestId("apply-filters").click();

      await page.waitForSelector("table tbody tr");
      const RowCount = await page
        .locator("table tbody tr", { hasText: Data.Edit.After.name })
        .count();
      if (RowCount == 0) {
        console.log("No Data with this filter Status");
      } else {
        const AllNames = await page
          .locator("table tbody tr td:nth-of-type(1)")
          .allTextContents();
        const AllLocations = await page
          .locator("table tbody tr td:nth-of-type(2)")
          .allTextContents();
        const AllResponsiblePerson = await page
          .locator("table tbody tr td:nth-of-type(3)")
          .allTextContents();

        await CheckFilteredData(AllNames, Data.Edit.After.name);
        await CheckFilteredData(AllLocations, Data.Edit.After.Location);
        await CheckFilteredData(
          AllResponsiblePerson,
          Data.Edit.After.ResponsiblePerson
        );
        await page.getByRole("button", { name: "Filter" }).first().click();
        await expect(
          page.getByRole("heading", { name: "Filter" })
        ).toBeVisible();
        await page.getByRole("textbox", { name: "Status" }).click();
        await page
          .getByRole("option", {
            name: Data.Edit.After.Status,
            exact: true,
          })
          .click();
        await page.getByTestId("apply-filters").click();
        await page.waitForSelector("table tbody tr");
        const RowCount = await page
          .locator("table tbody tr", { hasText: Data.Edit.After.name })
          .count();
        if (RowCount == 0) {
          console.log("No Data with this filter Status");
        } else {
          const AllNames = await page
            .locator("table tbody tr td:nth-of-type(1)")
            .allTextContents();
          const AllLocations = await page
            .locator("table tbody tr td:nth-of-type(2)")
            .allTextContents();
          const AllResponsiblePerson = await page
            .locator("table tbody tr td:nth-of-type(3)")
            .allTextContents();
          const AllStatus = await page
            .locator("table tbody tr td:nth-of-type(4)")
            .allTextContents();

          await CheckFilteredData(AllNames, Data.Edit.After.name);
          await CheckFilteredData(AllLocations, Data.Edit.After.Location);
          await CheckFilteredData(
            AllResponsiblePerson,
            Data.Edit.After.ResponsiblePerson
          );
          await CheckFilteredData(AllStatus, Data.Edit.After.Status, true);
        }
      }
    }
  }
});
