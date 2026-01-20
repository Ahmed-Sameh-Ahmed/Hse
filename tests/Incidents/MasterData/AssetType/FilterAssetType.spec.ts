import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/AssetType.json";

import AssetTypes from "../../../../Pages/MasterData/AssetTypes/AssetTypes";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToAssetType(page, expect);
});

test("Filter Asset Type", async ({ page }) => {
  const AssetType = new AssetTypes();

  await AssetType.FilterAssetType({ page, expect, Data: Data.Edit.After });
});
