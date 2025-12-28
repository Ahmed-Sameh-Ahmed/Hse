import { randomNumber, ChangeStatus, TableSearch } from "../../../utils/utils";

type TData = {
  name: string;
  Description: string;
};

class AssetTypes {
  randomNumber = randomNumber();
  // Create
  async GoToCreateAssetType({ page, expect }: { page: any; expect: any }) {
    await page.getByRole("button", { name: "Add Asset Type" }).click();
    await expect(page).toHaveURL("/master-data/asset-types/create");
  }
  async CreateAssetType({
    page,
    expect,
    Data,
    Empty,
    NotRandomNumber,
    Duplicate,
  }: {
    page: any;
    expect: any;
    Data?: TData;
    Empty?: boolean;
    NotRandomNumber?: boolean;
    Duplicate?: boolean;
  }) {
    if (Empty) {
      await page.getByTestId("save-button").click();
      await expect(
        await page.getByText("This field is required").nth(0)
      ).toBeVisible();
    } else {
      await page
        .getByTestId("name")
        .fill(
          NotRandomNumber ? Data?.name : `${Data?.name}${this.randomNumber}`
        );
      await page.getByTestId("description").fill(Data?.Description);
      await page.getByTestId("save-button").click();
      if (Duplicate) {
        await expect(
          page.getByText("Asset Type already exists.")
        ).toBeVisible();
      } else {
        await expect(page).toHaveURL("/master-data/asset-types");
        await page.getByRole("button", { name: "OK" }).click();
      }
    }
  }

  //Edit

  async GoToEditAssetType({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    // // Go To Edit
    const isFound = await TableSearch({ page, Name: Data?.name, Edit: true });
    // --- إذا انتهى البحث في كل الصفحات ولم نجد الصف ---
    if (!isFound) {
      await this.GoToCreateAssetType({ page, expect });
      await this.CreateAssetType({ page, expect, Data, NotRandomNumber: true });
      await expect(page).toHaveURL("/master-data/asset-types");
      await page.getByRole("button", { name: "OK" }).click();
      await this.GoToEditAssetType({ page, expect, Data });
    }
  }
  async EditAssetType({
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
    await page.getByTestId("name").clear();

    await expect(page.getByTestId("description")).toHaveValue(
      DataBefore.Description
    );
    await page.getByTestId("description").clear();

    await page.getByTestId("name").fill(DataAfter.name);
    await page.getByTestId("description").fill(DataAfter.Description);

    await page.getByTestId("edit-button").click();
    await expect(page).toHaveURL("/master-data/asset-types");
    await page.getByRole("button", { name: "OK" }).click();
  }

  //Show
  async GoToShowAssetType({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    await TableSearch({ page, Name: Data?.name, Show: true });
  }
  async ShowAssetType({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    await expect(page.locator("input[data-testid='name']")).toHaveValue(
      Data.name
    );
    await expect(
      page.locator("textarea[data-testid='description']")
    ).toHaveValue(Data.Description);
  }
}

export default AssetTypes;
