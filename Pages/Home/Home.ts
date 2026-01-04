import MasterData from "../MasterData/MasterData";
import UserManagement from "../UsersManagement/UsersManagement";

class Home {
  async GoToUsersManagement(page: any, expect: any) {
    await page.getByRole("link", { name: "Users Management" }).click();
    await expect(page).toHaveURL("/users-management");
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
      await page.getByRole("link", { name: "Master Data" }).click();
      await expect(page).toHaveURL("/master-data");
    } else {
      await page.locator("header button").first().click();
      await page.getByRole("link", { name: "Master Data" }).click();
      await expect(page).toHaveURL("/master-data");
    }
    return new MasterData();
  }
}

export default Home;
