import OrganizationHierarchy from "./OrganizationHierarchy/OrganizationHierarchy";
import Hazards from "./Hazards/Hazards";
import Consequences from "./Consequences/Consequences";
import Causes from "./Causes/Causes";
import AssetTypes from "./AssetTypes/AssetTypes";
import TaskAnalysis from "./TaskAnalysis/TaskAnalysis";
import Sites from "./Sites/Sites";
import Classification from "./Classification/Classification";
import Assets from "./Assets/Assets";
import RootCauseAnalysis from "./RootCauseAnalysis/RootCauseAnalysis";
import { ROUTES } from "./routes";

class MasterData {
  async GoToOrganizationHierarchy(page: any, expect: any) {
    await page.getByRole("link", { name: "Organization Hierarchy" }).click();
    await expect(page).toHaveURL(ROUTES.ORGANIZATION_HIERARCHY);
    return new OrganizationHierarchy();
  }
  async GoToHazards(page: any, expect: any) {
    await page.getByRole("link", { name: "Hazards" }).click();
    await expect(page).toHaveURL(ROUTES.HAZARDS);
    return new Hazards();
  }
  async GoToConsequence(page: any, expect: any) {
    await page.getByRole("link", { name: "Consequences" }).click();
    await expect(page).toHaveURL(ROUTES.CONSEQUENCES);
    return new Consequences();
  }

  async GoToCauses(page: any, expect: any) {
    await page.getByRole("link", { name: "Causes" }).click();
    await expect(page).toHaveURL(ROUTES.CAUSES);
    return new Causes();
  }

  async GoToAssetType(page: any, expect: any) {
    await page.getByRole("link", { name: "Asset Types" }).click();
    await expect(page).toHaveURL(ROUTES.ASSET_TYPES);
    return new AssetTypes();
  }
  async GoToTaskAnalysis(page: any, expect: any) {
    await page.getByRole("link", { name: "Task Analysis" }).click();
    await expect(page).toHaveURL(ROUTES.TASK_ANALYSIS);
    return new TaskAnalysis();
  }
  async GoToSites(page: any, expect: any) {
    await page.getByRole("link", { name: "Sites" }).click();
    await expect(page).toHaveURL(ROUTES.SITES);
    return new Sites();
  }
  async GoToClassifications(page: any, expect: any) {
    await page.getByRole("link", { name: "Classifications" }).click();
    await expect(page).toHaveURL(ROUTES.CLASSIFICATIONS);
    return new Classification();
  }
  async GoToAssets(page: any, expect: any) {
    await page.getByRole("link", { name: "Assets" }).click();
    await expect(page).toHaveURL(ROUTES.ASSETS);
    return new Assets();
  }
  async GoToRootCauseAnalysis(page: any, expect: any) {
    await page.getByRole("link", { name: "Root Cause Analysis" }).click();
    await expect(page).toHaveURL(ROUTES.ROOT_CAUSE_ANALYSIS);
    return new RootCauseAnalysis();
  }
}

export default MasterData;
