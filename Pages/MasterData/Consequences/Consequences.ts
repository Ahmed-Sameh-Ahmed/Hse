import {
  ChangeStatus,
  CheckFilteredData,
  randomNumber,
} from "../../../utils/utils";

type props = {
  page: any;
  Data?: TData;
  expect: any;
  Empty?: Boolean;
  Edit?: Boolean;
  CreateData?: TData;
  showInTable?: string[];
};

type TData = {
  ConsequencesName: string;
  Description: string;
  Status?: any;
};

class Consequences {
  randomNumber = randomNumber();

  // Create Consequences
  async GoToCreateConsequences({ page, expect }: props) {
    await page.getByRole("button", { name: "Add Consequence" }).click();
    await expect(page).toHaveURL("/master-data/consequences/create");
  }
  async CreateConsequences({ page, Data, expect, Empty, Edit }: props) {
    await page
      .getByTestId("name")
      .fill(
        Empty
          ? ""
          : Edit
          ? Data?.ConsequencesName
          : Data?.ConsequencesName + this.randomNumber
      );
    await page.getByTestId("description").fill(Empty ? "" : Data?.Description);

    if (Empty) {
      expect(
        await page
          .locator(".mb-3")
          .locator(".text-red-600", { hasText: "This field is required" })
      ).toBeVisible();
    } else {
      await page.getByTestId("save-button").click();
      await expect(page).toHaveURL("/master-data/consequences");
      await page.getByRole("button", { name: "OK" }).click();
    }
  }

  //Edit Consequences
  async GoToShowConsequences({
    page,
    Data,
    expect,
    Empty,
    CreateData,
    showInTable,
  }: props) {
    await page.waitForSelector("table tbody tr");
    const RowCount = await page.locator("table tbody tr").count();

    if (RowCount === 0) {
      this.GoToCreateConsequences(page, expect);
      this.CreateConsequences({ page, CreateData, expect, Empty });
    } else {
      const Row = page.locator("table tbody tr", {
        has: page.locator("td"),
        hasText: showInTable?.[0],
      });
      await Row.locator("a").last().click();
      await expect(page.url()).toContain("master-data/consequences/show/");
    }
  }

  async ShowConsequences({ page, Data, expect }: props) {
    await expect(page.locator("input[data-testid='name']")).toHaveValue(
      Data?.ConsequencesName
    );
    await expect(
      page.locator("textarea[data-testid='description']")
    ).toHaveValue(Data?.Description);
  }

  async GoToEditConsequencesFormShowPage({ page, expect }: props) {
    await page.getByRole("button", { name: "Edit" }).click();
    await expect(page.url()).toContain("master-data/consequences/edit/");
  }

  async EditConsequences({ page, Data, expect }: props) {
    await page.getByTestId("name").clear();
    await page.getByTestId("description").clear();
    await page.getByTestId("name").fill(Data?.ConsequencesName);
    await page.getByTestId("description").fill(Data?.Description);
    await page.getByTestId("edit-button").click();
  }

  async GoToEditConsequencesFormTable({ page, Data, expect }: props) {
    await page.waitForSelector("table tbody tr");
    const Row = await page.locator("table tbody tr", {
      has: page.locator("td"),
      hasText: Data?.ConsequencesName,
    });
    console.log(await Row.count());

    if ((await Row.count()) !== 0) {
      await ChangeStatus({ page, Row });
      await Row.locator("a").first().click();
    } else {
      await this.GoToCreateConsequences({ page, expect });
      await this.CreateConsequences({
        page: page,
        Data: Data,
        expect: expect,
        Edit: true,
      });
      await expect(page).toHaveURL("/master-data/consequences");
      await page.getByRole("button", { name: "OK" }).click();
      await this.GoToEditConsequencesFormTable({ page, Data, expect });
    }
  }

  async EditConsequences({ page, Data, expect }: props) {
    await page.getByTestId("name").clear();
    await page.getByTestId("description").clear();
    await page.getByTestId("name").fill(Data?.ConsequencesName);
    await page.getByTestId("description").fill(Data?.Description);
    await page.getByTestId("edit-button").click();
    await expect(page).toHaveURL("/master-data/consequences");
    await page.getByRole("button", { name: "OK" }).click();
  }

  //Show Consequences
  async GoToShowConsequences({ page, Data, expect }: props) {
    await page.waitForSelector("table tbody tr");

    const Row = page.locator("table tbody tr", {
      has: page.locator("td"),
      hasText: Data?.ConsequencesName,
    });
    await Row.locator("a").last().click();
    await expect(page.url()).toContain("master-data/consequences/show/");
  }

  async ShowConsequences({ page, Data, expect }: props) {
    await expect(page.locator("input[data-testid='name']")).toHaveValue(
      Data?.ConsequencesName
    );
    await expect(
      page.locator("textarea[data-testid='description']")
    ).toHaveValue(Data?.Description);
  }

  // Filter Consequences

  async FilterConsequences({ page, Data, expect }: props) {
    await page.getByRole("button", { name: "Filter" }).click();
    await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();

    await page.getByTestId("name").fill(Data?.ConsequencesName);
    await page.getByTestId("apply-filters").click();

    await page.waitForSelector("table tbody tr");
    const RowCount = await page.locator("table tbody tr").count();

    if (RowCount === 0) {
      console.log("No Data with this filter");
    } else {
      const AllNames = await page
        .locator("table tbody tr td:nth-of-type(1)")
        .allTextContents();

      await CheckFilteredData(AllNames, Data?.ConsequencesName);

      await page.getByRole("button", { name: "Filter" }).click();
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
        await CheckFilteredData(AllNames, Data?.ConsequencesName);

        const AllStatus = await page
          .locator("table tbody tr td:nth-of-type(3)")
          .allTextContents();
        await CheckFilteredData(AllStatus, Data?.Status, true);
      }
    }

    await page.waitForTimeout(2000);
    await page.getByRole("button", { name: "Reset" }).click();
    await page.waitForTimeout(3000);
  }
}

export default Consequences;
