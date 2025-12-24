import { expect } from "@playwright/test";

const safeAction = async (action: () => Promise<any>) => {
  try {
    await action();
  } catch (err) {
    console.log("معلش حنكمل ", err);
  }
};

const CheckFilteredData = async (
  result: [],
  expectedData: any,
  Status?: boolean
) => {
  //حل عبقري

  if (Status) {
    expect(result).toEqual(Array(result.length).fill(expectedData));
    console.log("All Status are ");
  } else {
    result.forEach((result: any, index: any) => {
      expect(result).toContain(expectedData);
      console.log("All Statussssss are ");
    });
  }
};

const ChangeStatus = async ({ page, Row }: { page: any; Row: any }) => {
  await Row.locator(".self-center").click();
  await page.getByRole("button", { name: "OK" }).click();
  await page.waitForTimeout(3000);
};

const randomNumber = () => {
  return Math.floor(Math.random() * 999); // مثال: رقم لحد 8 digits
};

const TableSearch = async ({
  page,
  Name,
  Edit,
}: {
  page: any;
  Name: string;
  Edit?: boolean;
}) => {
  let isFound = false;

  while (true) {
    // انتظار تحميل الجدول
    await page.waitForSelector("table tbody tr");

    // تحديد الصف الذي نبحث عنه
    const Row = page.locator("table tbody tr").filter({
      has: page.getByText(Name, { exact: true }),
    });

    const rowCount = await Row.count();
    console.log(`Checking page... Found count: ${rowCount}`);

    if (rowCount > 0) {
      // --- الحالة الأولى: تم العثور على الصف ---
      isFound = true;
      if (Edit) {
        await ChangeStatus({ page, Row });
        await Row.locator("a").first().click();
        break;
      } else {
        await Row.locator("a").last().click();
        break;
      }
      // نخرج من الـ Loop لأننا وجدنا المطلوب
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
  return isFound;
};
export {
  safeAction,
  CheckFilteredData,
  ChangeStatus,
  randomNumber,
  TableSearch,
};
