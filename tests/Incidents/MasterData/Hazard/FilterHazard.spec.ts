import { expect, test } from "@playwright/test";
//Page
import login from "../../../../Pages/Login/Login";
import Hazards from "../../../../Pages/MasterData/Hazards/Hazards";
//Data
import Data from "../../../../Data/MasterData/Hazard.json";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToHazards(page, expect);
});

test("Filter Data", async ({ page }) => {
  const hazard = new Hazards();
  await hazard.FilterHazard({
    page,
    expect,
    DataBefore: Data.Edit.Before,
  });
});
