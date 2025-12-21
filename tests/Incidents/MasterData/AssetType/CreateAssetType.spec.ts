import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/AssetType.json";

import AssetTypes from "../../../../Pages/MasterData/AssetTypes/AssetTypes";

test.beforeEach(async ({ page }) => {
  const home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await home.GoToMasterData(page, expect);
  await MasterData.GoToAssetType(page, expect);
});

test("Empty fields", async ({ page }) => {
  //go to create

  const AssetType = new AssetTypes();
  await AssetType.GoToCreateAssetType({ page, expect });
  //create

  await AssetType.CreateAssetType({ page, expect, Empty: true });
});

test("Create Asset type (Required)", async ({ page }) => {
  //go to create
  const AssetType = new AssetTypes();
  await AssetType.GoToCreateAssetType({ page, expect });

  //create
  await AssetType.CreateAssetType({ page, expect, Data: Data.Required });
});

test("Create Asset type (All Fields)", async ({ page }) => {
  //go to create
  const AssetType = new AssetTypes();
  await AssetType.GoToCreateAssetType({ page, expect });

  //create
  await AssetType.CreateAssetType({ page, expect, Data: Data.Required });
});

test("Create Asset type (Required) (duplicate)", async ({ page }) => {
  try {
    //go to create
    const AssetType = new AssetTypes();
    await AssetType.GoToCreateAssetType({ page, expect });

    //create
    await AssetType.CreateAssetType({
      page,
      expect,
      Data: Data.Required,
      NotRandomNumber: true,
    });

    //   // _____________________________________________________________________________
    //go to create
    await AssetType.GoToCreateAssetType({ page, expect });

    //create
    await AssetType.CreateAssetType({
      page,
      expect,
      Data: Data.Required,
      NotRandomNumber: true,
      Duplicate: true,
    });
  } catch (error) {
    console.log("name is exist from first Create");
  }
});
