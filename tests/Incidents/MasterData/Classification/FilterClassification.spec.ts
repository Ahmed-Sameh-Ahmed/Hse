import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/Classification.json";

import Classification from "../../../../Pages/MasterData/Classification/Classification";
import { CheckFilteredData } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToClassifications(page, expect);
});

test("Filter", async ({ page }) => {
  await page.getByRole("button", { name: "Filter" }).first().click();
  await expect(
    await page.getByRole("heading", { name: "Filter" })
  ).toBeVisible();
  await page.getByTestId("name").fill(Data.Edit.Secondary.After.Name);
  await page.getByTestId("apply-filters").click();

  await page.waitForSelector("table tbody tr");
  const RowCount = await page
    .locator("table tbody tr td", { hasText: Data.Edit.Secondary.After?.Name })
    .count();
  if (RowCount == 0) {
    console.log("No Data with this filter");
  } else {
    const AllNames = await page
      .locator("table tbody tr td:nth-of-type(1)")
      .allTextContents();
    await CheckFilteredData(AllNames, Data.Edit.Secondary.After?.Name);
    await page.getByRole("button", { name: "Filter" }).first().click();
    await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
    await page.getByRole("textbox", { name: "Parent Classification" }).click();
    await page
      .getByRole("option")
      .getByText(Data.Edit.Secondary.After.Parent, { exact: true })
      .click();
    await page.getByTestId("apply-filters").click();
    await page.waitForSelector("table tbody tr");
    const RowCount = await page
      .locator("table tbody tr", { hasText: Data.Edit.Secondary.After?.Name })
      .count();
    if (RowCount == 0) {
      console.log("No Data with this filter");
    } else {
      const AllNames = await page
        .locator("table tbody tr td:nth-of-type(1)")
        .allTextContents();
      const AllParent = await page
        .locator("table tbody tr td:nth-of-type(2)")
        .allTextContents();
      await CheckFilteredData(AllNames, Data.Edit.Secondary.After?.Name);
      await CheckFilteredData(AllParent, Data.Edit.Secondary.After.Parent);
      await page.getByRole("button", { name: "Filter" }).first().click();
      await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
      await page.getByRole("textbox", { name: "Status" }).click();
      await page.getByRole("option", { name: "Active", exact: true }).click();
      await page.getByTestId("apply-filters").click();

      await page.waitForSelector("table tbody tr");
      const RowCount = await page
        .locator("table tbody tr", { hasText: Data.Edit.Secondary.After?.Name })
        .count();
      if (RowCount == 0) {
        console.log("No Data with this filter Status");
      } else {
        const AllNames = await page
          .locator("table tbody tr td:nth-of-type(1)")
          .allTextContents();
        const AllParent = await page
          .locator("table tbody tr td:nth-of-type(2)")
          .allTextContents();
        const AllStatus = await page
          .locator("table tbody tr td:nth-of-type(3)")
          .allTextContents();
        await CheckFilteredData(AllNames, Data.Edit.Secondary.After?.Name);
        await CheckFilteredData(AllParent, Data.Edit.Secondary.After.Parent);
        await CheckFilteredData(
          AllStatus,
          Data.Edit.Secondary.After?.status,
          true
        );
      }
    }
  }
});
