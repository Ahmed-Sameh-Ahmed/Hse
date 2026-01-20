import { randomNumber, TableSearch } from "../../../utils/utils";
import { ROUTES } from "../routes";

type TData = {
  name: string;
  Type: string;
  Serial: string;
  Location: String;
  Site: string;
  Responsible_Person: string;
};

class Assets {
  randomNumber = randomNumber();
  // Create
  async GoToCreateAsset({ page, expect }: { page: any; expect: any }) {
    // Go To Crate

    await page.getByRole("button", { name: "Add Asset" }).click();

    await expect(page).toHaveURL(ROUTES.ASSETS_CREATE);
  }
  async CreateAsset({
    page,
    expect,
    Data,
    notRandomNumber,
    notRandomNumberName,
    Duplicate,
    Empty,
  }: {
    page: any;
    expect: any;
    Data: TData;
    notRandomNumber?: boolean;
    notRandomNumberName?: boolean;
    Duplicate?: boolean;
    Empty?: boolean;
  }) {
    //Create
    if (Empty) {
      await page.getByTestId("save-button").click();
      await expect(
        page.getByText("This field is required").nth(0),
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(1),
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(2),
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(3),
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(4),
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(5),
      ).toBeVisible();
    } else {
      await page
        .getByTestId("name")
        .fill(
          notRandomNumber || notRandomNumberName
            ? Data.name
            : `${Data.name}${this.randomNumber}`,
        );
      await page.getByRole("textbox", { name: "Asset Type *" }).click();
      await page.getByRole("option", { name: Data.Type }).click();
      await page
        .getByTestId("serial_number")
        .fill(
          notRandomNumber ? Data.Serial : `${Data.Serial}${this.randomNumber}`,
        );
      await page.getByRole("textbox", { name: "Location *" }).click();
      await page.getByRole("option", { name: Data.Location }).click();
      await page.getByRole("textbox", { name: "Site *" }).click();
      await page
        .getByRole("option")
        .getByText(Data.Site, { exact: true })
        .click();
      await page.locator("#react-select-3-input").fill(Data.Responsible_Person);
      await page.getByRole("option", { name: Data.Responsible_Person }).click();
      await page.getByTestId("save-button").click();
      if (Duplicate) {
        await expect(
          page.getByText("Asset with this serial number already exists"),
        ).toBeVisible();
      } else {
        await expect(page).toHaveURL(ROUTES.ASSETS);
        await page.getByRole("button", { name: "OK" }).click();
      }
    }
  }
  // Edit
  async GoToEditAsset({
    page,
    Data,
    expect,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    const Found = await TableSearch({
      page,
      Name: Data.name,
      Edit: true,
    });
    if (!Found) {
      await this.GoToCreateAsset({ page, expect });
      await this.CreateAsset({
        page,
        expect,
        Data,
        notRandomNumberName: true,
        notRandomNumber: true,
      });
      await this.GoToEditAsset({ page, expect, Data });
    }
  }
  async EditAsset({
    page,
    expect,
    DataBefore,
    DataAfter,
  }: {
    page: any;
    expect: any;
    DataBefore: TData;
    DataAfter: TData;
  }) {
    await expect(page.getByTestId("name")).toHaveValue(DataBefore.name);
    await expect(
      page.getByRole("textbox", { name: "Asset Type *" }),
    ).toHaveValue(DataBefore.Type);

    await expect(page.getByTestId("serial_number")).toHaveValue(
      DataBefore.Serial,
    );
    await expect(page.getByRole("textbox", { name: "Location *" })).toHaveValue(
      DataBefore.Location,
    );
    await expect(page.getByRole("textbox", { name: "Site *" })).toHaveValue(
      DataBefore.Site,
    );
    await expect(
      page
        .locator(".react-select-container")
        .locator("div", { hasText: DataBefore.Responsible_Person })
        .nth(2),
    ).toHaveText(DataBefore.Responsible_Person);

    //------------------------------------------------------------------------------

    await page.getByTestId("name").clear();
    await page
      .locator("div")
      .filter({ hasText: /^Asset Type \*$/ })
      .locator("button")
      .click();
    await page.getByTestId("serial_number").clear();
    await page
      .locator("div")
      .filter({ hasText: /^Location \*$/ })
      .locator("button")
      .click();
    await page.locator(".react-select-container svg").first().click();

    // -------------------------------------------------------------------------

    await page.getByTestId("name").fill(DataAfter.name);
    await page.getByRole("textbox", { name: "Asset Type *" }).click();
    await page.getByRole("option", { name: DataAfter.Type }).click();
    await page.getByTestId("serial_number").fill(DataAfter.Serial);
    await page.getByRole("textbox", { name: "Location *" }).click();
    await page.getByRole("option", { name: DataAfter.Location }).click();
    await page.getByRole("textbox", { name: "Site *" }).click();
    await page
      .getByRole("option")
      .getByText(DataAfter.Site, { exact: true })
      .click();
    await page
      .locator("#react-select-3-input")
      .fill(DataAfter.Responsible_Person);
    await page
      .getByRole("option", { name: DataAfter.Responsible_Person })
      .click();

    await page.getByTestId("edit-button").click();
    await expect(page).toHaveURL(ROUTES.ASSETS);
    await page.getByRole("button", { name: "OK" }).click();
  }
  // Show
  async GoToShowAsset({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    const Found = await TableSearch({
      page,
      Name: Data.name,
      Show: true,
    });
    if (!Found) {
      console.log("no Data Found");
    }
  }
  async ShowAsset({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    await expect(page.getByTestId("name")).toHaveValue(Data.name);
    await expect(page.getByTestId("asset_type.name")).toHaveValue(Data.Type);

    await expect(page.getByTestId("serial_number")).toHaveValue(Data.Serial);
    await expect(page.getByTestId("location.name")).toHaveValue(Data.Location);
    await expect(page.getByTestId("site.site_name")).toHaveValue(Data.Site);
    await expect(page.getByTestId("responsible_person.name")).toHaveValue(
      Data.Responsible_Person,
    );
  }
}

export default Assets;
