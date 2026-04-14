import { expect, test } from "@playwright/test";
//Page
import Login from "../../../../Pages/Login/Login";
import Hazards from "../../../../Pages/MasterData/Hazards/Hazards";
//Data
import Data from "../../../../Data/MasterData/Hazard.json";
import { TableSearch } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "test1@face.com", "123456789");

  const MasterDataPage = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterDataPage.GoToHazards(page, expect);
});

test("e2e", async ({ page }) => {
  const hazards = new Hazards();
  await hazards.E2EHazardWorkflow({ page, expect, initialData: Data.Right.allFields, editedData: Data.Edit.After });
});