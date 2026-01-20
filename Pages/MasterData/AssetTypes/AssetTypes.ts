import {
  randomNumber,
  TableSearch,
  CheckFilteredData,
} from "../../../utils/utils";
import { ROUTES } from "../routes";

type TData = {
  name: string;
  Description: string;
  Status?: string;
};

class AssetTypes {
  randomNumber = randomNumber();
  // Create
  async GoToCreateAssetType({ page, expect }: { page: any; expect: any }) {
    await page.getByRole("button", { name: "Add Asset Type" }).click();
    await expect(page).toHaveURL(ROUTES.ASSET_TYPES_CREATE);
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
        await page.getByText("This field is required").nth(0),
      ).toBeVisible();
    } else {
      await page
        .getByTestId("name")
        .fill(
          NotRandomNumber ? Data?.name : `${Data?.name}${this.randomNumber}`,
        );
      await page.getByTestId("description").fill(Data?.Description);
      await page.getByTestId("save-button").click();
      if (Duplicate) {
        await expect(
          page.getByText("Asset Type already exists."),
        ).toBeVisible();
      } else {
        await expect(page).toHaveURL(ROUTES.ASSET_TYPES);
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
      await expect(page).toHaveURL(ROUTES.ASSET_TYPES);
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
      DataBefore.Description,
    );
    await page.getByTestId("description").clear();

    await page.getByTestId("name").fill(DataAfter.name);
    await page.getByTestId("description").fill(DataAfter.Description);

    await page.getByTestId("edit-button").click();
    await expect(page).toHaveURL(ROUTES.ASSET_TYPES);
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
      Data.name,
    );
    await expect(
      page.locator("textarea[data-testid='description']"),
    ).toHaveValue(Data.Description);
  }

  //Filter
  async FilterAssetType({
    page,
    Data,
    expect,
  }: {
    page: any;
    Data: TData;
    expect: any;
  }) {
    await page.getByRole("button", { name: "Filter" }).click();
    await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();

    await page.getByTestId("name").fill(Data?.name);
    await page.getByTestId("apply-filters").click();

    await page.waitForSelector("table tbody tr");
    const RowCount = await page.locator("table tbody tr").count();

    if (RowCount === 0) {
      console.log("No Data with this filter");
    } else {
      const AllNames = await page
        .locator("table tbody tr td:nth-of-type(1)")
        .allTextContents();

      await CheckFilteredData(AllNames, Data?.name);

      await page.getByRole("button", { name: "Filter" }).first().click();
      await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
      await page.getByRole("textbox", { name: "Status" }).click();
      await page.getByRole("option", { name: "Active", exact: true }).click();

      await page.getByTestId("apply-filters").click();

      if (RowCount === 0) {
        console.log("No Data with this filter");
      } else {
        const AllNames = await page
          .locator("table tbody tr td:nth-of-type(1)")
          .allTextContents();

        const AllStatus = await page
          .locator("table tbody tr td:nth-of-type(3)")
          .allTextContents();
        await CheckFilteredData(AllNames, Data?.name);
        await CheckFilteredData(AllStatus, Data?.Status, true);
      }
    }
  }
}

export default AssetTypes;
