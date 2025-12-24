import { randomNumber } from "../../../utils/utils";

type TData = {
  Name: string;
  Parent: string;
  Description: string;
};

class Classification {
  randomNumber = randomNumber();

  async GoToCreateClassification({ page, expect }: { page: any; expect: any }) {
    await page.getByRole("button", { name: "Add Classification" }).click();
    await expect(page).toHaveURL("/master-data/classifications/create");
  }

  async CreateClassification({
    page,
    expect,
    Status,
    Data,
    NotRandomNumber,
    Duplicate,
  }: {
    page: any;
    expect: any;
    Status: string;
    Data?: TData;
    NotRandomNumber?: boolean;
    Duplicate?: boolean;
  }) {
    // if (Empty) {
    //   await page.getByTestId("save-button").click();
    //   await expect(
    //     page.getByText("This field is required").nth(0)
    //   ).toBeVisible();
    // } else {
    // }

    switch (Status) {
      case "Empty":
        await page.getByTestId("save-button").click();
        await expect(
          page.getByText("This field is required").nth(0)
        ).toBeVisible();
        break;
      case "Primary_Required":
        await page
          .getByTestId("name")
          .fill(
            NotRandomNumber ? Data?.Name : `${Data?.Name}${this.randomNumber}`
          );
        await page.getByTestId("save-button").click();
        await expect(page).toHaveURL("/master-data/classifications");
        await page.getByRole("button", { name: "OK" }).click();
        break;
      case "Primary_AllFields":
        await page
          .getByTestId("name")
          .fill(
            NotRandomNumber ? Data?.Name : `${Data?.Name}${this.randomNumber}`
          );
        await page.getByTestId("description").fill(Data?.Description);
        await page.getByTestId("save-button").click();
        if (Duplicate) {
          await page.getByText("Classification with this name already exists");
        } else {
          await expect(page).toHaveURL("/master-data/classifications");
          await page.getByRole("button", { name: "OK" }).click();
        }
        break;
      case "Secondary_Required":
        await page
          .getByTestId("name")
          .fill(
            NotRandomNumber ? Data?.Name : `${Data?.Name}${this.randomNumber}`
          );
        await page
          .getByRole("textbox", { name: "Parent Classification" })
          .click();

        await page.getByRole("option", { name: Data?.Parent }).click();
        await page.getByTestId("save-button").click();
        await expect(page).toHaveURL("/master-data/classifications");
        await page.getByRole("button", { name: "OK" }).click();
        break;
      case "Secondary_AllFields":
        await page
          .getByTestId("name")
          .fill(
            NotRandomNumber ? Data?.Name : `${Data?.Name}${this.randomNumber}`
          );
        await page.getByTestId("description").fill(Data?.Description);
        await page
          .getByRole("textbox", { name: "Parent Classification" })
          .click();

        await page.getByRole("option", { name: Data?.Parent }).click();
        await page.getByTestId("save-button").click();
        if (Duplicate) {
          await page.getByText("Classification with this name already exists");
        } else {
          await expect(page).toHaveURL("/master-data/classifications");
          await page.getByRole("button", { name: "OK" }).click();
        }
        await expect(page).toHaveURL("/master-data/classifications");
        await page.getByRole("button", { name: "OK" }).click();
        break;
    }
  }
}

export default Classification;
