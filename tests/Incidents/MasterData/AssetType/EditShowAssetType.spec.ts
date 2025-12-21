import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/AssetType.json";

import AssetTypes from "../../../../Pages/MasterData/AssetTypes/AssetTypes";

import { ChangeStatus } from "../../../../utils/utils";

test.beforeEach(async ({ page }) => {
  const home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await home.GoToMasterData(page, expect);
  await MasterData.GoToAssetType(page, expect);
});

test("Edit", async ({ page }) => {
  const AssetType = new AssetTypes();
  await AssetType.GoToEditAssetType({ page, expect, Data: Data.Edit.Before });
  await AssetType.EditAssetType({
    page,
    expect,
    DataBefore: Data.Edit.Before,
    DataAfter: Data.Edit.After,
  });

  // Edit
});

test("Show", async ({ page }) => {
  const AssetType = new AssetTypes();
  await AssetType.GoToShowAssetType({ page, expect, Data: Data.Edit.Before });
  await AssetType.ShowAssetType({
    page,
    expect,
    Data: Data.Edit.After,
  });
});
