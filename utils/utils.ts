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
  Show,
  Button,
}: {
  page: any;
  Name: string;
  Edit?: boolean;
  Show?: boolean;
  Button?: boolean;
}) => {
  let isFound = false;

  while (true) {
    await page.waitForSelector("table tbody tr");

    // 1. جلب جميع الصفوف الموجودة في الصفحة الحالية
    const allRows = page.locator("table tbody tr");
    const rowCount = await allRows.count();

    let matchedRow = null;

    // 2. الدوران على الصفوف صفاً بصف
    for (let i = 0; i < rowCount; i++) {
      const currentRow = allRows.nth(i);

      // نتحقق من النص داخل أول خلية (td) في الصف الحالي
      // إذا كنت تريد البحث في الصف كله وليس الخلية الأولى فقط، استخدم currentRow مباشرة
      const firstCellText = await currentRow.locator("td").first().innerText();

      if (firstCellText.trim() === Name) {
        matchedRow = currentRow; // وجدنا الصف المطلوب
        isFound = true;
        break; // نخرج من الـ for loop لنبدأ التعامل مع الصف
      }
    }

    if (isFound && matchedRow) {
      // --- الحالة الأولى: تم العثور على الصف المطابق ---
      // هنا الـ Row الذي سنمرره هو "matchedRow"
      const Row = matchedRow;

      if (Edit) {
        if (Button) {
          await Row.locator("button").first().click();
        } else {
          await ChangeStatus({ page, Row });
          await Row.locator("a").first().click();
          await expect(page.url()).toContain("/edit");
        }
      } else if (Show) {
        if (Button) {
          await Row.locator("button").last().click();
        } else {
          await Row.locator("a").last().click();
          await expect(page.url()).toContain("/show");
        }
      }
      break; // نخرج من الـ while loop
    } else {
      // --- الحالة الثانية: لم نجد التطابق في هذه الصفحة، ننتقل للتالي ---
      const nextButton = page
        .locator(
          "div [class='flex justify-center !text-primary px-2 mt-4 rtl:flex-row-reverse']"
        )
        .locator("button")
        .last();

      if ((await nextButton.isVisible()) && (await nextButton.isEnabled())) {
        await nextButton.click();
        await page.waitForTimeout(1000);
      } else {
        break; // وصلنا للنهاية ولم نجد شيئاً
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
