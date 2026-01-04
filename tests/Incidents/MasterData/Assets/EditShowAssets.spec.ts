import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/Assets.json";

import Assets from "../../../../Pages/MasterData/Assets/Assets";
import { TableSearch } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToAssets(page, expect);
});

test("Edit", async ({ page }) => {
  const asset = new Assets();

  // Go TO Edit
  await asset.GoToEditAsset({ page, Data: Data.Edit.Before, expect });
  // Edit
  await asset.EditAsset({
    page,
    DataBefore: Data.Edit.Before,
    DataAfter: Data.Edit.After,
    expect,
  });
});
test("Show", async ({ page }) => {
  const asset = new Assets();
  await asset.GoToShowAsset({ page, Data: Data.Edit.Before, expect });
  await asset.ShowAsset({ page, Data: Data.Edit.Before, expect });
});
