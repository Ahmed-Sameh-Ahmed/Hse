import { randomNumber } from "../../../utils/utils";

type TData = {
  name: String;
  Type: String;
  Serial: String;
  Location: String;
  Site: String;
  Responsible_Person: String;
};

class Assets {
  randomNumber = randomNumber();
  // Create
  async GoToCreateAsset({ page, expect }: { page: any; expect: any }) {
    // Go To Crate

    await page.getByRole("button", { name: "Add Asset" }).click();

    await expect(page).toHaveURL("/master-data/assets/create");
  }
  async CreateAsset({
    page,
    expect,
    Data,
    notRandomNumber,
    Duplicate,
    Empty,
  }: {
    page: any;
    expect: any;
    Data: TData;
    notRandomNumber?: boolean;
    Duplicate?: boolean;
    Empty?: boolean;
  }) {
    //Create
    if (Empty) {
      await page.getByTestId("save-button").click();
      await expect(
        page.getByText("This field is required").nth(0)
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(1)
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(2)
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(3)
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(4)
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(5)
      ).toBeVisible();
    } else {
      await page
        .getByTestId("name")
        .fill(notRandomNumber ? Data.name : `${Data.name}${this.randomNumber}`);
      await page.getByRole("textbox", { name: "Asset Type *" }).click();
      await page.getByRole("option", { name: Data.Type }).click();
      await page
        .getByTestId("serial_number")
        .fill(
          notRandomNumber ? Data.Serial : `${Data.Serial}${this.randomNumber}`
        );
      await page.getByRole("textbox", { name: "Location *" }).click();
      await page.getByRole("option", { name: Data.Location }).click();
      await page.getByRole("textbox", { name: "Site *" }).click();
      await page.getByRole("option", { name: Data.Site }).click();
      await page.getByRole("textbox", { name: "Responsible Person *" }).click();
      await page.getByRole("option", { name: Data.Responsible_Person }).click();
      await page.getByTestId("save-button").click();
      if (Duplicate) {
        await expect(
          page.getByText("Asset with this serial number already exists")
        ).toBeVisible();
      } else {
        await expect(page).toHaveURL("/master-data/assets");
        await page.getByRole("button", { name: "OK" }).click();
      }
    }
  }
  // Edit
  async GoToEditAsset({ page, expect }: { page: any; expect: any }) {}
  async EditAsset({ page, expect }: { page: any; expect: any }) {}
  // Show
  async GoToShowAsset({ page, expect }: { page: any; expect: any }) {}
  async ShowAsset({ page, expect }: { page: any; expect: any }) {}
}

export default Assets;
