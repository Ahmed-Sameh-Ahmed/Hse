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

test("Empty", async ({ page }) => {
  const assets = new Assets();
  await assets.GoToCreateAsset({ page, expect });
  await assets.CreateAsset({ page, expect, Data: Data.Create, Empty: true });
});
test("Create all Fields (Required)", async ({ page }) => {
  const assets = new Assets();
  await assets.GoToCreateAsset({ page, expect });
  await assets.CreateAsset({ page, expect, Data: Data.Create });
});
test("Create all Fields (Required) (Duplicate)", async ({ page }) => {
  const assets = new Assets();

  const Found = await TableSearch({ page, Name: Data.Create.name });

  if (!Found) {
    await assets.GoToCreateAsset({ page, expect });
    await assets.CreateAsset({
      page,
      expect,
      Data: Data.Create,
      notRandomNumber: true,
    });
    await assets.GoToCreateAsset({ page, expect });
    await assets.CreateAsset({
      page,
      expect,
      Data: Data.Create,
      notRandomNumber: true,
      Duplicate: true,
    });
  } else {
    await assets.GoToCreateAsset({ page, expect });
    await assets.CreateAsset({
      page,
      expect,
      Data: Data.Create,
      notRandomNumber: true,
      Duplicate: true,
    });
  }
});
