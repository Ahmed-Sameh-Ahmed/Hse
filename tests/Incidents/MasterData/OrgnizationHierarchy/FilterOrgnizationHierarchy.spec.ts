import { expect, test } from "@playwright/test";
// Pages
import Login from "../../../../Pages/Login/Login";
import OrganizationHierarchy from "../../../../Pages/MasterData/OrganizationHierarchy/OrganizationHierarchy";

// Data
import Data from "../../../../Data/MasterData/OrganizationHierarchy.json";

test.beforeEach(async ({ page }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  Home.GoToMasterData(page, expect);
  // await MasterDataPage.GoToOrganizationHierarchy(page, expect);
});

test("Filter Orgnization Hierarchy", async ({ page }) => {
  const OrganizationHierarchyPage = new OrganizationHierarchy();

  await OrganizationHierarchyPage.FilterOrganizationHierarchy(
    page,
    expect,
    Data.Right,
    Data.Filter
  );
});
