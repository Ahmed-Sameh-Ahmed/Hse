import { expect, test } from "@playwright/test";
//Page
import login from "../../../../Pages/Login/Login";
import Consequences from "../../../../Pages/MasterData/Consequences/Consequences";
//Data
import Data from "../../../../Data/MasterData/Consequences.json";

type props = {
  page: any;
  Data?: TData;
  expect: any;
  Empty?: Boolean;
  CreateData?: TData;
};

type TData = {
  ConsequencesName: string;
  Description: string;
};

test.beforeEach(async ({ page }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterDataPage = await Home.GoToMasterData(page, expect);
  await MasterDataPage.GoToConsequence(page, expect);
});

test("Show & Edit Consequence", async ({ page }) => {
  const consequence = new Consequences();
  await consequence.GoToShowConsequences({
    page: page,
    expect: expect,
    showInTable: Data.ShowInTable,
    Data: Data.Right.AllFields,
  });
  await consequence.ShowConsequences({
    page: page,
    Data: Data.Show,
    expect: expect,
  });
  await consequence.GoToEditConsequencesFormShowPage({
    page: page,
    expect: expect,
  });
  await consequence.EditConsequences({
    page: page,
    Data: Data.Edit,
    expect: expect,
  });
  await expect(page).toHaveURL("/master-data/consequences");
  await page.getByRole("button", { name: "OK" }).click();
});
