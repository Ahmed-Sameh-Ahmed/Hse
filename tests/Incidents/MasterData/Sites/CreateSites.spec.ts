import { expect, test } from "@playwright/test";
//Page
import login from "../../../../Pages/Login/Login";
import Sites from "../../../../Pages/MasterData/Sites/Sites";
//Data
import Data from "../../../../Data/MasterData/Sites.json";
import { TableSearch } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToSites(page, expect);
});

test("Create Empty Fields", async ({ page }) => {
  const Site = new Sites();
  //Go To Create
  await Site.GoToCreateSite({ page, expect });
  // Create
  await Site.CreateSite({ page, expect, Empty: true });
});
test("Create Sites (Required)", async ({ page }) => {
  const Site = new Sites();
  //Go To Create
  await Site.GoToCreateSite({ page, expect });
  // Create
  await Site.CreateSite({
    page,
    expect,
    Data: Data.Create.Right,
    Required: true,
  });
});
test("Create Sites (all Fields)", async ({ page }) => {
  const Site = new Sites();
  //Go To Create
  await Site.GoToCreateSite({ page, expect });
  // Create
  await Site.CreateSite({ page, expect, Data: Data.Create.Right });
});
test("Create Sites (all Fields) (Wrong)", async ({ page }) => {
  const Site = new Sites();
  //Go To Create
  await Site.GoToCreateSite({ page, expect });
  // Create
  await Site.CreateSite({ page, expect, Data: Data.Create.Wrong, Wrong: true });
});
test("Create Sites (all Fields) (Duplicate)", async ({ page }) => {
  const Site = new Sites();

  const Found = await TableSearch({ page, Name: Data.Create.Right.name });

  if (!Found) {
    //Go To Create
    await Site.GoToCreateSite({ page, expect });
    // Create
    await Site.CreateSite({
      page,
      expect,
      Data: Data.Create.Right,
      NotRandomNumber: true,
    });
    //Go To Create X2
    await Site.GoToCreateSite({ page, expect });
    // Create X2
    await Site.CreateSite({
      page,
      expect,
      Data: Data.Create.Right,
      NotRandomNumber: true,
      Duplicate: true,
    });
  } else {
    //Go To Create X2
    await Site.GoToCreateSite({ page, expect });
    // Create X2
    await Site.CreateSite({
      page,
      expect,
      Data: Data.Create.Right,
      NotRandomNumber: true,
      Duplicate: true,
    });
  }
});
