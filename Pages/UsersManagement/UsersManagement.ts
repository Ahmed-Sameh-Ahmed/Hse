import Groups from "./Groups/Groups";

class UserManagement {
  async GoToUsers({ page, expect }: { page: any; expect: any }) {
    await page.getByRole("link", { name: "Users" }).click();
    await expect(page).toHaveURL("/users-management/groups");
  }
  async GoToGroups({ page, expect }: { page: any; expect: any }) {
    await page.getByRole("link", { name: "Groups" }).click();
    await expect(page).toHaveURL("/users-management/groups");
  }
  async GoToRoles({ page, expect }: { page: any; expect: any }) {
    await page.getByRole("link", { name: "Roles" }).click();
    await expect(page).toHaveURL("/users-management/roles");
  }
}

export default UserManagement;
