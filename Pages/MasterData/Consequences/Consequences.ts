import {
  ChangeStatus,
  CheckFilteredData,
  randomNumber,
  TableSearch,
} from "../../../utils/utils";
import { ROUTES } from "../routes";

type props = {
  page: any;
  EditData?:TData;
  currentData?:TData;
  Data?: TData;
  expect: any;
  Empty?: Boolean;
  Edit?: Boolean;
  CreateData?: TData;
  showInTable?: string[];
  Duplicate?: boolean;
};

type TData = {
  ConsequencesName: string;
  Description: string;
  Status?: any;
};

class Consequences {
  randomNumber = randomNumber();
  isNotFound = true;

  // Create Consequences
  async GoToCreateConsequences({ page, expect }: props) {
    await page.getByRole("button", { name: "Add Consequence" }).click();
    await expect(page).toHaveURL(ROUTES.CONSEQUENCES_CREATE);
  }
  async CreateConsequences({
    page,
    Data,
    expect,
    Empty,
    Edit,
    Duplicate,
  }: props) {
    await page
      .getByTestId("name")
      .fill(
        Empty
          ? ""
          : Edit
            ? Data?.ConsequencesName
            : `${Data?.ConsequencesName}${this.randomNumber}`,
      );
    await page.getByTestId("description").fill(Empty ? "" : Data?.Description);

    if (Empty) {
      await expect(
        await page
          .locator(".mb-3")
          .locator(".text-red-600", { hasText: "This field is required" }),
      ).toBeVisible();
    } else {
      await page.getByTestId("save-button").click();
      if (Duplicate) {
        await expect(
          page.locator(".mb-3").locator("p", {
            hasText: "Consequence with this name already exists.",
          }),
        ).toBeVisible();
      } else {
        await expect(page).toHaveURL(ROUTES.CONSEQUENCES);
        await page.getByRole("button", { name: "OK" }).click();
      }
    }
  }

  //Edit Consequences
  async GoToEditConsequencesFormTable({ page, Data, expect }: props) {
    const isFound = await TableSearch({
      page,
      Name: Data!.ConsequencesName,
      Edit: true,
    });
    // --- إذا انتهى البحث في كل الصفحات ولم نجد الصف ---
    if (!isFound) {
      await this.GoToCreateConsequences({ page, expect });
      await this.CreateConsequences({
        page: page,
        Data: Data,
        expect: expect,
        Edit: true,
      });
      await expect(page).toHaveURL(ROUTES.CONSEQUENCES);
      await page.getByRole("button", { name: "OK" }).click();
      await this.GoToEditConsequencesFormTable({ page, Data, expect });
    }
  }
  async EditConsequences({ page, currentData,EditData, expect }: props) {
    await expect(page.getByTestId("name")).toHaveValue(currentData?.ConsequencesName);
    await page.getByTestId("name").clear();
    await expect(page.getByTestId("description")).toHaveValue(
      currentData?.Description,
    );
    await page.getByTestId("description").clear();

    await page.getByTestId("name").fill(EditData?.ConsequencesName);
    await page.getByTestId("description").fill(EditData?.Description);
    await page.getByTestId("edit-button").click();
    await expect(page).toHaveURL(ROUTES.CONSEQUENCES);
    await page.getByRole("button", { name: "OK" }).click();
  }

  //Show Consequences
  async GoToShowConsequences({ page, Data, expect }: props) {
    await TableSearch({ page, Name: Data!.ConsequencesName, Show: true });
  }
  async ShowConsequences({ page, Data, expect }: props) {
    await expect(page.locator("input[data-testid='name']")).toHaveValue(
      Data?.ConsequencesName,
    );
    await expect(
      page.locator("textarea[data-testid='description']"),
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

  // Full E2E Workflow: Create -> Show -> Edit -> Inactive
  async E2EConsequencesWorkflow({
    page,
    expect,
    initialData,
    editedData,
  }: {
    page: any;
    expect: any;
    initialData: TData;
    editedData: TData;
  }) {
    // 1. توليد رقم عشوائي ثابت لهذا الاختبار لضمان التفرد
    const uniqueNum = randomNumber();
    const dataToCreate = {
      ...initialData,
      ConsequencesName: `${initialData.ConsequencesName}-${uniqueNum}`,
    };
    const dataToEdit = {
      ...editedData,
      ConsequencesName: `${editedData.ConsequencesName}-${uniqueNum}`,
    };

    // 2. خطوة الإنشاء (Create)
    await this.GoToCreateConsequences({ page, expect });
    await this.CreateConsequences({
      page,
      expect,
      Data: dataToCreate,
      Edit: true, // استخدمنا Edit هنا عشان نبعت الاسم اللي فيه الرقم العشوائي جاهز
    });

    // 3. خطوة العرض والتأكد من البيانات (Show)
    await this.GoToShowConsequences({ page, expect, Data: dataToCreate });
    await this.ShowConsequences({ page, expect, Data: dataToCreate });

    // العودة للجدول الأساسي للقيام بعملية التعديل
    await page.goto(ROUTES.CONSEQUENCES);

    // 4. خطوة التعديل على كل الحقول (Edit)
    await this.GoToEditConsequencesFormTable({ page, expect, Data: dataToCreate });
    await this.EditConsequences({
      page,
      expect,
      currentData: dataToCreate,
      EditData: dataToEdit
    });
  }
}

export default Consequences;
