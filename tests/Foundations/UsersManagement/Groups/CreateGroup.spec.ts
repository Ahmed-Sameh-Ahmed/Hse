import { test, expect } from "@playwright/test";

//Pages
import Login from "../../../../Pages/Login/Login";
import Groups from "../../../../Pages/UsersManagement/Groups/Groups";

//Data
import GroupsData from "../../../../Data/UsersManagement/Group.json";

test.beforeEach(async ({ page }) => {
  const Home = await new Login().login(page, "admin@admin.com", "123456");
  const UsersManagementPage = await Home.GoToUsersManagement(page, expect);
  await UsersManagementPage.GoToGroups(page, expect);
});

test("Create Group With Right Data", async ({ page }) => {
  const Group = new Groups();
  await Group.GoToCreateGroup(page, expect);
  await Group.CreateGroup(page, expect, GroupsData.Create.Right);
});
