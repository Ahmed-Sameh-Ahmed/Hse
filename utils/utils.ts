import { expect, Locator } from "@playwright/test";
import xlsx from "xlsx";
import { table } from "console";
import login from "../Pages/Login/Login";

const safeAction = async (action: () => Promise<any>) => {
  try {
    await action();
  } catch (err) {
    console.log("Safe action", err);
  }
};

const readExcel = async (filePath: string) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0]; // قراءة أول شيت
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet); // تحويل البيانات لـ Array
};

const CheckFilteredData = async (
  result: any[],
  expectedData: string,
  Status?: boolean,
) => {
  const lowerExpected = expectedData.toLowerCase();
  if (Status) {
    const normalizedResult = result.map((item: any) =>
      String(item).toLowerCase(),
    );
    expect(normalizedResult).toEqual(Array(result.length).fill(lowerExpected));
    console.log("All Status matches perfectly (Case-insensitive)");
  } else {
    result.forEach((item: any) => {
      expect(String(item).toLowerCase()).toContain(lowerExpected);
      console.log("Item contains expected data (Case-insensitive)");
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
          "div [class='flex justify-center !text-primary px-2 mt-4 rtl:flex-row-reverse']",
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

// /**
//  * Required field validation
//  */
// async function validateRequiredField(
//   field: Locator,
//   submitBtn: Locator,
//   errorMsg: Locator
// ) {
//   await field.fill("");
//   await submitBtn.click();
//   await expect(errorMsg).toBeVisible();
// }

/**
 * Min & Max Length validation
 */
async function validateLength({
  field,
  submitBtn,
  errorMsg,
  min,
  max,
}: {
  field: Locator;
  submitBtn: Locator;
  errorMsg: Locator;
  min: number;
  max: number;
}) {
  // أقل من Min
  await field.fill("a".repeat(min - 1));
  await submitBtn.click();
  await expect(errorMsg).toBeVisible();

  // يساوي Min
  await field.fill("a".repeat(min));
  await submitBtn.click();
  await expect(errorMsg).not.toBeVisible();

  // يساوي Max
  await field.fill("a".repeat(max));
  await submitBtn.click();
  await expect(errorMsg).not.toBeVisible();

  // أكبر من Max
  await field.fill("a".repeat(max + 1));
  await submitBtn.click();
  await expect(errorMsg).toBeVisible();
}

/**
 * Allowed characters validation
 */
async function validateAllowedCharacters({
  field,
  submitBtn,
  errorMsg,
  validInputs,
}: {
  field: Locator;
  submitBtn: Locator;
  errorMsg?: Locator;
  validInputs: string[];
}) {
  for (const value of validInputs) {
    await field.fill(value);
    await submitBtn.click();
    if (errorMsg) {
      await expect(errorMsg).not.toBeVisible();
    }
  }
}

/**
 * Not allowed characters validation
 */
async function validateSpecialCharacters(
  field: Locator,
  submitBtn: Locator,
  errorMsg: Locator,
  invalidInputs: string[],
) {
  for (const value of invalidInputs) {
    await field.fill(value);
    await submitBtn.click();
    await expect(errorMsg).toBeVisible();
  }
}

/**
 * Security inputs (SQL Injection & XSS)
 */
async function validateSecurityInputs(
  field: Locator,
  submitBtn: Locator,
  errorMsg: Locator,
) {
  const securityInputs = [
    "' OR '1'='1",
    "admin'--",
    "<script>alert('XSS')</script>",
    "<img src=x onerror=alert(1)>",
  ];

  for (const value of securityInputs) {
    await field.fill(value);
    await submitBtn.click();
    await expect(errorMsg).toBeVisible();
  }
}
/**
 * Security inputs (SQL Injection & XSS)
 */

const Reachability = async ({
  page,
  URL,
  PageName,
  Role,
  testInfo,
}: {
  page: any;
  URL: string;
  PageName: string;
  Role: "heading" | "paragraph";
  testInfo: any;
}) => {
  const response = await page.goto(URL);
  // network test
  if (response.status() !== 200) {
    console.log(`Response Status ${response.status()} form ${PageName}`);
  } else {
    console.log(`Connection Established form ${PageName}`);
    await smoke({ page, PageName, Role, URL });
    const Result = await analyzeNetworkPerformance({ page });

    const NetworkPerformance = {
      "Domain to IP:": Result.metrics.dns,
      "Time To Connect to Server:": Result.metrics.tcp,
      "Time To First Byte:": Result.metrics.ttfb,
      "Data on Page:": Result.metrics.download,
      "total Duration:": Result.metrics.totalDuration,
      "Cash change the numbers:": Result.metrics.transferSize,
      "success:": Result.success,
      "violations:": Result.violations,
    };

    // console.log(`Domain to IP: ${Result.metrics.dns}`);
    // console.log(`Time To Connect to Server: ${Result.metrics.tcp}`);
    // console.log(`Time To First Byte: ${Result.metrics.ttfb}`);
    // console.log(`Data on Page: ${Result.metrics.download}`);
    // console.log(`totalDuration: ${Result.metrics.totalDuration}`);
    // console.log(`Cash change the numbers: ${Result.metrics.transferSize}`);
    // console.log(`success: ${Result.success}`);
    // console.log(`violations: ${Result.violations}`);
    await testInfo.attach("Network Performance", {
      body: JSON.stringify(NetworkPerformance, null, 2),
      contentType: "application/json",
    });
  }
};

const smoke = async ({
  page,
  URL,
  PageName,
  Role,
}: {
  page: any;
  URL: string;
  PageName: string;
  Role: "heading" | "paragraph";
}) => {
  const UsersManagement = ["Users", "Groups", "Roles"];
  const MasterData = [
    "Organization Hierarchy",
    "Hazards",
    "Consequences",
    "Causes",
    "Classifications",
    "Sites",
    "Asset Types",
    "Assets",
    "Severity Matrix",
    "Task Analysis",
    "Root Cause Analysis",
  ];
  const Settings = [
    "General",
    "Display & Localization",
    "Time & Date",
    "SMTP Configurations",
  ];

  //main content

  switch (PageName) {
    //SideBar
    case "Master Data":
      {
        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        //Total Count
        const ItemsCount = await page
          .locator(".animate__fadeIn.animate__animated")
          .getByRole("link")
          .count();
        expect(ItemsCount).toEqual(11);
        // Right Names
        for (const link of MasterData) {
          await expect(
            page.getByRole("link", { name: link, exact: true }),
          ).toBeVisible();
        }
      }
      break;
    case "Users Management":
      {
        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        //Total Count
        const ItemsCount = await page
          .locator(".animate__fadeIn.animate__animated")
          .getByRole("link")
          .count();
        expect(ItemsCount).toEqual(3);
        // Right Names
        for (const link of UsersManagement) {
          await expect(
            page.getByRole("link", { name: link, exact: true }),
          ).toBeVisible();
        }
      }
      break;
    case "Settings":
      {
        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        //Total Count
        const ItemsCount = await page
          .locator(".animate__fadeIn.animate__animated")
          .getByRole("link")
          .count();
        expect(ItemsCount).toEqual(4);
        // Right Names
        for (const link of Settings) {
          await expect(
            page.getByRole("link", { name: link, exact: true }),
          ).toBeVisible();
        }
      }
      break;
    // Master Data Modules
    case "Organization Hierarchy":
      {
        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        //Buttons
        const CreateButton = await page.getByRole("button", {
          name: "Create Organization Hierarchy",
        });
        const FilterButton = await page.getByRole("button", { name: "Filter" });
        const ResetButton = await page.getByRole("button", { name: "Reset" });
        const NextPageButton = await page
          .locator(
            "div [class='flex justify-center !text-primary px-2 mt-4 rtl:flex-row-reverse']",
          )
          .locator("button")
          .last();

        await expect(CreateButton).toBeVisible();
        await expect(FilterButton).toBeVisible();
        await expect(ResetButton).toBeVisible();
        await expect(NextPageButton).toBeVisible();

        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(5);
      }
      break;
    case "Hazards":
      {
        // network test

        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        //Buttons
        const CreateButton = await page.getByRole("button", {
          name: "Create Hazard",
        });
        const FilterButton = await page.getByRole("button", { name: "Filter" });
        const ResetButton = await page.getByRole("button", { name: "Reset" });
        const NextPageButton = await page
          .locator(
            "div [class='flex justify-center !text-primary px-2 mt-4 rtl:flex-row-reverse']",
          )
          .locator("button")
          .last();

        await expect(CreateButton).toBeVisible();
        await expect(FilterButton).toBeVisible();
        await expect(ResetButton).toBeVisible();
        await expect(NextPageButton).toBeVisible();
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(5);
      }
      break;
    case "Consequences List":
      {
        // network test

        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        //Buttons
        const CreateButton = await page.getByRole("button", {
          name: "Add Consequence",
        });
        const FilterButton = await page.getByRole("button", { name: "Filter" });
        const ResetButton = await page.getByRole("button", { name: "Reset" });
        const NextPageButton = await page
          .locator(
            "div [class='flex justify-center !text-primary px-2 mt-4 rtl:flex-row-reverse']",
          )
          .locator("button")
          .last();

        await expect(CreateButton).toBeVisible();
        await expect(FilterButton).toBeVisible();
        await expect(ResetButton).toBeVisible();
        await expect(NextPageButton).toBeVisible();
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(4);
      }
      break;
    case "Causes List":
      {
        // network test

        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        //Buttons
        const CreateButton = await page.getByRole("button", {
          name: "Add Cause",
        });
        const FilterButton = await page.getByRole("button", { name: "Filter" });
        const ResetButton = await page.getByRole("button", { name: "Reset" });
        const NextPageButton = await page
          .locator(
            "div [class='flex justify-center !text-primary px-2 mt-4 rtl:flex-row-reverse']",
          )
          .locator("button")
          .last();

        await expect(CreateButton).toBeVisible();
        await expect(FilterButton).toBeVisible();
        await expect(ResetButton).toBeVisible();
        await expect(NextPageButton).toBeVisible();
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(5);
      }
      break;
    case "Classifications List":
      {
        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        //Buttons
        const CreateButton = await page.getByRole("button", {
          name: "Add Classification",
        });
        const FilterButton = await page.getByRole("button", { name: "Filter" });
        const ResetButton = await page.getByRole("button", { name: "Reset" });
        const NextPageButton = await page
          .locator(
            "div [class='flex justify-center !text-primary px-2 mt-4 rtl:flex-row-reverse']",
          )
          .locator("button")
          .last();

        await expect(CreateButton).toBeVisible();
        await expect(FilterButton).toBeVisible();
        await expect(ResetButton).toBeVisible();
        await expect(NextPageButton).toBeVisible();
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(4);
      }
      break;
    case "Sites":
      {
        // network test

        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        //Buttons
        const CreateButton = await page.getByRole("button", {
          name: "Create Site",
        });
        const FilterButton = await page.getByRole("button", { name: "Filter" });
        const ResetButton = await page.getByRole("button", { name: "Reset" });
        const NextPageButton = await page
          .locator(
            "div [class='flex justify-center !text-primary px-2 mt-4 rtl:flex-row-reverse']",
          )
          .locator("button")
          .last();

        await expect(CreateButton).toBeVisible();
        await expect(FilterButton).toBeVisible();
        await expect(ResetButton).toBeVisible();
        await expect(NextPageButton).toBeVisible();
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(5);
      }
      break;
    case "Asset Types List":
      {
        // network test

        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        //Buttons
        const CreateButton = await page.getByRole("button", {
          name: "Add Asset Type",
        });
        const FilterButton = await page.getByRole("button", { name: "Filter" });
        const ResetButton = await page.getByRole("button", { name: "Reset" });
        const NextPageButton = await page
          .locator(
            "div [class='flex justify-center !text-primary px-2 mt-4 rtl:flex-row-reverse']",
          )
          .locator("button")
          .last();

        await expect(CreateButton).toBeVisible();
        await expect(FilterButton).toBeVisible();
        await expect(ResetButton).toBeVisible();
        await expect(NextPageButton).toBeVisible();
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(4);
      }
      break;
    case "Assets List":
      {
        // network test

        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        //Buttons
        const CreateButton = await page.getByRole("button", {
          name: "Add Asset",
        });
        const FilterButton = await page.getByRole("button", { name: "Filter" });
        const ResetButton = await page.getByRole("button", { name: "Reset" });
        const NextPageButton = await page
          .locator(
            "div [class='flex justify-center !text-primary px-2 mt-4 rtl:flex-row-reverse']",
          )
          .locator("button")
          .last();

        await expect(CreateButton).toBeVisible();
        await expect(FilterButton).toBeVisible();
        await expect(ResetButton).toBeVisible();
        await expect(NextPageButton).toBeVisible();
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(7);
      }
      break;
    case "Severity Matrix":
      {
        // network test

        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        //Buttons
        const RiskRatingDefinitionsButton = await page.getByRole("button", {
          name: "Risk Rating Definitions",
        });
        const AddSeverityButtons = await page.getByRole("button", {
          name: "Add Severity",
        });
        const AddLikelihoodButtons = await page.getByRole("button", {
          name: "Add Likelihood",
        });

        const SaveButton = await page.getByTestId("save-button");

        await expect(RiskRatingDefinitionsButton).toBeVisible();
        await expect(AddSeverityButtons).toHaveCount(2);
        await expect(AddLikelihoodButtons).toHaveCount(2);
        await expect(SaveButton).toBeVisible();
        // Table
        const Table = await page.locator("table");
        expect(Table).toBeVisible();
      }
      break;
    case "Risk Rating Definitions":
      {
        // network test

        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        //Buttons
        const AddRatingTypeButton = await page.getByRole("button", {
          name: "Add Rating Type",
        });
        const SaveButton = await page.getByTestId("save-button");
        await expect(AddRatingTypeButton).toBeVisible();
        await expect(SaveButton).toBeVisible();
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(5);
      }
      break;
    case "Questions Library":
      {
        // network test

        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        // Buttons
        const AddQuestion = await page.getByRole("button", {
          name: "Add Question",
        });
        const NextPageButton = await page
          .locator(
            "div [class='flex justify-center !text-primary px-2 mt-4 rtl:flex-row-reverse']",
          )
          .locator("button")
          .last();
        await expect(AddQuestion).toBeVisible();
        await expect(NextPageButton).toBeVisible();
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(2);
      }
      break;
    case "Classification Reference":
      {
        await page
          .getByRole("button", { name: "Task Classifications" })
          .click();
        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        // Buttons
        const AddClassificationButton = page.getByRole("button", {
          name: "Add Classification",
        });
        const NextPageButton = await page
          .locator(
            "div [class='flex justify-center !text-primary px-2 mt-4 rtl:flex-row-reverse']",
          )
          .locator("button")
          .last();
        await expect(AddClassificationButton).toBeVisible();
        await expect(NextPageButton).toBeVisible();
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(5);
      }
      break;

    // Users Management Modules
    case "Users List":
      {
        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(7);
      }
      break;
    case "Groups List":
      {
        // network test

        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(4);
      }
      break;
    case "Roles":
      {
        // network test

        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(4);
      }
      break;
    // Settings Modules
    case "General Settings":
      {
        // network test

        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
      }
      break;
    case "Translation Manager":
      {
        // Table
        const Table = await page.locator("table");
        await expect(Table.locator("th").first()).toBeVisible();
        const ColumnsCount = await Table.locator("th").count();
        expect(ColumnsCount).toEqual(4);
      }
      break;
    case "Time & Date":
      {
        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
      }
      break;
    case "SMTP":
      {
        // header
        if (Role == "heading") {
          await expect(
            page.getByRole("heading", { name: PageName }),
          ).toBeVisible();
        } else if (Role == "paragraph") {
          await expect(
            page.getByRole("paragraph").filter({ hasText: PageName }),
          ).toBeVisible();
        }
      }
      break;
    default:
      break;
  }
};

const analyzeNetworkPerformance = async ({
  page,
  thresholds,
}: {
  page: any;
  thresholds?: {};
}) => {
  // 1. تأكد إن الصفحة حملت بالكامل عشان الأرقام تكون دقيقة
  await page.waitForLoadState("load");

  // 2. استخراج البيانات من المتصفح
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;

    // لو مفيش Navigation Entry (نادر الحدوث)
    if (!nav) return null;

    return {
      // وقت حل اسم الدومين
      dns: nav.domainLookupEnd - nav.domainLookupStart,

      // وقت إنشاء الاتصال (Handshake)
      tcp: nav.connectEnd - nav.connectStart,

      // الوقت حتى وصول أول بايت (أهم مقياس لكفاءة الباك إند)
      ttfb: nav.responseStart - nav.requestStart,

      // وقت تحميل المحتوى الفعلي (بيعتمد على سرعة النت وحجم الصفحة)
      download: nav.responseEnd - nav.responseStart,

      // الرحلة كاملة من أول ما داس لحد ما الصفحة جهزت
      totalDuration: nav.loadEventEnd - nav.startTime,

      // عشان نعرف لو الكاش مأثر على الأرقام
      transferSize: nav.transferSize,
    };
  });

  if (!metrics) {
    throw new Error("Could not retrieve navigation timing metrics.");
  }

  // 3. تطبيق الـ Thresholds (Assertions)
  // الديفولت قيم عالية عشان ميرسبش التيست إلا لو فيه كارثة، وتقدر تعدلها وأنت بتنادي الفنشكن
  const limits = {
    dns: 200, // Ideal < 50ms
    tcp: 300, // Ideal < 50ms
    ttfb: 1000, // Ideal < 200-500ms
    download: 2000,
    totalDuration: 8000,
    ...thresholds, // Override defaults
  };

  const violations = [];

  // مقارنة الأرقام الحقيقية بالحدود المسموحة
  if (metrics.dns > limits.dns)
    violations.push(
      `DNS latency too high: ${metrics.dns.toFixed(2)}ms (Limit: ${
        limits.dns
      }ms)`,
    );
  if (metrics.tcp > limits.tcp)
    violations.push(
      `TCP connection slow: ${metrics.tcp.toFixed(2)}ms (Limit: ${
        limits.tcp
      }ms)`,
    );
  if (metrics.ttfb > limits.ttfb)
    violations.push(
      `TTFB (Server Slow): ${metrics.ttfb.toFixed(2)}ms (Limit: ${
        limits.ttfb
      }ms)`,
    );
  if (metrics.download > limits.download)
    violations.push(
      `Content Download slow: ${metrics.download.toFixed(2)}ms (Limit: ${
        limits.download
      }ms)`,
    );

  // 4. إرجاع تقرير كامل
  return {
    success: violations.length === 0,
    metrics: metrics,
    violations: violations,
  };
};

export {
  readExcel,
  safeAction,
  CheckFilteredData,
  ChangeStatus,
  randomNumber,
  TableSearch,
  // validateRequiredField,
  validateLength,
  validateAllowedCharacters,
  validateSpecialCharacters,
  validateSecurityInputs,
  Reachability,
};
