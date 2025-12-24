import { test, expect } from "@playwright/test";
//Pages
import Login from "../../../../Pages/Login/Login";
import TaskAnalysis from "../../../../Pages/MasterData/TaskAnalysis/TaskAnalysis";
//Data
import Data from "../../../../Data/MasterData/TaskAnalysis.json";

test.beforeEach(async ({ page }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterDataPage = await Home.GoToMasterData(page, expect);
  await MasterDataPage.GoToTaskAnalysis(page, expect);
});

test("Create (Questions) Empty Fields", async ({ page }) => {
  const taskAnalysis = new TaskAnalysis();
  await taskAnalysis.GoToCreateTaskAnalysisQuestions({ page, expect });
  await taskAnalysis.CreateTaskAnalysisQuestions({
    page,
    expect,
    Data: Data.TaskAnalysisQuestion.Create,
    Empty: true,
  });
});
test("Create (Questions) (1 Field)", async ({ page }) => {
  const taskAnalysis = new TaskAnalysis();
  await taskAnalysis.GoToCreateTaskAnalysisQuestions({ page, expect });
  await taskAnalysis.CreateTaskAnalysisQuestions({
    page,
    expect,
    Data: Data.TaskAnalysisQuestion.Create,
  });
});
test("Create (Questions) Duplicate (Label)", async ({ page }) => {
  const taskAnalysis = new TaskAnalysis();
  try {
    await taskAnalysis.GoToCreateTaskAnalysisQuestions({ page, expect });
    await taskAnalysis.CreateTaskAnalysisQuestions({
      page,
      expect,
      Data: Data.TaskAnalysisQuestion.Create,
      NotRandomNumber: true,
    });

    await taskAnalysis.GoToCreateTaskAnalysisQuestions({
      page,
      expect,
      Duplicate: true,
    });
    await taskAnalysis.CreateTaskAnalysisQuestions({
      page,
      expect,
      Data: Data.TaskAnalysisQuestion.Create,
      NotRandomNumber: true,
      Duplicate: true,
    });
  } catch (error) {
    console.log("Name exist from first Create");
  }
});

//-------------------------------------------------------------------------------------

test("Create (Classification) (Empty)", async ({ page }) => {
  const taskAnalysis = new TaskAnalysis();
  await taskAnalysis.GoToCreateTaskAnalysisClassification({ page, expect });
  await taskAnalysis.CreateTaskAnalysisClassification({
    page,
    expect,
    Data: Data.TaskClassification.Create,
    Empty: true,
  });
});
test("Create (Classification) (Required) ", async ({ page }) => {
  const taskAnalysis = new TaskAnalysis();
  await taskAnalysis.GoToCreateTaskAnalysisClassification({ page, expect });
  await taskAnalysis.CreateTaskAnalysisClassification({
    page,
    expect,
    Data: Data.TaskClassification.Create,
    Required: true,
  });
});
test("Create (Classification (AllFields) )", async ({ page }) => {
  const taskAnalysis = new TaskAnalysis();
  await taskAnalysis.GoToCreateTaskAnalysisClassification({ page, expect });
  await taskAnalysis.CreateTaskAnalysisClassification({
    page,
    expect,
    Data: Data.TaskClassification.Create,
  });
});
test("Create (Classification Duplicate(ID || Name)  )", async ({ page }) => {
  const taskAnalysis = new TaskAnalysis();

  try {
    await taskAnalysis.GoToCreateTaskAnalysisClassification({ page, expect });
    await taskAnalysis.CreateTaskAnalysisClassification({
      page,
      expect,
      Data: Data.TaskClassification.Create,
      NotRandomNumber: true,
      Required: true,
    });
    await taskAnalysis.GoToCreateTaskAnalysisClassification({
      page,
      expect,
      Duplicate: true,
    });
    await taskAnalysis.CreateTaskAnalysisClassification({
      page,
      expect,
      Data: Data.TaskClassification.Create,
      NotRandomNumber: true,
      Required: true,
      Duplicate: true,
    });
  } catch (error) {
    console.log("name or id exist from first Create");
  }
});
