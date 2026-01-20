import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/AssetType.json";

import AssetTypes from "../../../../Pages/MasterData/AssetTypes/AssetTypes";
import {
  TableSearch,
  validateAllowedCharacters,
  validateLength,
} from "../../../../utils/utils";

test.beforeEach(async ({ page }, { project }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");

  const UsersManagement = await Home.GoToUsersManagement({
    page,
    expect,
    ProjectName: project.name,
  });
  await UsersManagement.GoToUsers({ page, expect });
});

test("Empty Fields", async ({ page }) => {
  await page.getByRole("button", { name: "Create User" }).click();
  await expect(page).toHaveURL("/users-management/users/create");
});
