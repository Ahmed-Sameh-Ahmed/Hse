import { test, expect } from "@playwright/test";
//Pages
import Login from "../../../../Pages/Login/Login";
import TaskAnalysis from "../../../../Pages/MasterData/TaskAnalysis/TaskAnalysis";
//Data
import Data from "../../../../Data/MasterData/TaskAnalysis.json";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToTaskAnalysis(page, expect);
});

test("Edit (Questions)", async ({ page }) => {
  const taskAnalysis = new TaskAnalysis();

  await taskAnalysis.GoToEditTaskAnalysisQuestions({
    page,
    expect,
    Data: Data.TaskAnalysisQuestion.Edit.Before,
  });
  await taskAnalysis.EditTaskAnalysisQuestions({
    page,
    expect,
    Data: Data.TaskAnalysisQuestion.Edit.Before,
  });
});
test("Delete (Questions)", async ({ page }) => {
  const taskAnalysis = new TaskAnalysis();

  await taskAnalysis.DeleteTaskAnalysisQuestions({
    page,
    Data: Data.TaskAnalysisQuestion.Edit.Before,
  });
});

// -----------------------------------------------------

test("Edit (Classification)", async ({ page }) => {
  const taskAnalysis = new TaskAnalysis();
  await taskAnalysis.GoToEditTaskAnalysisClassification({
    page,
    expect,
    Data: Data.TaskClassification.Edit.Before,
  });
  await taskAnalysis.EditTaskAnalysisClassification({
    page,
    expect,
    DataBefore: Data.TaskClassification.Edit.Before,
    DataAfter: Data.TaskClassification.Edit.After,
  });
});
test("Delete (Classification)", async ({ page }) => {
  const taskAnalysis = new TaskAnalysis();

  await taskAnalysis.DeleteTaskAnalysisClassification({
    page,
    Data: Data.TaskClassification.Edit.Before,
  });
});
