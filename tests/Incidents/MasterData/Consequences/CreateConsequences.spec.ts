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

test("Create Consequence With Right Data", async ({ page }) => {
  const Consequence = new Consequences();
  await Consequence.GoToCreateConsequences(page, expect);
  await Consequence.CreateConsequences({
    page: page,
    Data: Data.Right,
    expect: expect,
  });
});
test("Empty Fields", async ({ page }) => {
  const Empty = true;
  const Consequence = new Consequences();
  await Consequence.GoToCreateConsequences(page, expect);
  await Consequence.CreateConsequences({
    page: page,
    Empty: Empty,
    expect: expect,
  });
});
