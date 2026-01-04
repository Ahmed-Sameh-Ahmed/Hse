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

test("Edit Cause (Sub-cause) (Required)", async ({ page }) => {
  const cause = new Causes();
  await cause.GoToEditCause({
    page,
    expect,
    Data: Data.Edit.SubCause.Before,
    subCause: true,
  });
  //بيضرب علي ال description
  await cause.EditCause({
    page,
    DataBefore: Data.Edit.SubCause.Before,
    DataAfter: Data.Edit.SubCause.After,
    expect,
  });
});

test("Edit Cause (Parent Cause) (Required)", async ({ page }) => {
  const cause = new Causes();
  await cause.GoToEditCause({
    page,
    expect,
    Data: Data.Edit.Cause.Before,
    subCause: false,
  });
  await cause.EditCause({
    page,
    DataBefore: Data.Edit.Cause.Before,
    DataAfter: Data.Edit.Cause.After,
    expect,
    Category: true,
  });
});

// --------------------------------------------------------------------------------

test("Show Cause (Sub-cause) (Required)", async ({ page }) => {
  const cause = new Causes();
  await cause.GoToShowCause({ page, expect, Data: Data.Edit.SubCause.After });
  await cause.ShowCause({ page, expect, Data: Data.Edit.SubCause.After });
});
test("Show Cause (Parent Cause) (Required)", async ({ page }) => {
  const cause = new Causes();
  await cause.GoToShowCause({ page, expect, Data: Data.Edit.Cause.After });
  await cause.ShowCause({
    page,
    expect,
    Data: Data.Edit.Cause.After,
    Category: true,
  });
});
