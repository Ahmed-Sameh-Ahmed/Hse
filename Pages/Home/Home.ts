import MasterData from "../MasterData/MasterData";
import UserManagement from "../UsersManagement/UsersManagement";

class Home {
  async GoToUsersManagement({
    page,
    expect,
    ProjectName,
  }: {
    page: any;
    expect: any;
    ProjectName: string;
  }) {
    if (["chromium", "firefox", "Edge"].includes(ProjectName)) {
      await page.getByRole("link", { name: "Users Management" }).click();
      await expect(page).toHaveURL("/users-management");
    } else {
      await page.locator("header button").first().click();
      await page.getByRole("link", { name: "Users Management" }).click();
      await expect(page).toHaveURL("/users-management");
    }
    return new UserManagement();
  }
  async GoToMasterData({
    page,
    expect,
    ProjectName,
  }: {
    page: any;
    expect: any;
    ProjectName: string;
  }) {
    if (["chromium", "firefox", "Edge"].includes(ProjectName)) {
      await page.getByRole("link", { name: "Incidents Management" }).click();
      await expect(page).toHaveURL("/incidents-management");
    } else {
      await page.locator("header button").first().click();
      await page.getByRole("link", { name: "Incidents Management" }).click();
      await expect(page).toHaveURL("/incidents-management");
    }
    return new MasterData();
  }
}

export default Home;
