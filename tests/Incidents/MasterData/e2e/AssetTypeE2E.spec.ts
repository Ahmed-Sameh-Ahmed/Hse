// import Login from "../../../../Pages/Login/Login";
// import { expect, test } from "@playwright/test";

// import Data from "../../../../Data/MasterData/AssetType.json";

// import AssetTypes from "../../../../Pages/MasterData/AssetTypes/AssetTypes";
// import {
//   TableSearch,
//   validateAllowedCharacters,
//   validateLength,
// } from "../../../../utils/utils";

// test.beforeEach(async ({ page }, { project }) => {
//   const Home = await new Login().login(page, "test1@face.com", "123456789");

//   const MasterData = await Home.GoToMasterData({
//     page,
//     expect,
//     ProjectName: project.name,
//   });
//   await MasterData.GoToAssetType(page, expect);
// });

// test("e2e", async ({ page }) => {
//   //go to create

//   const AssetType = new AssetTypes();
//   await AssetType.E2EAssetTypeWorkflow({ page, expect, initialData: Data.AllFields, editedData: Data.Edit.After });
//   //create
// });