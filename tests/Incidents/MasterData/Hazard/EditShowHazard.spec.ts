import { expect, test } from "@playwright/test";
//Page
import login from "../../../../Pages/Login/Login";
import Hazards from "../../../../Pages/MasterData/Hazards/Hazards";
//Data
import Data from "../../../../Data/MasterData/Hazard.json";

test.beforeEach(async ({ page }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterDataPage = await Home.GoToMasterData(page, expect);
  await MasterDataPage.GoToHazards(page, expect);
});

test("Show & Edit Hazard", async ({ page }) => {
  const hazard = new Hazards();
  await hazard.GoToShowHazard(
    page,
    expect,
    Data.ShowInTable,
    Data.Right.allFields
  );
  await hazard.ShowHazard(page, expect, Data.Right.required);
  await hazard.GoToEditHazardFormShow(page, expect);
  await hazard.EditHazard(page, expect, Data.Right.allFields, Data.Wrong.wrong);
});

test("Edit From Table", async ({ page }) => {
  const hazard = new Hazards();

  await hazard.GoToEditHazardFormTable(
    page,
    expect,
    Data.ShowInTable,
    Data.Right.allFields,
    Data.Right.required
  );
  await hazard.EditHazard(page, expect, Data.Right.allFields, Data.Wrong.wrong);
});
