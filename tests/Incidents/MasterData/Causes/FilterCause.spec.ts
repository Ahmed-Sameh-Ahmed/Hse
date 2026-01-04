import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/Cause.json";

import Causes from "../../../../Pages/MasterData/Causes/Causes";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToCauses(page, expect);
});

test.use({
  launchOptions: {
    slowMo: 2000, // 1000 = 1 ثانية، ممكن تخليها 500 (نص ثانية)
  },
});

test("Filter Cause(sub cause)", async ({ page }) => {
  const cause = new Causes();
  await cause.FilterCause({
    page,
    expect,
    DataAfter: Data.Edit.SubCause.After,
  });
});

test("Filter Cause(Category)", async ({ page }) => {
  const cause = new Causes();

  await cause.FilterCause({
    page,
    expect,
    DataAfter: Data.Edit.Cause.After,
    isCategory: true,
    DataAfterCategory: Data.Edit.Cause.After,
  });
});
