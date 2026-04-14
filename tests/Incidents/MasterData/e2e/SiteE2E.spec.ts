import { expect, test } from "@playwright/test";
//Page
import Login from "../../../../Pages/Login/Login";
import Sites from "../../../../Pages/MasterData/Sites/Sites";
//Data
import Data from "../../../../Data/MasterData/Sites.json";
import { TableSearch } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "test1@face.com", "123456789");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToSites(page, expect);
});


test("e2e", async ({ page }) => {
  const sites = new Sites();
  sites.E2ESiteWorkflow({ page, expect, initialData: Data.Create.Right, editedData: Data.Edit.After })


})