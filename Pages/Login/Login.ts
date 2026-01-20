import { expect } from "@playwright/test";

import Home from "../Home/Home";
class login {
  async login(page: any, username: string, password: string) {
    await page.goto("/login");
    await page.getByTestId("email").fill(username);
    await page.getByTestId("password").fill(password);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/home");
    return new Home();
  }
}

export default login;
