import { expect, test } from "@playwright/test";
//Page
import Login from "../../../../Pages/Login/Login";
import Consequences from "../../../../Pages/MasterData/Consequences/Consequences";
//Data
import Data from "../../../../Data/MasterData/Consequences.json";
import { TableSearch } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "test1@face.com", "123456789");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToConsequence(page, expect);
});

test("e2e", async ({ page }) => {
  const Consequence = new Consequences();
  await Consequence.E2EConsequencesWorkflow({ page, expect, initialData: Data.Right.AllFields, editedData: Data.Edit.After });

});