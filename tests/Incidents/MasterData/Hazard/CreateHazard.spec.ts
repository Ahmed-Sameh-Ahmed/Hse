import { expect, test } from "@playwright/test";
//Page
import login from "../../../../Pages/Login/Login";
import Hazards from "../../../../Pages/MasterData/Hazards/Hazards";
//Data
import Data from "../../../../Data/MasterData/Hazard.json";

test.beforeEach(async ({ page }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterDataPage = await Home.GoToMasterData(page, expect);
  await MasterDataPage.GoToHazards(page, expect);
});

test("Crate Hazard With Right Data", async ({ page }) => {
  const hazards = new Hazards();
  await hazards.GoToCrateHazard(page, expect);
  await hazards.CreateHazard(page, expect, Data.Right);
  await expect(page).toHaveURL("/master-data/hazards");
  await page.getByRole("button", { name: "OK" }).click();
});

test("Empty Fields", async ({ page }) => {
  const Empty = true;
  const hazards = new Hazards();
  await hazards.GoToCrateHazard(page, expect);
  await hazards.CreateHazard(page, expect, Data.Right, Empty);

  await expect(page.getByText("This field is required").nth(0)).toBeVisible();
  await expect(page.getByText("This field is required").nth(1)).toBeVisible();
  await expect(page.getByText("This field is required").nth(2)).toBeVisible();
  await expect(page.getByText("This field is required").nth(3)).toBeVisible();
});

test("Crate Hazard With Wrong Data", async ({ page }) => {
  const hazards = new Hazards();
  await hazards.GoToCrateHazard(page, expect);
  await hazards.CreateHazard(page, expect, Data.Wrong);

  await expect(page.getByText("Name must be at least 2")).toBeVisible();
});
