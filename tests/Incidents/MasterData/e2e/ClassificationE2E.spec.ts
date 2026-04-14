import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/Classification.json";

import Classification from "../../../../Pages/MasterData/Classification/Classification";
import { TableSearch } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "test1@face.com", "123456789");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToClassifications(page, expect);
});

test("e2e primary", async ({ page }) => {
  const classification = new Classification();
  await classification.E2EClassificationWorkflow({ page, expect, initialData: Data.Create.Primary.AllFields, editedData: Data.Edit.Primary.After, isSecondary: false });
});

test("e2e secondary", async ({ page }) => {
  const classification = new Classification();
  await classification.E2EClassificationWorkflow({ page, expect, initialData: Data.Create.Secondary.AllFields, editedData: Data.Edit.Secondary.After, isSecondary: true });
});