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
    User.test1.username,
    User.test1.password,
  );

  const UsersManagement = await Home.GoToUsersManagement({
    page,
    expect,
    ProjectName: project.name,
  });
  await UsersManagement.GoToUsers({ page, expect });
});

// test("Empty Fields", async ({ page }) => {
//   // const uniqueNum = randomNumber();
//   // const initialData = Data.Create.Required;
//   // const dataToCreate = {
//   //   ...initialData,
//   //   fullname: `${initialData.fullname}-${uniqueNum}`,
//   // };
//   const Userss = new Users();
//   await Userss.GoToCreateUser({ page, expect });
//   await Userss.CreateUser({ page, expect, Empty: true });
// });

// test("Create User with Required Fields", async ({ page }) => {
//   const Userss = new Users();
//   await Userss.GoToCreateUser({ page, expect });
//   await Userss.CreateUser({
//     page,
//     expect,
//     Data: Data.Create.Required,
//     Required: true,
//   });
// });

test("Create User with All Fields", async ({ page }) => {
  const Userss = new Users();
  await Userss.GoToCreateUser({ page, expect });
  await Userss.CreateUser({
    page,
    expect,
    Data: Data.Create.all_fields,
    Required: false,
  });
});
