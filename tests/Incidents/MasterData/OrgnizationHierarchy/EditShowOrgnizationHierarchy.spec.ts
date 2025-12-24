import { expect, test } from "@playwright/test";
//Page
import login from "../../../../Pages/Login/Login";
import OrganizationHierarchy from "../../../../Pages/MasterData/OrganizationHierarchy/OrganizationHierarchy";
//Data
import Data from "../../../../Data/MasterData/OrganizationHierarchy.json";

test.beforeEach(async ({ page }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterDataPage = await Home.GoToMasterData(page, expect);
  await MasterDataPage.GoToOrganizationHierarchy(page, expect);
});

test("Show  Orgnization Hierarchy", async ({ page }) => {
  const Organization_Hierarchy = new OrganizationHierarchy();
  await Organization_Hierarchy.GoToShowOrganizationHierarchy({
    page,
    expect,
    DataBefore: Data.Edit.Before,
  });
  await Organization_Hierarchy.ShowOrganizationHierarchy({
    page,
    expect,
    data: Data.Edit.Before,
  });
});

test("Edit Orgnization Hierarchy", async ({ page }) => {
  const Organization_Hierarchy = new OrganizationHierarchy();
  await Organization_Hierarchy.GoToEditOrganizationHierarchy({
    page,
    expect,
    data: Data.Edit.Before,
  });
  await Organization_Hierarchy.EditOrganizationHierarchy({
    page,
    expect,
    data: Data.Edit.After,
  });
});
