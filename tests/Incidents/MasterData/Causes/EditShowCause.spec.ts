import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/Cause.json";

import Causes from "../../../../Pages/MasterData/Causes/Causes";

test.beforeEach(async ({ page }) => {
  const home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await home.GoToMasterData(page, expect);
  await MasterData.GoToCauses(page, expect);
});

test("Edit Cause (Sub-cause) (Required)", async ({ page }) => {
  const cause = new Causes();
  await cause.GoToEditCause({ page, expect, Data: Data.Edit.Before });
  //بيضرب علي ال description
  await cause.EditCause({
    page,
    DataBefore: Data.Edit.Before,
    DataAfter: Data.Edit.After,
    expect,
  });
});

// test("Edit Cause (Category) (Required)", async ({ page }) => {
//   const cause = new Causes();
//   await cause.GoToEditCause({ page, expect, Data: Data.Edit.Before });
//   await cause.EditCause({
//     page,
//     DataBefore: Data.Edit.Before,
//     DataAfter: Data.Edit.After,
//     expect,
//     Category: true,
//   });
// });

test("Show Cause (Sub-cause) (Required)", async ({ page }) => {
  const cause = new Causes();
  await cause.GoToShowCause({ page, expect, Data: Data.Edit.After });
  await cause.ShowCause({ page, expect, Data: Data.Edit.After });
});
