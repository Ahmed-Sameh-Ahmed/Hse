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

test("Edit Hazard", async ({ page }) => {
  const hazard = new Hazards();
  await hazard.GoToEditHazardFromTable({
    page,
    expect,
    Data: Data.Edit.Before,
  });
  await hazard.EditHazard({
    page,
    expect,
    currentData: Data.Edit.Before,
    newData: Data.Edit.After,
  });
});

test("Show Hazard", async ({ page }) => {
  const hazard = new Hazards();
  await hazard.GoToShowHazard({ page, expect, Data: Data.Edit.Before });

  await hazard.ShowHazard({ page, expect, Data: Data.Edit.Before });
});
