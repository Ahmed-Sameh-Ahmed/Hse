import { expect, test } from "@playwright/test";
//Page
import login from "../../../../Pages/Login/Login";
import Hazards from "../../../../Pages/MasterData/Hazards/Hazards";
//Data
import Data from "../../../../Data/MasterData/Hazard.json";
import { TableSearch } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterDataPage = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterDataPage.GoToHazards(page, expect);
});

test("Empty Fields", async ({ page }) => {
  const Empty = true;
  const hazards = new Hazards();
  await hazards.GoToCrateHazard({ page, expect });
  await hazards.CreateHazard({
    page,
    expect,
    Data: Data.Right.allFields,
    Empty,
  });
});

test("Crate Hazard With Right Data(Required)", async ({ page }) => {
  const hazards = new Hazards();
  await hazards.GoToCrateHazard({ page, expect });
  await hazards.CreateHazard({ page, expect, Data: Data.Right.required });
});

test("Crate Hazard With Right Data (all Fields)", async ({ page }) => {
  const hazards = new Hazards();
  await hazards.GoToCrateHazard({ page, expect });
  await hazards.CreateHazard({ page, expect, Data: Data.Right.allFields });
});

test("Crate Hazard With Wrong Data (Duplicate Data)", async ({ page }) => {
  const hazards = new Hazards();

  const Found = await TableSearch({ page, Name: Data.Right.allFields.Name });

  if (!Found) {
    await hazards.GoToCrateHazard({ page, expect });
    await hazards.CreateHazard({
      page,
      expect,
      Data: Data.Right.allFields,
      NotFillRandomNumber: true,
    });
    await hazards.GoToCrateHazard({ page, expect });
    await hazards.CreateHazard({
      page,
      expect,
      Data: Data.Right.allFields,
      NotFillRandomNumber: true,
      Duplicate: true,
    });
  } else {
    await hazards.GoToCrateHazard({ page, expect });
    await hazards.CreateHazard({
      page,
      expect,
      Data: Data.Right.allFields,
      NotFillRandomNumber: true,
      Duplicate: true,
    });
  }
});
