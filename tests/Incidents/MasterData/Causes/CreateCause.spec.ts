import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/Cause.json";

import Causes from "../../../../Pages/MasterData/Causes/Causes";
import { TableSearch } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToCauses(page, expect);
});

test("Create Cause (Parent Cause) With Empty Fields ", async ({ page }) => {
  const causes = new Causes();

  await causes.GoToCreateCause({ page, expect });
  await causes.CreateCause({ page, expect, Empty: true });
});

test("Create Cause (Parent Cause) (Required Fields) ", async ({ page }) => {
  const causes = new Causes();

  await causes.GoToCreateCause({ page, expect });
  await causes.CreateCause({
    page,
    expect,
    Data: Data.Right.Category.Required,
  });
});

test("Create Cause (Parent Cause) (All Fields) ", async ({ page }) => {
  const causes = new Causes();
  await causes.GoToCreateCause({ page, expect });
  await causes.CreateCause({
    page,
    expect,
    Data: Data.Right.Category.AllFields,
  });
});

// --------------------------------------------------------------------

test("Create Cause (Sub Cause) With Empty Fields ", async ({ page }) => {
  const causes = new Causes();
  await causes.GoToCreateCause({ page, expect });
  await causes.CreateCause({ page, expect, Empty: true, subCause: true });
});

test("Create Cause (Sub Cause) With (Required Fields) ", async ({ page }) => {
  const causes = new Causes();
  await causes.GoToCreateCause({ page, expect });
  await causes.CreateCause({
    page,
    expect,
    Data: Data.Right.SubCause.Required,
    subCause: true,
    CategoryData: Data.Right.Category.AllFields,
  });
});
test("Create Cause (Sub Cause) With (All Fields) ", async ({ page }) => {
  const causes = new Causes();
  await causes.GoToCreateCause({ page, expect });
  await causes.CreateCause({
    page,
    expect,
    Data: Data.Right.SubCause.AllFields,
    subCause: true,
    CategoryData: Data.Right.Category.AllFields,
  });
});

// --------------------------------------------------------------------

test("Create Cause (Parent Cause) (All Fields) (Duplicate Name) ", async ({
  page,
}) => {
  const causes = new Causes();

  const Found = await TableSearch({
    page,
    Name: Data.Right.Category.Required.Name,
  });

  if (!Found) {
    await causes.GoToCreateCause({ page, expect });
    await causes.CreateCause({
      page,
      expect,
      Data: Data.Right.Category.Required,
      NotRandomNumber: true,
    });

    await causes.GoToCreateCause({ page, expect });
    await causes.CreateCause({
      page,
      expect,
      Data: Data.Right.Category.Required,
      NotRandomNumber: true,
      Duplicate: true,
    });
  } else {
    await causes.GoToCreateCause({ page, expect });
    await causes.CreateCause({
      page,
      expect,
      Data: Data.Right.Category.Required,
      NotRandomNumber: true,
      Duplicate: true,
    });
  }
});

test("Create Cause (Sub Cause) (All Fields) (Duplicate Name) ", async ({
  page,
}) => {
  const causes = new Causes();

  const Found = await TableSearch({
    page,
    Name: Data.Right.SubCause.Required.Name,
  });

  if (!Found) {
    await causes.GoToCreateCause({ page, expect });
    await causes.CreateCause({
      page,
      expect,
      Data: Data.Right.SubCause.Required,
      CategoryData: Data.Right.Category.Required,
      NotRandomNumber: true,
      subCause: true,
    });
    await causes.GoToCreateCause({ page, expect });
    await causes.CreateCause({
      page,
      expect,
      Data: Data.Right.SubCause.Required,
      CategoryData: Data.Right.Category.Required,
      NotRandomNumber: true,
      subCause: true,
      Duplicate: true,
    });
  } else {
    await causes.GoToCreateCause({ page, expect });
    await causes.CreateCause({
      page,
      expect,
      Data: Data.Right.SubCause.AllFields,
      CategoryData: Data.Right.Category.AllFields,
      NotRandomNumber: true,
      subCause: true,
      Duplicate: true,
    });
  }
});
