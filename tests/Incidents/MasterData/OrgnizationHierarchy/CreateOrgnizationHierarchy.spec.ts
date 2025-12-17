import { test, expect } from "@playwright/test";
//Pages
import Login from "../../../../Pages/Login/Login";
import OrganizationHierarchy from "../../../../Pages/MasterData/OrganizationHierarchy/OrganizationHierarchy";
//Data
import Data from "../../../../Data/MasterData/OrganizationHierarchy.json";

test.beforeEach(async ({ page }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterDataPage = await Home.GoToMasterData(page, expect);
  await MasterDataPage.GoToOrganizationHierarchy(page, expect);
});
try {
  test("Create Group With Empty Data", async ({ page }) => {
    const empty = true;

    const Organization_Hierarchy = new OrganizationHierarchy();
    await Organization_Hierarchy.GoToCreateOrganizationHierarchy(page, expect);
    await Organization_Hierarchy.CreateOrganizationHierarchy(
      page,
      expect,
      Data.Empty,
      empty
    );
    await expect(page.getByText("Level ID is required")).toBeVisible();
    await expect(page.getByText("Level name is required")).toBeVisible();
    await expect(page.getByText("Position is required")).toBeVisible();
    await expect(page.getByText("Reports To is required")).toBeVisible();
  });
  // test("Create Organization Hierarchy With Right Data (required)", async ({
  //   page,
  // }) => {
  //   const Organization_Hierarchy = new OrganizationHierarchy();
  //   await Organization_Hierarchy.GoToCreateOrganizationHierarchy(page, expect);
  //   await Organization_Hierarchy.CreateOrganizationHierarchy(
  //     page,
  //     expect,
  //     Data.Right.Required
  //   );
  // });
  test("Create Organization Hierarchy With Right Data (all fields)", async ({
    page,
  }) => {
    const Organization_Hierarchy = new OrganizationHierarchy();
    await Organization_Hierarchy.GoToCreateOrganizationHierarchy(page, expect);
    await Organization_Hierarchy.CreateOrganizationHierarchy(
      page,
      expect,
      Data.Right.AllFields
    );
  });
  test("Create Organization Hierarchy With Right Data (Level1 didn't have Report to) ", async ({
    page,
  }) => {
    const Organization_Hierarchy = new OrganizationHierarchy();
    await Organization_Hierarchy.GoToCreateOrganizationHierarchy(page, expect);
    await Organization_Hierarchy.CreateOrganizationHierarchy(
      page,
      expect,
      Data.Right.Level1
    );
  });
  test("Create Group With Wrong Data (position is the same as report to)", async ({
    page,
  }) => {
    const Organization_Hierarchy = new OrganizationHierarchy();
    await Organization_Hierarchy.GoToCreateOrganizationHierarchy(page, expect);
    await Organization_Hierarchy.CreateOrganizationHierarchy(
      page,
      expect,
      Data.Wrong.Position_Is_The_Same_as_ReportsTo
    );
  });
  test("Create Group With Wrong Data (duplicate level)", async ({ page }) => {
    const Organization_Hierarchy = new OrganizationHierarchy();
    await Organization_Hierarchy.GoToCreateOrganizationHierarchy(page, expect);
    await Organization_Hierarchy.CreateOrganizationHierarchy(
      page,
      expect,
      Data.Wrong.Duplicate
    );
  });
  test("Create Group With Wrong Data (circular hierarchies)", async ({
    page,
  }) => {
    const Organization_Hierarchy = new OrganizationHierarchy();
    await Organization_Hierarchy.GoToCreateOrganizationHierarchy(page, expect);
    await Organization_Hierarchy.CreateOrganizationHierarchy(
      page,
      expect,
      Data.Wrong.Circular_Hierarchy
    );
  });
} catch (err) {
  console.log(err);
}
