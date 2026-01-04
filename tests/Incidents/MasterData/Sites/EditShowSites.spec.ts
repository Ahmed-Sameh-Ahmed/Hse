import { expect, test } from "@playwright/test";
//Page
import login from "../../../../Pages/Login/Login";
import Sites from "../../../../Pages/MasterData/Sites/Sites";
//Data
import Data from "../../../../Data/MasterData/Sites.json";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToSites(page, expect);
});

test("Edit Site", async ({ page }) => {
  const sites = new Sites();
  // Go To Edit Site

  await sites.GoToEditSite({ page, expect, Data: Data.Edit.Before });
  // Edit
  await sites.EditSite({ page, expect, Data: Data.Edit.Before });
});

test("Show Site", async ({ page }) => {
  const sites = new Sites();

  // Go To Show Site
  await sites.GoToShowSite({ page, expect, Data: Data.Edit.Before });

  // Show Site
  await sites.ShowSite({ page, expect, Data: Data.Edit.Before });
});
