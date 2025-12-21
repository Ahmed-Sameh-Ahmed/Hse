import { randomNumber, ChangeStatus } from "../../../utils/utils";

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
    // await page.waitForSelector("table tbody tr");
    // const Row = page.locator("table tbody tr", {
    //   has: page.locator("td", { hasText: Data.name }),
    // });
    // console.log(await Row.count());
    // if ((await Row.count()) !== 0) {
    //   await ChangeStatus({ page, Row });
    //   await Row.locator("a").first().click();
    // } else {
    //   await this.GoToCreateAssetType({ page, expect });
    //   await this.CreateAssetType({ page, expect, Data, NotRandomNumber: true });
    //   // go to Create
    //   // create
    //   // Go to same fun
    //   await this.GoToEditAssetType({ page, expect, Data });
    // }
    // متغير لمعرفة ما إذا وجدنا الصف أم لا
    let isFound = false;

    while (true) {
      // انتظار تحميل الجدول
      await page.waitForSelector("table tbody tr");

      // تحديد الصف الذي نبحث عنه
      const Row = page.locator("table tbody tr", {
        has: page.locator("td"),
        hasText: Data?.name,
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
    // await page.waitForSelector("table tbody tr");
    // const Row = page.locator("table tbody tr", {
    //   has: page.locator("td", { hasText: Data.name }),
    // });
    // console.log(await Row.count());
    // await Row.locator("a").last().click();
    // await expect(page.url()).toContain("master-data/asset-types/show/");
    let isFound = false;

    while (true) {
      // انتظار تحميل الجدول
      await page.waitForSelector("table tbody tr");

      // تحديد الصف الذي نبحث عنه
      const Row = page.locator("table tbody tr", {
        has: page.locator("td"),
        hasText: Data?.name,
      });

      const rowCount = await Row.count();
      console.log(`Checking page... Found count: ${rowCount}`);

      if (rowCount > 0) {
        // --- الحالة الأولى: تم العثور على الصف ---
        isFound = true;
        await ChangeStatus({ page, Row });
        await Row.locator("a").last().click();
        await expect(page.url()).toContain("master-data/asset-types/show/");

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
          console.log("Can't Find Data");
          break;
        }
      }
    }
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
