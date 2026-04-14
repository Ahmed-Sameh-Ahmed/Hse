import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/UsersManagement/Users.json";
import User from "../../../../Data/User.json";

import {
  randomNumber,
  TableSearch,
  validateAllowedCharacters,
  validateLength,
} from "../../../../utils/utils";

import Users from "../../../../Pages/UsersManagement/Users/Users";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(
    page,
    User.admin.username,
    User.admin.password,
  );

  const UsersManagement = await Home.GoToUsersManagement({
    page,
    expect,
    ProjectName: project.name,
  });
  await UsersManagement.GoToUsers({ page, expect });
});

test("Show User Details", async ({ page }) => {
  const Userss = new Users();
  await Userss.GoToShowUser({ page, expect, Data });
  await Userss.ShowUser({ page, expect, Data });
});
