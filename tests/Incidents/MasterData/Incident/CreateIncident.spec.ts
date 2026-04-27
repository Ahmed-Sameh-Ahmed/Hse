import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/Incident.json";
import user from "../../../../Data/User.json";

import Incident from "../../../../Pages/MasterData/Incident/Incident";
import {
  TableSearch,
  validateAllowedCharacters,
  validateLength,
} from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(
    page,
    user.test1.username,
    user.test1.password,
  );

  const MasterData = await Home.GoToMasterData({
    page,
    expect,
    ProjectName: project.name,
  });
  await MasterData.GoToIncident(page, expect);
});

test("Create Incident", async ({ page }) => {
  const incident = new Incident();
  await incident.createIncident({ page, expect, Data, NotRandom: false });
});
