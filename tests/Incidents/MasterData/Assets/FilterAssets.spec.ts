import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/Assets.json";

import Assets from "../../../../Pages/MasterData/Assets/Assets";
import { CheckFilteredData, TableSearch } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToAssets(page, expect);
});

test("Filter", async ({ page }) => {
  await page.getByRole("button", { name: "Filter" }).first().click();
  await expect(
    await page.getByRole("heading", { name: "Filter" })
  ).toBeVisible();
  await page.getByTestId("name").fill(Data.Edit.After.name);
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
    await page.getByRole("textbox", { name: "Site" }).click();
    await page
      .getByRole("option")
      .getByText(Data.Edit.After.Site, { exact: true })
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
      const AllSites = await page
        .locator("table tbody tr td:nth-of-type(3)")
        .allTextContents();
      await CheckFilteredData(AllNames, Data.Edit.After.name);
      await CheckFilteredData(AllSites, Data.Edit.After.Site);
      await page.getByRole("button", { name: "Filter" }).first().click();
      await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
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
        const AllSites = await page
          .locator("table tbody tr td:nth-of-type(3)")
          .allTextContents();
        const AllStatus = await page
          .locator("table tbody tr td:nth-of-type(6)")
          .allTextContents();
        await CheckFilteredData(AllNames, Data.Edit.After.name);
        await CheckFilteredData(AllSites, Data.Edit.After.Site);
        await CheckFilteredData(AllStatus, Data.Edit.After.Status);
      }
    }
  }
});
