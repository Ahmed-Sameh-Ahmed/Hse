import { test, expect } from "@playwright/test";
//Pages
import Login from "../../../../Pages/Login/Login";
import RootCauseAnalysis from "../../../../Pages/MasterData/RootCauseAnalysis/RootCauseAnalysis";
//Data
import Data from "../../../../Data/MasterData/RootCauseAnalysis.json";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToRootCauseAnalysis(page, expect);
});

test("Create Root Cause Analysis", async ({ page }) => {
  const rootCauseAnalysis = new RootCauseAnalysis();
  await rootCauseAnalysis.CreateRootCauseAnalysis({
    page,
    expect,
    Data: Data.Create,
  });
});
