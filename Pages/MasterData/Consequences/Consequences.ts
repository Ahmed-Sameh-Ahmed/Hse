type props = {
  page: any;
  Data?: TData;
  expect: any;
  Empty?: Boolean;
  CreateData?: TData;
  showInTable?: string[];
};

type TData = {
  ConsequencesName: string;
  Description: string;
};

class Consequences {
  //Create Consequences
  async GoToCreateConsequences(page: any, expect: any) {
    await page.getByRole("button", { name: "Add Consequence" }).click();
    expect(page).toHaveURL("/master-data/consequences/create");
  }
  async CreateConsequences({ page, Data, expect, Empty }: props) {
    await page.getByTestId("name").fill(Empty ? "" : Data?.ConsequencesName);
    await page.getByTestId("description").fill(Empty ? "" : Data?.Description);

    if (Empty) {
      await expect(
        await page
          .locator(".mb-3")
          .locator(".text-red-600", { hasText: "This field is required" })
      ).toBeVisible();
    } else {
      await page.getByTestId("save-button").click();
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

  //Filter Consequences
}

export default Consequences;
