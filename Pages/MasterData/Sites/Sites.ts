import { table } from "console";
import { randomNumber, ChangeStatus, TableSearch } from "../../../utils/utils";

type TData = {
  name: string;
  Coordinates?: string;
  Location: string;
  ResponsiblePerson: string;
  Status?: string;
};

class Sites {
  randomNumber = randomNumber();
  // Crate
  async GoToCreateSite({ page, expect }: { page: any; expect: any }) {
    await page.getByRole("button", { name: "Create Site" }).click();
    await expect(page).toHaveURL("/master-data/sites/create");
  }
  async CreateSite({
    page,
    expect,
    Empty,
    Data,
    Required,
    Wrong,
    NotRandomNumber,
    Duplicate,
  }: {
    page: any;
    expect: any;
    Empty?: boolean;
    Data?: TData;
    Required?: boolean;
    Wrong?: boolean;
    NotRandomNumber?: boolean;
    Duplicate?: boolean;
  }) {
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
    } else {
      if (Required) {
        await page
          .getByTestId("site_name")
          .fill(`${Data?.name}${this.randomNumber}`);
        await page.getByRole("textbox", { name: "Location *" }).click();
        await page.getByRole("option", { name: Data?.Location }).click();
        await page.getByRole("combobox").fill(Data?.ResponsiblePerson);
        await page.waitForTimeout(2000);
        await page
          .locator("#react-select-3-listbox", {
            hasText: Data?.ResponsiblePerson,
          })
          .click();
        await page.getByTestId("save-button").click();
        await page.getByRole("button", { name: "OK" }).click();
        await expect(page).toHaveURL("/master-data/sites");
      } else {
        await page
          .getByTestId("site_name")
          .fill(
            NotRandomNumber ? Data?.name : `${Data?.name}${this.randomNumber}`
          );
        await page.getByTestId("goe_coordinates").fill(Data?.Coordinates);
        await page.getByRole("textbox", { name: "Location *" }).click();
        await page.getByRole("option", { name: Data?.Location }).click();
        await page.getByRole("combobox").fill(Data?.ResponsiblePerson);
        await page.waitForTimeout(2000);
        await page
          .locator("#react-select-3-listbox", {
            hasText: Data?.ResponsiblePerson,
          })
          .click();
        await page.getByTestId("save-button").click();
        if (Wrong) {
          await expect(page.getByText("Must be a valid number")).toBeVisible();
        } else if (Duplicate) {
          await expect(
            page.getByText("Site with this name already")
          ).toBeVisible();
        } else {
          await page.getByRole("button", { name: "OK" }).click();
          await expect(page).toHaveURL("/master-data/sites");
        }
      }
    }
  }

  // Edit
  async GoToEditSite({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    const isFound = await TableSearch({ Name: Data.name, page, Edit: true });
    if (!isFound) {
      // go to Create
      await this.GoToCreateSite({ page, expect });
      //Create with same data
      await this.CreateSite({ page, expect, Data, NotRandomNumber: true });
      await this.GoToEditSite({ page, expect, Data });
    }
  }
  async EditSite({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    await expect(page.locator("input[data-testid='site_name']")).toHaveValue(
      Data.name
    );
    await expect(
      page.locator("input[data-testid='goe_coordinates']")
    ).toHaveValue(Data.Coordinates);
    await expect(page.locator("input[id='location.id']")).toHaveValue(
      Data.Location
    );
    await expect(
      page
        .locator(".react-select-container")
        .locator("div", { hasText: Data.ResponsiblePerson })
        .nth(2)
    ).toHaveText(Data.ResponsiblePerson);

    await page.locator("input[data-testid='site_name']").clear();
    await page.locator("input[data-testid='goe_coordinates']").clear();
    await page
      .locator("div")
      .filter({ hasText: /^Location \*$/ })
      .locator("button")
      .click();
    await page.locator(".react-select-container").locator("svg").nth(0).click();

    await page.getByTestId("site_name").fill(Data.name);
    await page.getByTestId("goe_coordinates").fill(Data.Coordinates);
    await page.getByRole("textbox", { name: "Location *" }).click();
    await page.getByRole("option", { name: Data?.Location }).click();
    await page.getByRole("combobox").fill(Data?.ResponsiblePerson);
    await page.waitForTimeout(2000);
    await page
      .locator("#react-select-3-listbox", {
        hasText: Data?.ResponsiblePerson,
      })
      .click();
    await page.getByTestId("edit-button").click();
    await page.getByRole("button", { name: "OK" }).click();
    await expect(page).toHaveURL("/master-data/sites");
  }

  // Show
  async GoToShowSite({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    await TableSearch({ page, Name: Data.name, Show: true });
  }
  async ShowSite({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    await expect(page.locator("input[data-testid='site_name']")).toHaveValue(
      Data.name
    );
    await expect(
      page.locator("input[data-testid='goe_coordinates']")
    ).toHaveValue(Data.Coordinates);
    await expect(
      page.locator("input[data-testid='location.name']")
    ).toHaveValue(Data.Location);
    await expect(
      page.locator("input[data-testid='responsible_person.name']")
    ).toHaveValue(Data.ResponsiblePerson);
  }
}
export default Sites;
