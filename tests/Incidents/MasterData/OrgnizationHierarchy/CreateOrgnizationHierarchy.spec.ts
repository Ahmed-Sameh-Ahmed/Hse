import { test, expect } from "@playwright/test";
//Pages
import Login from "../../../../Pages/Login/Login";
import OrganizationHierarchy from "../../../../Pages/MasterData/OrganizationHierarchy/OrganizationHierarchy";
//Data
import Data from "../../../../Data/MasterData/OrganizationHierarchy.json";
import { TableSearch } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterDataPage = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterDataPage.GoToOrganizationHierarchy(page, expect);
});

test("Create Organization Hierarchy With Empty Data", async ({ page }) => {
  const empty = true;

  const Organization_Hierarchy = new OrganizationHierarchy();
  await Organization_Hierarchy.GoToCreateOrganizationHierarchy({
    page,
    expect,
  });
  await Organization_Hierarchy.CreateOrganizationHierarchy({
    page,
    expect,
    data: Data.Empty,
    empty,
  });
});

test("Create Organization Hierarchy With Right Data (required)", async ({
  page,
}) => {
  const Organization_Hierarchy = new OrganizationHierarchy();
  await Organization_Hierarchy.GoToCreateOrganizationHierarchy({
    page,
    expect,
  });
  await Organization_Hierarchy.CreateOrganizationHierarchy({
    page,
    expect,
    data: Data.Right.Required,
  });
});

test("Create Organization Hierarchy With Right Data (all fields)", async ({
  page,
}) => {
  const Organization_Hierarchy = new OrganizationHierarchy();
  await Organization_Hierarchy.GoToCreateOrganizationHierarchy({
    page,
    expect,
  });
  await Organization_Hierarchy.CreateOrganizationHierarchy({
    page,
    expect,
    data: Data.Right.AllFields,
  });
});

test("Create Organization Hierarchy With Right Data (Level1 didn't have Report to) ", async ({
  page,
}) => {
  const Organization_Hierarchy = new OrganizationHierarchy();
  await Organization_Hierarchy.GoToCreateOrganizationHierarchy({
    page,
    expect,
  });
  await Organization_Hierarchy.CreateOrganizationHierarchy({
    page,
    expect,
    data: Data.Right.Level1,
  });
});

test("Create Organization Hierarchy With Wrong Data (position is the same as report to)", async ({
  page,
}) => {
  const Organization_Hierarchy = new OrganizationHierarchy();
  await Organization_Hierarchy.GoToCreateOrganizationHierarchy({
    page,
    expect,
  });
  await Organization_Hierarchy.CreateOrganizationHierarchy({
    page,
    expect,
    data: Data.Wrong.Position_Is_The_Same_as_ReportsTo,
    SamePosition: true,
  });
});

test("Create Organization Hierarchy With Wrong Data (duplicate level)", async ({
  page,
}) => {
  const Organization_Hierarchy = new OrganizationHierarchy();
  //first
  // const Found = await TableSearch({
  //   page,
  //   Name: Data.Right.Required.LevelName,
  // });

  // if (!Found) {
  //   await Organization_Hierarchy.GoToCreateOrganizationHierarchy({
  //     page,
  //     expect,
  //   });
  //   await Organization_Hierarchy.CreateOrganizationHierarchy({
  //     page,
  //     expect,
  //     data: Data.Right.Required,
  //     NotRandomNumber: true,
  //   });

  //   // second
  //   await Organization_Hierarchy.GoToCreateOrganizationHierarchy({
  //     page,
  //     expect,
  //   });
  //   await Organization_Hierarchy.CreateOrganizationHierarchy({
  //     page,
  //     expect,
  //     data: Data.Right.Required,
  //     NotRandomNumber: true,
  //     Duplicate: true,
  //   });
  // } else {
  // second
  await Organization_Hierarchy.GoToCreateOrganizationHierarchy({
    page,
    expect,
  });
  await Organization_Hierarchy.CreateOrganizationHierarchy({
    page,
    expect,
    data: Data.Right.Required,
    NotRandomNumber: true,
    Duplicate: true,
  });
});

test("Create Organization Hierarchy With Wrong Data (circular hierarchies)", async ({
  page,
}) => {
  const Organization_Hierarchy = new OrganizationHierarchy();
  await Organization_Hierarchy.GoToCreateOrganizationHierarchy({
    page,
    expect,
  });
  await Organization_Hierarchy.CreateOrganizationHierarchy({
    page,
    expect,
    data: Data.Wrong.Circular_Hierarchy,
    circular: true,
  });
});
