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

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToConsequence(page, expect);
});

test(" Edit Consequence", async ({ page }) => {
  const consequence = new Consequences();

  await consequence.GoToEditConsequencesFormTable({
    Data: Data.Edit.Before,
    page,
    expect,
  });
  await consequence.EditConsequences({ page, Data: Data.Edit.After, expect });
});

test(" Show Consequence", async ({ page }) => {
  const consequence = new Consequences();
  await consequence.GoToShowConsequences({
    page,
    Data: Data.Edit.Before,
    expect,
  });
  await consequence.ShowConsequences({ page, Data: Data.Edit.Before, expect });
});
