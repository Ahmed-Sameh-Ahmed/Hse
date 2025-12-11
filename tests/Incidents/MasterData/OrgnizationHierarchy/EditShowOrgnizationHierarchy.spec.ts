import { expect, test } from "@playwright/test";
//Page
import login from "../../../Pages/Login/Login";
import OrganizationHierarchy from "../../../Pages/MasterData/OrganizationHierarchy/OrganizationHierarchy";
//Data
import Data from "../../../Data/MasterData/OrganizationHierarchy.json";

test.beforeEach(async ({ page }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterDataPage = await Home.GoToMasterData(page, expect);
  await MasterDataPage.GoToOrganizationHierarchy(page, expect);
});

test("Show & Edit Orgnization Hierarchy", async ({ page }) => {
  const Organization_Hierarchy = new OrganizationHierarchy();
  await Organization_Hierarchy.GoToShowOrganizationHierarchy(
    page,
    expect,
    Data.Show,
    Data.Right
  );
  await Organization_Hierarchy.ShowOrganizationHierarchy(
    page,
    expect,
    Data.Show
  );
  await Organization_Hierarchy.GoToEditOrganizationHierarchyFormShow(
    page,
    expect
  );
  await Organization_Hierarchy.EditOrganizationHierarchy(
    page,
    expect,
    Data.Right
  );
});

test("Edit Orgnization Hierarchy Form Table", async ({ page }) => {
  const Organization_Hierarchy = new OrganizationHierarchy();

  await Organization_Hierarchy.GoToEditOrganizationHierarchyFromTable(
    page,
    expect,
    Data.Show
  );

  await Organization_Hierarchy.EditOrganizationHierarchy(
    page,
    expect,
    Data.Right
  );
});
