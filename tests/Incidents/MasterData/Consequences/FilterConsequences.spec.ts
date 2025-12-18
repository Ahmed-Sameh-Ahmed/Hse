import { expect, test } from "@playwright/test";
//Page
import login from "../../../../Pages/Login/Login";
import Consequences from "../../../../Pages/MasterData/Consequences/Consequences";
//Data
import Data from "../../../../Data/MasterData/Consequences.json";

test.beforeEach(async ({ page }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterDataPage = await Home.GoToMasterData(page, expect);
  await MasterDataPage.GoToConsequence(page, expect);
});

test("Filter Consequence ", async ({ page }) => {
  const Consequence = new Consequences();
  await Consequence.FilterConsequences({ page, Data: Data.Edit.After, expect });
});
