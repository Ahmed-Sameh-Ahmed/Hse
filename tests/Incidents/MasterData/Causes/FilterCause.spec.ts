import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/Cause.json";

import Causes from "../../../../Pages/MasterData/Causes/Causes";

test.beforeEach(async ({ page }) => {
  const home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await home.GoToMasterData(page, expect);
  await MasterData.GoToCauses(page, expect);
});

test("Filter Cause(sub cause)", async ({ page }) => {
  const cause = new Causes();
  await cause.FilterCause({ page, expect, DataAfter: Data.Edit.After });
});

test("Filter Cause(Category)", async ({ page }) => {
  const cause = new Causes();

  await cause.FilterCause({
    page,
    expect,
    DataAfter: Data.Edit.After,
    isCategory: true,
    DataAfterCategory: Data.Edit.AfterCategory,
  });
});
