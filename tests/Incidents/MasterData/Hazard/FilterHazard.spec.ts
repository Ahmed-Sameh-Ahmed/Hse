import { expect, test } from "@playwright/test";
//Page
import login from "../../../Pages/Login/Login";
import Hazards from "../../../Pages/MasterData/Hazards/Hazards";
//Data
import Data from "../../../Data/MasterData/Hazard.json";

test.beforeEach(async ({ page }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterDataPage = await Home.GoToMasterData(page, expect);
  await MasterDataPage.GoToHazards(page, expect);
});

test("Filter Data", async ({ page }) => {
  const hazard = new Hazards();
  await hazard.FilterHazard(page, expect, Data.FilterData, Data.Right);
});
