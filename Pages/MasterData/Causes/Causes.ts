import { BlobOptions } from "buffer";
import {
  randomNumber,
  ChangeStatus,
  CheckFilteredData,
} from "../../../utils/utils";

type TData = {
  Name: string;
  Type: string;
  ParentCause?: string;
  Description?: string;
  Status?: string;
};

class Causes {
  randomNumber = randomNumber();

  //Create
  async GoToCreateCause({ page, expect }: { page: any; expect: any }) {
    await page.getByRole("button", { name: "Add Cause" }).click();
    await expect(page).toHaveURL("/master-data/causes/create");
  }
  async CreateCause({
    page,
    expect,
    Empty,
    Data,
    subCause,
    CategoryData,
    NotRandomNumber,
    Duplicate,
  }: {
    page: any;
    expect: any;
    Empty?: boolean;
    Data?: TData;
    subCause?: boolean;
    CategoryData?: TData;
    NotRandomNumber?: boolean;
    Duplicate?: boolean;
  }) {
    if (Empty) {
      if (subCause) {
        await page.getByRole("textbox", { name: "Type *" }).click();
        await page
          .locator(".m_c0783ff9")
          .locator("span", { hasText: "Sub-Cause" })
          .click();
        await page.getByTestId("save-button").click();

        await expect(
          page.getByText("This field is required").nth(0)
        ).toBeVisible();

        await expect(
          page.getByText("This field is required").nth(1)
        ).toBeVisible();
      } else {
        await page.getByTestId("save-button").click();

        await expect(
          page.getByText("This field is required").nth(0)
        ).toBeVisible();

        await expect(
          page.getByText("This field is required").nth(1)
        ).toBeVisible();
      }
    } else {
      await page
        .getByTestId("name")
        .fill(NotRandomNumber ? Data!.Name : Data!.Name + this.randomNumber);
      await page.getByRole("textbox", { name: "Type *" }).click();
      await page
        .locator(".m_c0783ff9")
        .locator("span", { hasText: Data?.Type })
        .click();
      if (subCause) {
        await page.getByRole("textbox", { name: "Parent Cause *" }).click();

        // علشان لو فاضيه
        try {
          await page.getByRole("presentation").locator("span").nth(0).click();
        } catch (error) {
          //يكريت كوز الاول
          this.CreateCause({ page, expect, Data: CategoryData });
          this.GoToCreateCause({ page, expect });
          this.CreateCause({ page, expect, subCause: true, Data });
          // يرجع هنا تاني
        }
      }
      await page.getByTestId("save-button").click();
      if (Duplicate) {
        await expect(
          page.getByText("Cause with this name already")
        ).toBeVisible();
      } else {
        await expect(page).toHaveURL("/master-data/causes");
        await page.getByRole("button", { name: "OK" }).click();
      }
    }
  }
  //Edit
  async GoToEditCause({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    // //go to edit & change status

    // await page.waitForSelector("table tbody tr");
    // const Row = await page.locator("table tbody tr", {
    //   has: page.locator("td", { hasText: Data?.Name }),
    // });
    // console.log(await Row.count());

    // if ((await Row.count()) !== 0) {
    //   await ChangeStatus({ page, Row });
    //   await Row.locator("a").first().click();
    // } else {
    //   // go to create
    //   await this.GoToCreateCause({ page, expect });
    //   // create with same data
    //   await this.CreateCause({
    //     page,
    //     expect,
    //     Data: Data,
    //     NotRandomNumber: true,
    //     subCause: true,
    //   });
    //   // this function again
    //   await this.GoToEditCause({ page, Data, expect });
    // }
    // متغير لمعرفة ما إذا وجدنا الصف أم لا
    let isFound = false;

    while (true) {
      // انتظار تحميل الجدول
      await page.waitForSelector("table tbody tr");

      // تحديد الصف الذي نبحث عنه
      const Row = page.locator("table tbody tr", {
        has: page.locator("td"),
        hasText: Data?.Name,
      });

      const rowCount = await Row.count();
      console.log(`Checking page... Found count: ${rowCount}`);

      if (rowCount > 0) {
        // --- الحالة الأولى: تم العثور على الصف ---
        isFound = true;
        await ChangeStatus({ page, Row });
        await Row.locator("a").first().click();
        break; // نخرج من الـ Loop لأننا وجدنا المطلوب
      } else {
        // --- الحالة الثانية: لم يتم العثور عليه في هذه الصفحة ---

        // !!!!!!! (يجب تعديل هذا الجزء يدويًا) !!!!!!!
        // ضع هنا السليكتور الخاص بزر "الصفحة التالية" في جدولك
        // مثال: page.getByRole('button', { name: 'Next' }) أو page.locator('.pagination-next')
        const nextButton = page
          .locator(
            "div [class='flex justify-center !text-primary px-2 mt-4 rtl:flex-row-reverse']"
          )
          .locator("button")
          .last();

        // نتحقق مما إذا كان زر التالي موجوداً وقابلاً للضغط
        // (بعض الجداول تخفي الزر، وبعضها يجعله disabled في آخر صفحة)
        if ((await nextButton.isVisible()) && (await nextButton.isEnabled())) {
          await nextButton.click();

          // انتظار بسيط لتحميل البيانات الجديدة (فيفضل انتظار اختفاء علامة التحميل loading spinner إن وجدت)
          // يمكنك استبدال هذا السطر بـ: await page.waitForSelector('.loading-spinner', { state: 'detached' });
          await page.waitForTimeout(1000);
        } else {
          // وصلنا لآخر صفحة ولم نجد الزر، نخرج من الـ Loop
          break;
        }
      }
    }

    // --- إذا انتهى البحث في كل الصفحات ولم نجد الصف ---
    if (!isFound) {
      await this.GoToCreateCause({ page, expect });
      // create with same data
      await this.CreateCause({
        page,
        expect,
        Data: Data,
        NotRandomNumber: true,
        subCause: true,
      });
      await expect(page).toHaveURL("/master-data/causes");
      await page.getByRole("button", { name: "OK" }).click();
      await this.GoToEditCause({ page, Data, expect });
    }
  }

  async EditCause({
    page,
    expect,
    DataBefore,
    DataAfter,
    Category,
  }: {
    page: any;
    expect: any;
    DataBefore: TData;
    DataAfter: TData;
    Category?: Boolean;
  }) {
    await expect(page.getByTestId("name")).toHaveValue(DataBefore.Name);
    await expect(page.getByRole("textbox", { name: "Type *" })).toHaveValue(
      DataBefore.Type
    );
    await expect(
      page.getByRole("textbox", { name: "Parent Cause *" })
      // Cause1
    ).toHaveValue(DataBefore?.ParentCause?.toLowerCase() + "1");
    await page.getByTestId("name").clear();
    await page.locator(".mantine-focus-auto").first().click();

    await page.getByTestId("name").fill(DataAfter.Name);
    if (Category) {
      await page.getByRole("textbox", { name: "Type *" }).click();
      await page
        .locator(".m_c0783ff9")
        .locator("span", { hasText: "Category" })
        .click();
    } else {
      await page.getByRole("textbox", { name: "Type *" }).click();
      await page
        .locator(".m_c0783ff9")
        .locator("span", { hasText: DataAfter.Type })
        .click();

      await page.getByRole("textbox", { name: "Parent Cause *" }).click();

      await page
        .getByRole("option", {
          name: DataBefore?.ParentCause?.toLowerCase() + "1",
          exact: true,
        })
        .click();
    }

    await page.getByTestId("edit-button").click();
    await expect(page).toHaveURL("/master-data/causes");
    await page.getByRole("button", { name: "OK" }).click();
  }

  //Show
  async GoToShowCause({
    page,
    Data,
    expect,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    await page.waitForSelector("table tbody tr");

    const Row = page.locator("table tbody tr", {
      has: page.locator("td"),
      hasText: Data.Name,
    });
    await Row.locator("a").last().click();
    await expect(page.url()).toContain("master-data/causes/show/");
  }

  async ShowCause({
    page,
    Data,
    expect,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    await expect(page.locator("input[data-testid='name']")).toHaveValue(
      Data?.Name
    );
    await expect(page.locator("input[id='type']")).toHaveValue(Data?.Type);
    await expect(
      page.locator("input[data-testid='parent_cause.name']")
      //cause1
    ).toHaveValue(Data?.ParentCause?.toLowerCase() + "1");
    await expect(
      page.locator("textarea[data-testid='description']")
    ).toHaveValue(Data?.Description);
  }

  // Filter
  async FilterCause({
    page,
    expect,
    DataAfter,
    DataAfterCategory,
    isCategory,
  }: {
    page: any;
    expect: any;
    DataAfter: TData;
    DataAfterCategory?: TData;
    isCategory?: boolean;
  }) {
    if (isCategory) {
      await page.getByRole("button", { name: "Filter" }).click();
      await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
      await page.getByTestId("name").fill(DataAfterCategory?.Name);
      await page.getByTestId("apply-filters").click();
      await page.waitForSelector("table tbody tr");
      const RowCount = await page
        .locator("table tbody tr td", { hasText: DataAfterCategory?.Name })
        .count();
      if (RowCount == 0) {
        console.log("No Data with this filter");
      } else {
        const AllNames = await page
          .locator("table tbody tr td:nth-of-type(1)")
          .allTextContents();
        await CheckFilteredData(AllNames, DataAfterCategory?.Name);
        await page.getByRole("button", { name: "Filter" }).click();
        await expect(
          page.getByRole("heading", { name: "Filter" })
        ).toBeVisible();
        await page.getByRole("textbox", { name: "Type" }).click();
        await page
          .locator(".m_c0783ff9")
          .locator("span", { hasText: DataAfterCategory?.Type })
          .click();
        await page.getByTestId("apply-filters").click();
        await page.waitForSelector("table tbody tr");
        const RowCount = await page
          .locator("table tbody tr", { hasText: DataAfterCategory?.Name })
          .count();
        if (RowCount == 0) {
          console.log("No Data with this filter");
        } else {
          const AllNames = await page
            .locator("table tbody tr td:nth-of-type(1)")
            .allTextContents();
          const AllTypes = await page
            .locator("table tbody tr td:nth-of-type(2)")
            .allTextContents();
          await CheckFilteredData(AllNames, DataAfterCategory?.Name);
          await CheckFilteredData(
            AllTypes,
            DataAfterCategory?.Type.toLowerCase()
          );
          await page.getByRole("button", { name: "Filter" }).click();
          await expect(
            page.getByRole("heading", { name: "Filter" })
          ).toBeVisible();
          await page.getByRole("textbox", { name: "Status" }).click();
          await page
            .getByRole("option", {
              name: DataAfterCategory?.Status,
              exact: true,
            })
            .click();
          await page.getByTestId("apply-filters").click();
          await page.waitForSelector("table tbody tr");
          const RowCount = await page
            .locator("table tbody tr", { hasText: DataAfterCategory?.Name })
            .count();
          if (RowCount == 0) {
            console.log("No Data with this filter Status");
          } else {
            const AllNames = await page
              .locator("table tbody tr td:nth-of-type(1)")
              .allTextContents();
            const AllTypes = await page
              .locator("table tbody tr td:nth-of-type(2)")
              .allTextContents();
            const AllStatus = await page
              .locator("table tbody tr td:nth-of-type(4)")
              .allTextContents();
            await CheckFilteredData(AllNames, DataAfterCategory?.Name);
            await CheckFilteredData(
              AllTypes,
              DataAfterCategory?.Type.toLowerCase()
            );
            await CheckFilteredData(AllStatus, DataAfterCategory?.Status, true);
          }
        }
      }
    } else {
      await page.getByRole("button", { name: "Filter" }).click();
      await expect(page.getByRole("heading", { name: "Filter" })).toBeVisible();
      await page.getByTestId("name").fill(DataAfter.Name);
      await page.getByTestId("apply-filters").click();
      await page.waitForSelector("table tbody tr");
      const RowCount = await page
        .locator("table tbody tr td", { hasText: DataAfter.Name })
        .count();
      if (RowCount == 0) {
        console.log("No Data with this filter");
      } else {
        const AllNames = await page
          .locator("table tbody tr td:nth-of-type(1)")
          .allTextContents();
        await CheckFilteredData(AllNames, DataAfter.Name);
        await page.getByRole("button", { name: "Filter" }).click();
        await expect(
          page.getByRole("heading", { name: "Filter" })
        ).toBeVisible();
        await page.getByRole("textbox", { name: "Type" }).click();
        await page
          .locator(".m_c0783ff9")
          .locator("span", { hasText: DataAfter.Type })
          .click();
        await page.getByTestId("apply-filters").click();
        await page.waitForSelector("table tbody tr");
        const RowCount = await page
          .locator("table tbody tr", { hasText: DataAfter.Name })
          .count();
        if (RowCount == 0) {
          console.log("No Data with this filter");
        } else {
          const AllNames = await page
            .locator("table tbody tr td:nth-of-type(1)")
            .allTextContents();
          const AllTypes = await page
            .locator("table tbody tr td:nth-of-type(2)")
            .allTextContents();
          await CheckFilteredData(AllNames, DataAfter.Name);
          await CheckFilteredData(AllTypes, DataAfter.Type.toLowerCase());
          await page.getByRole("button", { name: "Filter" }).click();
          await expect(
            page.getByRole("heading", { name: "Filter" })
          ).toBeVisible();
          await page.getByRole("textbox", { name: "Parent Cause" }).click();
          await page.getByRole("option", { name: "cause1" }).click();
          await page.getByTestId("apply-filters").click();
          await page.waitForSelector("table tbody tr");
          const RowCount = await page
            .locator("table tbody tr", { hasText: DataAfter.Name })
            .count();
          if (RowCount == 0) {
            console.log("No Data with this filter");
          } else {
            const AllNames = await page
              .locator("table tbody tr td:nth-of-type(1)")
              .allTextContents();
            const AllTypes = await page
              .locator("table tbody tr td:nth-of-type(2)")
              .allTextContents();
            const AllParentCause = await page
              .locator("table tbody tr td:nth-of-type(3)")
              .allTextContents();
            await CheckFilteredData(AllNames, DataAfter.Name);
            await CheckFilteredData(AllTypes, DataAfter.Type.toLowerCase());
            await CheckFilteredData(
              AllParentCause,
              `${DataAfter?.ParentCause?.toLowerCase()}1`
            );
            page.getByRole("button", { name: "Filter" }).click();
            await expect(
              page.getByRole("heading", { name: "Filter" })
            ).toBeVisible();
            await page.getByRole("textbox", { name: "Status" }).click();
            await page
              .getByRole("option", { name: DataAfter.Status, exact: true })
              .click();
            await page.getByTestId("apply-filters").click();
            await page.waitForSelector("table tbody tr");
            const RowCount = await page
              .locator("table tbody tr", { hasText: DataAfter.Name })
              .count();
            if (RowCount == 0) {
              console.log("No Data with this filter Status");
            } else {
              const AllNames = await page
                .locator("table tbody tr td:nth-of-type(1)")
                .allTextContents();
              const AllTypes = await page
                .locator("table tbody tr td:nth-of-type(2)")
                .allTextContents();
              const AllParentCause = await page
                .locator("table tbody tr td:nth-of-type(3)")
                .allTextContents();
              const AllStatus = await page
                .locator("table tbody tr td:nth-of-type(4)")
                .allTextContents();
              await CheckFilteredData(AllNames, DataAfter.Name);
              await CheckFilteredData(AllTypes, DataAfter.Type.toLowerCase());
              await CheckFilteredData(
                AllParentCause,
                `${DataAfter?.ParentCause?.toLowerCase()}1`
              );
              await CheckFilteredData(AllStatus, DataAfter.Status, true);
            }
          }
        }
      }
    }
  }
}

export default Causes;
