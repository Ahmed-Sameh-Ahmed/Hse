import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/Cause.json";

import Causes from "../../../../Pages/MasterData/Causes/Causes";
import { TableSearch } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "test1@face.com", "123456789");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToCauses(page, expect);
});

test("e2e primary", async ({ page }) => {
  const causes = new Causes();
  await causes.E2ECauseWorkflow({ page, expect, initialData: Data.Right.Cause.AllFields, editedData: Data.Edit.Cause.After, isSubCause: false });
});

test("e2e secondary", async ({ page }) => {
  const causes = new Causes();
  await causes.E2ECauseWorkflow({ page, expect, initialData: Data.Right.SubCause.AllFields, editedData: Data.Edit.SubCause.After, isSubCause: true });
});