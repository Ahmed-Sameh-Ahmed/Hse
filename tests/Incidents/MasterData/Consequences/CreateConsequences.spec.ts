import { expect, test } from "@playwright/test";
//Page
import login from "../../../../Pages/Login/Login";
import Consequences from "../../../../Pages/MasterData/Consequences/Consequences";
//Data
import Data from "../../../../Data/MasterData/Consequences.json";
import { TableSearch } from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToConsequence(page, expect);
});

test("Empty Fields", async ({ page }) => {
  const Empty = true;
  const Consequence = new Consequences();
  await Consequence.GoToCreateConsequences({ page, expect });
  await Consequence.CreateConsequences({
    page: page,
    Empty: Empty,
    expect: expect,
  });
});

test("Create Consequence With Right Data ( Required Fields )", async ({
  page,
}) => {
  const Consequence = new Consequences();
  await Consequence.GoToCreateConsequences({ page, expect });
  await Consequence.CreateConsequences({
    page: page,
    Data: Data.Right.Required,
    expect: expect,
  });
});

test("Create Consequence With Right Data ( All Fields )", async ({ page }) => {
  const Consequence = new Consequences();
  await Consequence.GoToCreateConsequences({ page, expect });
  await Consequence.CreateConsequences({
    page: page,
    Data: Data.Right.AllFields,
    expect: expect,
  });
});

test("Create Consequence With Wrong Data ( Consequences Name Exists )", async ({
  page,
}) => {
  const Consequence = new Consequences();

  const Found = await TableSearch({
    page,
    Name: Data.Wrong.ConsequencesNameExists.ConsequencesName,
  });

  if (!Found) {
    await Consequence.GoToCreateConsequences({ page, expect });
    await Consequence.CreateConsequences({
      page: page,
      Data: Data.Wrong.ConsequencesNameExists,
      expect: expect,
      Edit: true,
    });
    await Consequence.GoToCreateConsequences({ page, expect });
    await Consequence.CreateConsequences({
      page: page,
      Data: Data.Wrong.ConsequencesNameExists,
      expect: expect,
      Edit: true,
      Duplicate: true,
    });
  } else {
    await Consequence.GoToCreateConsequences({ page, expect });
    await Consequence.CreateConsequences({
      page: page,
      Data: Data.Wrong.ConsequencesNameExists,
      expect: expect,
      Edit: true,
      Duplicate: true,
    });
  }
});
