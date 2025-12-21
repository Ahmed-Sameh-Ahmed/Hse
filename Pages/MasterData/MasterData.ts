import OrganizationHierarchy from "./OrganizationHierarchy/OrganizationHierarchy";
import Hazards from "./Hazards/Hazards";
import Consequences from "./Consequences/Consequences";
import Causes from "./Causes/Causes";
import AssetTypes from "./AssetTypes/AssetTypes";

class MasterData {
  async GoToOrganizationHierarchy(page: any, expect: any) {
    await page.getByRole("link", { name: "Organization Hierarchy" }).click();
    await expect(page).toHaveURL("/master-data/organization-hierarchy");
    return new OrganizationHierarchy();
  }
  async GoToHazards(page: any, expect: any) {
    await page.getByRole("link", { name: "Hazards" }).click();
    await expect(page).toHaveURL("/master-data/hazards");
    return new Hazards();
  }
  async GoToConsequence(page: any, expect: any) {
    await page.getByRole("link", { name: "Consequences" }).click();
    await expect(page).toHaveURL("/master-data/consequences");
    return new Consequences();
  }

  async GoToCauses(page: any, expect: any) {
    await page.getByRole("link", { name: "Causes" }).click();
    await expect(page).toHaveURL("/master-data/causes");
    return new Causes();
  }

  async GoToAssetType(page: any, expect: any) {
    await page.getByRole("link", { name: "Asset Types" }).click();
    await expect(page).toHaveURL("/master-data/asset-types");
    return new AssetTypes();
  }
}

export default MasterData;
