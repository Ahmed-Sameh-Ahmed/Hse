import { test, expect } from "@playwright/test";
//Pages
import Login from "../../../Pages/Login/Login";
import OrganizationHierarchy from "../../../Pages/MasterData/OrganizationHierarchy/OrganizationHierarchy";
//Data
import Data from "../../../Data/MasterData/OrganizationHierarchy.json";

test.beforeEach(async ({ page }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterDataPage = await Home.GoToMasterData(page, expect);
  await MasterDataPage.GoToOrganizationHierarchy(page, expect);
});
test("Create Group With Right Data", async ({ page }) => {
  const Organization_Hierarchy = new OrganizationHierarchy();
  await Organization_Hierarchy.GoToCreateOrganizationHierarchy(page, expect);
  await Organization_Hierarchy.CreateOrganizationHierarchy(
    page,
    expect,
    Data.Right
  );
});
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
test("Create Group With Wrong Data", async ({ page }) => {
  const Organization_Hierarchy = new OrganizationHierarchy();
  await Organization_Hierarchy.GoToCreateOrganizationHierarchy(page, expect);
  await Organization_Hierarchy.CreateOrganizationHierarchy(
    page,
    expect,
    Data.Wrong
  );
});
