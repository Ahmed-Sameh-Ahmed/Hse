import { randomNumber, TableSearch } from "../../../utils/utils";

class Users {
  async GoToCreateUser({ page, expect }: { page: any; expect: any }) {
    await page.getByRole("button", { name: "Create User" }).click();
    await expect(page).toHaveURL("/users-management/users/create");
  }
  async CreateUser({
    page,
    expect,
    Data,
    Empty = false,
    Required,
    NotRandom,
  }: {
    page: any;
    expect: any;
    Data?: any;
    Empty?: boolean;
    Required: boolean;
    NotRandom?: boolean;
  }) {
    const uniqueNum = randomNumber();
    if (Empty) {
      await page.getByTestId("save-button").click();
      await expect(page.getByText("Name is required")).toBeVisible();
      await expect(
        page.getByText("This field is required").first(),
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(1),
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(2),
      ).toBeVisible();
      await expect(page.getByText("Email is required")).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(3),
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(4),
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(5),
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(6),
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(7),
      ).toBeVisible();
      await expect(
        page.getByText("At least one permission must"),
      ).toBeVisible();
      await expect(
        page.getByText("Password is required", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText("Confirm Password is required"),
      ).toBeVisible();
    } else {
      await page
        .getByTestId("name")
        .fill(NotRandom ? Data.fullname : Data.fullname + uniqueNum);
      await page.getByRole("textbox", { name: "Gender *" }).click();
      await page
        .getByRole("option", { name: Data.gender, exact: true })
        .click();
      // 1. اضغط على الـ input لفتح التقويم
      await page.getByTestId("date_of_birth").click();

      // 1. افتح التقويم
      const dateInput = page.getByTestId("date_of_birth");
      await dateInput.click();

      // 2. اختيار السنة (Flatpickr عادة بيستخدم input من نوع number للسنة)
      // بنعمل fill للسنة اللي محتاجينها
      await page
        .locator(".flatpickr-calendar.open .cur-year")
        .fill(Data.date_of_birth.year);
      await page.keyboard.press("Enter");

      // 3. اختيار الشهر (يكون عبارة عن select dropdown)
      // بنختار الشهر بالاسم أو بالترتيب (0 = January)
      await page
        .locator(".flatpickr-calendar.open .flatpickr-monthDropdown-months")
        .selectOption(Data.date_of_birth.month); // June مثلاً

      // 4. اختيار اليوم
      // بنستخدم filter عشان نضمن إننا بنختار اليوم "المتاح" مش يوم من الشهر اللي قبله أو اللي بعده
      await page
        .locator(".flatpickr-calendar.open .flatpickr-day")
        // 1. فلتر بالرقم بالضبط
        .filter({ hasText: Data.date_of_birth.day, exact: true })
        // 2. فلتر عشان تستبعد أيام الشهر اللي فات
        .filter({ hasNot: page.locator(".prevMonthDay") })
        // 3. فلتر عشان تستبعد أيام الشهر اللي جاي
        .filter({ hasNot: page.locator(".nextMonthDay") })
        .first()
        .click();

      await page.getByTestId("contact_number").fill(Data.contact_number);
      await page
        .getByTestId("email")
        .fill(NotRandom ? Data.email : Data.email + uniqueNum + "@face.com");
      if (!Required) {
        await page.getByTestId("avatar").setInputFiles(Data.image);
      }
      await page.getByTestId("employee_id").fill(Data.employee_id + uniqueNum);
      await page.getByRole("textbox", { name: "Employee Type *" }).click();
      await page.getByRole("option", { name: Data.employee_type }).click();

      await page.getByRole("textbox", { name: "Entity Type *" }).click();
      await page.getByRole("option", { name: Data.entity_type }).click();

      await page.getByRole("textbox", { name: "Position *" }).click();
      await page.getByRole("option", { name: Data.position }).click();

      if (!Required) {
        await page.getByTestId("company_number").fill(Data.company_number);

        await page.getByRole("textbox", { name: "Site" }).click();
        await page.getByRole("option", { name: Data.site }).click();

        await page.getByTestId("occupation").fill(Data.occupation);

        // 1. اضغط على الـ input لفتح التقويم
        await page.getByTestId("resignation_date").click();

        // 1. افتح التقويم
        const dateeInput = page.getByTestId("resignation_date");
        await dateeInput.click();

        // 2. اختيار السنة (Flatpickr عادة بيستخدم input من نوع number للسنة)
        // بنعمل fill للسنة اللي محتاجينها
        await page
          .locator(".flatpickr-calendar.open .cur-year")
          .fill(Data.resignation_date.year);
        await page.keyboard.press("Enter");

        // 3. اختيار الشهر (يكون عبارة عن select dropdown)
        // بنختار الشهر بالاسم أو بالترتيب (0 = January)
        await page
          .locator(".flatpickr-calendar.open .flatpickr-monthDropdown-months")
          .selectOption(Data.resignation_date.month); // June مثلاً

        // 4. اختيار اليوم
        // بنستخدم filter عشان نضمن إننا بنختار اليوم "المتاح" مش يوم من الشهر اللي قبله أو اللي بعده
        await page
          .locator(".flatpickr-calendar.open .flatpickr-day")
          // 1. فلتر بالرقم بالضبط
          .filter({ hasText: Data.resignation_date.day, exact: true })
          // 2. فلتر عشان تستبعد أيام الشهر اللي فات
          .filter({ hasNot: page.locator(".prevMonthDay") })
          // 3. فلتر عشان تستبعد أيام الشهر اللي جاي
          .filter({ hasNot: page.locator(".nextMonthDay") })
          .first()
          .click();
      }

      if (Data.is_hse_team) {
        const s = await page.getByTestId("is_hse_team").isChecked();
        if (!s) {
          await page.getByText("Is HSE Team Member").click();
        }

        await page.getByTestId("is_hse_team").check({ force: true });
      } else {
        const s = await page.getByTestId("is_hse_team").isChecked();
        if (s) {
          await page.getByText("Is HSE Team Member").click();
        }
      }

      await page.locator("#react-select-3-input").type(Data.report_to);
      await page
        .getByRole("option", { name: Data.report_to, exact: true })
        .click();

      if (!Required) {
        await page.locator("#react-select-5-input").fill(Data.escalate_to);
        await page
          .getByRole("option", { name: Data.escalate_to, exact: true })
          .click();
        await page
          .getByRole("textbox", { name: "Select Chronic Diseases/" })
          .click();
        for (const disease of Data.disabilities) {
          await page.getByRole("option", { name: disease }).click();
        }
      }
      await page.getByText("Chronic Diseases/Disabilities").click();
      await page.getByTestId("roles").click();
      for (const role of Data.roles) {
        await page.getByRole("option", { name: role }).click();
      }
      await page.getByTestId("password").fill(Data.password);
      await page.getByTestId("password_confirmation").fill(Data.password);
      await page.getByTestId("save-button").click();
      await page.getByRole("button", { name: "OK" }).click();
    }
  }
  async GoToShowUser({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: any;
  }) {
    const isFound = await TableSearch({
      page,
      Name: Data.Edit.before.fullname,
      Show: true,
      User: true,
    });
    if (!isFound) {
      //   const Userss = new Users();
      await this.GoToCreateUser({ page, expect });
      await this.CreateUser({
        page,
        expect,
        Data: Data.Edit.before,
        Required: false,
        NotRandom: true,
      });
      await this.GoToShowUser({ page, expect, Data });
    }
  }
  async ShowUser({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: any;
  }) {
    const FullName = page.locator("div .flex.items-start.gap-3").nth(0);
    const Email = page.locator("div .flex.items-start.gap-3").nth(1);
    const Contact_Number = page.locator("div .flex.items-start.gap-3").nth(2);
    const Gender = page.locator("div .flex.items-start.gap-3").nth(3);
    const Date_of_Birth = page.locator("div .flex.items-start.gap-3").nth(4);
    const Employee_ID = page.locator("div .flex.items-start.gap-3").nth(5);
    const Company_Number = page.locator("div .flex.items-start.gap-3").nth(6);
    const Occupation = page.locator("div .flex.items-start.gap-3").nth(7);
    const Entity_Type = page.locator("div .flex.items-start.gap-3").nth(8);
    const Employee_Type = page.locator("div .flex.items-start.gap-3").nth(9);
    const Site = page.locator("div .flex.items-start.gap-3").nth(10);
    const Position = page.locator("div .flex.items-start.gap-3").nth(11);
    const Report_To = page.locator("div .flex.items-start.gap-3").nth(12);
    const Escalate_To = page.locator("div .flex.items-start.gap-3").nth(13);
    const Roles = page.locator("div .flex.items-start.gap-3").nth(14);
    const Resignation_Date = page
      .locator("div .flex.items-start.gap-3")
      .nth(15);
    const Disabilities = page.locator("div .flex.items-start.gap-3").nth(16);

    await page.waitForLoadState("networkidle");

    await expect(
      FullName.locator("p", { hasText: Data.Edit.before.fullname }),
    ).toBeVisible();
    await expect(
      Email.locator("p", { hasText: Data.Edit.before.email }),
    ).toBeVisible();
    await expect(
      Contact_Number.locator("p", { hasText: Data.Edit.before.contact_number }),
    ).toBeVisible();
    await expect(
      Gender.locator("p", { hasText: Data.Edit.before.gender }),
    ).toBeVisible();

    // // 1. استخراج وتجهيز الداتا من الـ JSON
    // const year = Data.Edit.before.date_of_birth.year; // "1990"
    // // بما إن الشهر عندك بيبدأ من 0 (0 = يناير)، هنجمع عليه 1
    // const monthNum = Number(Data.Edit.before.date_of_birth.month) + 1;
    // // padStart بتخلي الرقم لو 1 يبقى "01" عشان يطابق الشكل في الـ UI
    // const month = String(monthNum).padStart(2, "0");
    // const day = String(Data.Edit.before.date_of_birth.day).padStart(2, "0"); // "01"
    // // 2. تجميع التاريخ بالشكل المعروض في صفحة الـ Show (YYYY/MM/DD)
    // const expectedDateString = `${year}/${month}/${day}`; // النتيجة هتكون "1990/01/01"
    // // 3. التأكد من وجوده في الصفحة
    // // بنستهدف العنصر اللي بيحتوي على التاريخ ده
    // await expect(
    //   Date_of_Birth.locator("p", { hasText: expectedDateString }),
    // ).toBeVisible();

    await expect(
      Employee_ID.locator("p", { hasText: Data.Edit.before.employee_id }),
    ).toBeVisible();
    await expect(
      Company_Number.locator("p", { hasText: Data.Edit.before.company_number }),
    ).toBeVisible();
    await expect(
      Occupation.locator("p", { hasText: Data.Edit.before.occupation }),
    ).toBeVisible();
    await expect(
      Entity_Type.locator("p", { hasText: Data.Edit.before.entity_type }),
    ).toBeVisible();
    await expect(
      Employee_Type.locator("p", { hasText: Data.Edit.before.employee_type }),
    ).toBeVisible();
    await expect(
      Site.locator("p", { hasText: Data.Edit.before.site }),
    ).toBeVisible();
    await expect(
      Position.locator("p", { hasText: Data.Edit.before.position }),
    ).toBeVisible();
    await expect(
      Report_To.locator("p", { hasText: Data.Edit.before.report_to }),
    ).toBeVisible();
    await expect(
      Escalate_To.locator("p", { hasText: Data.Edit.before.escalate_to }),
    ).toBeVisible();
    // await expect(
    //   Roles.locator("span", { hasText: Data.Edit.before.roles[0] }).first(),
    // ).toBeVisible();
    // await expect(
    //   Roles.locator("span", { hasText: Data.Edit.before.roles[1] }).nth(1),
    // ).toBeVisible();

    // 1. بنمسك كل الـ spans اللي موجودة جوه منطقة الأدوار ونخزنهم في مصفوفة
    const allSpans = await Roles.locator("span").all();
    // 2. بنلف على كل دور (Role) موجود في البيانات عندنا (المصفوفة الأولى)
    for (const roleName of Data.Edit.before.roles) {
      let isFound = false;
      // 3. بنلف على كل الـ spans اللي Playwright لقاهم في الصفحة (المصفوفة الثانية)
      for (const spanLocator of allSpans) {
        const text = await spanLocator.innerText();
        // بنقارن النص اللي في الصفحة بالنص اللي في الداتا
        if (text.trim() === roleName.trim()) {
          isFound = true;
          break; // لو لقاه، يخرج من اللوب الصغيرة ويدور على الدور اللي بعده
        }
      }
      // 4. بنعمل Assertion نتأكد إن الدور ده اتشاف في أي واحدة من الـ spans
      expect(isFound, `Role "${roleName}" was not found in any span!`).toBe(
        true,
      );
    }

    // 1. استخراج وتجهيز الداتا من الـ JSON
    const yearR = Data.Edit.before.resignation_date.year; // "1990"
    // بما إن الشهر عندك بيبدأ من 0 (0 = يناير)، هنجمع عليه 1
    const monthNumR = Number(Data.Edit.before.resignation_date.month) + 1;
    // padStart بتخلي الرقم لو 1 يبقى "01" عشان يطابق الشكل في الـ UI
    const monthR = String(monthNumR).padStart(2, "0");
    const dayR = String(Data.Edit.before.resignation_date.day).padStart(2, "0"); // "01"
    // 2. تجميع التاريخ بالشكل المعروض في صفحة الـ Show (YYYY/MM/DD)
    const expectedDateStringR = `${yearR}/${monthR}/${dayR}`; // النتيجة هتكون "1990/01/01"
    // 3. التأكد من وجوده في الصفحة
    // بنستهدف العنصر اللي بيحتوي على التاريخ ده
    await expect(
      Resignation_Date.locator("p", { hasText: expectedDateStringR }),
    ).toBeVisible();

    // 1. بنمسك كل الـ spans اللي موجودة جوه منطقة الأدوار ونخزنهم في مصفوفة
    const allDisabilities = await Disabilities.locator("span").all();
    // 2. بنلف على كل دور (Role) موجود في البيانات عندنا (المصفوفة الأولى)
    for (const Disability of Data.Edit.before.disabilities) {
      let isFound = false;
      // 3. بنلف على كل الـ spans اللي Playwright لقاهم في الصفحة (المصفوفة الثانية)
      for (const spanLocator of allDisabilities) {
        const text = await spanLocator.innerText();
        // بنقارن النص اللي في الصفحة بالنص اللي في الداتا
        if (text.trim() === Disability.trim()) {
          isFound = true;
          break; // لو لقاه، يخرج من اللوب الصغيرة ويدور على الدور اللي بعده
        }
      }
    }
  }
  async GoToEditUser({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: any;
  }) {
    const isFound = await TableSearch({
      page,
      Name: Data.Edit.before.fullname,
      Edit: true,
      User: true,
    });
    if (!isFound) {
      //   const Userss = new Users();
      await this.GoToCreateUser({ page, expect });
      await this.CreateUser({
        page,
        expect,
        Data: Data.Edit.before,
        Required: false,
        NotRandom: true,
      });
      await this.GoToEditUser({ page, expect, Data });
    }
  }
  async EditUser({
    page,
    expect,
    DataBefore,
    DataAfter,
  }: {
    page: any;
    expect: any;
    DataBefore: any;
    DataAfter: any;
  }) {
    await expect(page.getByTestId("name")).toHaveValue(DataBefore.fullname);
    await expect(page.locator("#gender")).toHaveValue(DataBefore.gender);
    // await expect(page.getByTestId("date_of_birth")).toHaveValue(
    //   DataBefore.date_of_birth,
    // );
    await expect(page.locator("#contact_number")).toHaveValue(
      DataBefore.contact_number,
    );

    // بيحتوي علي كلمه معينه ولا لا  RegExp
    await expect(page.locator("#email")).toHaveValue(
      new RegExp(DataBefore.email),
    );

    // بيحتوي علي كلمه معينه ولا لا  RegExp
    await expect(page.getByTestId("employee_id")).toHaveValue(
      new RegExp(DataBefore.employee_id),
    );
    await expect(page.locator("#employee_type")).toHaveValue(
      DataBefore.employee_type,
    );
    await expect(page.locator("#entity_type")).toHaveValue(
      DataBefore.entity_type,
    );
    await expect(await page.locator("#position\\.id")).toHaveValue(
      DataBefore.position,
    );
    await expect(page.locator("#company_number")).toHaveValue(
      DataBefore.company_number,
    );
    await expect(await page.locator("#site\\.id")).toHaveValue(DataBefore.site);
    await expect(page.locator("#occupation")).toHaveValue(
      DataBefore.occupation,
    );

    // 1. استخراج البيانات من الـ Object
    const { day, month, year } = DataBefore.resignation_date;
    // 2. تحويل الشهر ليصبح رقمين (مثلاً من "0" إلى "01")
    const formattedMonth = (parseInt(month) + 1).toString().padStart(2, "0");
    const formattedDay = day.padStart(2, "0");
    // 3. تركيب النص النهائي بنفس شكل الموقع (YYYY/MM/DD)
    const expectedDateString = `${year}/${formattedMonth}/${formattedDay}`;

    const DateLocator = page.getByTestId("resignation_date");
    const DateValue = await DateLocator.inputValue();
    await expect(DateValue).toEqual(expectedDateString);

    if (DataBefore.is_hse_team) {
      await expect(page.locator("#is_hse_team")).toBeChecked();
    } else {
      await expect(page.locator("#is_hse_team")).not.toBeChecked();
    }
    // Reporting to

    await expect(page.locator("div .mb-3").nth(16)).toContainText(
      DataBefore.report_to,
    );

    // Escalate to
    await expect(page.locator("div .mb-3").nth(17)).toContainText(
      DataBefore.escalate_to,
    );

    // 1. تحديد الحاوية (استخدمنا last() بناءً على هيكلة صفحتك)
    const disabilitiesContainer = page.locator("div.md\\:col-span-2").last();

    // 2. جلب كل نصوص الـ spans مرة واحدة
    const uiDisabilities = await disabilitiesContainer
      .locator("span")
      .allInnerTexts();

    // 3. تنظيف البيانات ومسح التكرار (Unique Values)
    // استخدمنا Set لأن الـ UI عندك بيقرأ كل كلمة مرتين
    const cleanedUiData = [
      ...new Set(
        uiDisabilities
          .map((text: string) => text.trim())
          .filter((text: string) => text !== ""),
      ),
    ];

    const expectedData = [
      ...new Set(DataBefore.disabilities.map((d: string) => d.trim())),
    ];

    // 4. المقارنة النهائية بعد الترتيب لضمان مطابقة المحتوى بغض النظر عن أماكنهم
    expect(cleanedUiData.sort()).toEqual(expectedData.sort());
    // ____________________________________________________________________________________________________________________________________-
    // 1. مسك الحاوية الأب
    const rolesContainer = page
      .locator('div[style*="--mantine-spacing-md"]')
      .first();

    // 2. جلب كل النصوص من عناصر الـ p اللي جواها مرة واحدة في Array
    // دالة allInnerTexts() بتوفر عليك اللوب وبتجيبلك النصوص كلها كـ Array of strings
    const uiRoles = await rolesContainer.locator("p").allInnerTexts();

    // 3. تنظيف النصوص (لو فيه مسافات زيادة)
    const cleanedUiRoles = uiRoles.map((text: string) => text.trim());
    const expectedRoles = DataBefore.roles.map((role: string) => role.trim());

    // 4. المقارنة النهائية (العدد والمحتوى بالظبط)
    // toEqual بتقارن المصفوفات ببعضها من حيث العناصر والترتيب والعدد
    expect(cleanedUiRoles.sort()).toEqual(expectedRoles.sort());

    // مسح البيانات القديمه
    const clearGender = await page.locator(".mantine-focus-auto").first();
    const clearimage = await page.locator(".cursor-pointer.shrink-0");
    const clearEmployeeType = await page.locator(".mantine-focus-auto");
    const clearEntityType = await page.locator(".mantine-focus-auto");
    const clearPosition = await page.locator(".mantine-focus-auto");
    const clearSite = await page.locator(".mantine-focus-auto");
    const clearDisabilities = await page
      .getByText("Chronic Diseases/DisabilitiesDiabetes")
      .locator('div[data-position="right"]');
    const clearReportingTo = await page
      .getByText("Reporting & Health InformationReporting To ")
      .locator("svg")
      .nth(0);
    const clearEscalateTo = await await page
      .getByText("Reporting & Health InformationReporting To ")
      .locator("svg")
      .nth(1);

    const clearRoles = await page
      .locator('div[style*="display: flex"][style*="flex-wrap: wrap"]')
      .locator("svg");

    await page.getByTestId("name").clear();
    await clearGender.click();
    // await page.getByTestId("date_of_birth").clear();
    await page.getByTestId("contact_number").clear();
    await page.getByTestId("email").clear();
    await clearimage.click();
    await page.getByTestId("employee_id").clear();
    await clearEmployeeType.first().click();
    await clearEntityType.first().click();
    await clearPosition.first().click();
    await page.getByTestId("company_number").clear();
    await clearSite.first().click();
    await page.getByTestId("occupation").clear();
    // await page.getByTestId("resignation_date").clear();
    await clearReportingTo.click();
    await clearEscalateTo.click();
    await clearDisabilities.click();

    while ((await clearRoles.count()) > 0) {
      // دايماً بنضغط على أول عنصر متاح (index 0)
      // لأن بعد كل مسحة، العناصر الباقية بتترتب تاني
      await clearRoles.first().click();

      // اختيارياً: ممكن تنتظر لحظة بسيطة لو المسح فيه Animation عشان ميحصلش Error
      // await page.waitForTimeout(300);
    }

    // تعديل البيانات
    const uniqueNum = randomNumber();
    await page.getByTestId("name").fill(DataAfter.fullname + uniqueNum);
    await page.getByRole("textbox", { name: "Gender *" }).click();
    await page
      .getByRole("option", { name: DataAfter.gender, exact: true })
      .click();
    // 1. اضغط على الـ input لفتح التقويم
    await page.getByTestId("date_of_birth").click();

    // 1. افتح التقويم
    const dateInput = page.getByTestId("date_of_birth");
    await dateInput.click();

    // 2. اختيار السنة (Flatpickr عادة بيستخدم input من نوع number للسنة)
    // بنعمل fill للسنة اللي محتاجينها
    await page
      .locator(".flatpickr-calendar.open .cur-year")
      .fill(DataAfter.date_of_birth.year);
    await page.keyboard.press("Enter");

    // 3. اختيار الشهر (يكون عبارة عن select dropdown)
    // بنختار الشهر بالاسم أو بالترتيب (0 = January)
    await page
      .locator(".flatpickr-calendar.open .flatpickr-monthDropdown-months")
      .selectOption(DataAfter.date_of_birth.month); // June مثلاً

    // 4. اختيار اليوم
    // بنستخدم filter عشان نضمن إننا بنختار اليوم "المتاح" مش يوم من الشهر اللي قبله أو اللي بعده
    await page
      .locator(".flatpickr-calendar.open .flatpickr-day")
      // 1. فلتر بالرقم بالضبط
      .filter({ hasText: DataAfter.date_of_birth.day, exact: true })
      // 2. فلتر عشان تستبعد أيام الشهر اللي فات
      .filter({ hasNot: page.locator(".prevMonthDay") })
      // 3. فلتر عشان تستبعد أيام الشهر اللي جاي
      .filter({ hasNot: page.locator(".nextMonthDay") })
      .first()
      .click();

    await page.getByTestId("contact_number").fill(DataAfter.contact_number);
    await page
      .getByTestId("email")
      .fill(DataAfter.email + uniqueNum + "@face.com");
    await page.getByTestId("avatar").setInputFiles(DataAfter.image);

    await page
      .getByTestId("employee_id")
      .fill(DataAfter.employee_id + uniqueNum);
    await page.getByRole("textbox", { name: "Employee Type *" }).click();
    await page.getByRole("option", { name: DataAfter.employee_type }).click();

    await page.getByRole("textbox", { name: "Entity Type *" }).click();
    await page.getByRole("option", { name: DataAfter.entity_type }).click();

    await page.getByRole("textbox", { name: "Position *" }).click();
    await page
      .getByRole("option", { name: DataAfter.position, exact: true })
      .click();
    await page.getByTestId("company_number").fill(DataAfter.company_number);

    await page.getByRole("textbox", { name: "Site" }).click();
    await page.getByRole("option", { name: DataAfter.site }).click();

    await page.getByTestId("occupation").fill(DataAfter.occupation);

    // 1. اضغط على الـ input لفتح التقويم
    await page.getByTestId("resignation_date").click();

    // 1. افتح التقويم
    const dateeInput = page.getByTestId("resignation_date");
    await dateeInput.click();

    // 2. اختيار السنة (Flatpickr عادة بيستخدم input من نوع number للسنة)
    // بنعمل fill للسنة اللي محتاجينها
    await page
      .locator(".flatpickr-calendar.open .cur-year")
      .fill(DataAfter.resignation_date.year);
    await page.keyboard.press("Enter");

    // 3. اختيار الشهر (يكون عبارة عن select dropdown)
    // بنختار الشهر بالاسم أو بالترتيب (0 = January)
    await page
      .locator(".flatpickr-calendar.open .flatpickr-monthDropdown-months")
      .selectOption(DataAfter.resignation_date.month); // June مثلاً

    // 4. اختيار اليوم
    // بنستخدم filter عشان نضمن إننا بنختار اليوم "المتاح" مش يوم من الشهر اللي قبله أو اللي بعده
    await page
      .locator(".flatpickr-calendar.open .flatpickr-day")
      // 1. فلتر بالرقم بالضبط
      .filter({ hasText: DataAfter.resignation_date.day, exact: true })
      // 2. فلتر عشان تستبعد أيام الشهر اللي فات
      .filter({ hasNot: page.locator(".prevMonthDay") })
      // 3. فلتر عشان تستبعد أيام الشهر اللي جاي
      .filter({ hasNot: page.locator(".nextMonthDay") })
      .first()
      .click();

    if (DataAfter.is_hse_team) {
      const s = await page.getByTestId("is_hse_team").isChecked();
      if (!s) {
        await page.getByText("Is HSE Team Member").click();
      }

      await page.getByTestId("is_hse_team").check({ force: true });
    } else {
      const s = await page.getByTestId("is_hse_team").isChecked();
      if (s) {
        await page.getByText("Is HSE Team Member").click();
      }
    }

    await page.locator("#react-select-3-input").type(DataAfter.report_to);
    await page
      .getByRole("option", { name: DataAfter.report_to, exact: true })
      .click();

    await page.locator("#react-select-5-input").fill(DataAfter.escalate_to);
    await page
      .getByRole("option", { name: DataAfter.escalate_to, exact: true })
      .click();
    await page
      .getByRole("textbox", { name: "Select Chronic Diseases/" })
      .click();
    for (const disease of DataAfter.disabilities) {
      await page.getByRole("option", { name: disease }).click();
    }
    await page.getByText("Chronic Diseases/Disabilities").click();

    await page.getByTestId("roles").click();
    for (const role of DataAfter.roles) {
      await page.getByRole("option", { name: role }).click();
    }
    await page.getByTestId("edit-button").click();
    await page.getByRole("button", { name: "OK" }).click();
  }

  async GoToChangeUserPassword({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: any;
  }) {
    // Implementation for going to change user password
    const isFound = await TableSearch({
      Name: Data.Edit.before.fullname,
      page,
      password: true,
      User: true,
    });

    if (!isFound) {
      await this.GoToCreateUser({ page, expect });
      await this.CreateUser({
        page,
        expect,
        Data: Data,
        Required: false,
        NotRandom: true,
      });

      await this.GoToChangeUserPassword({ page, expect, Data });
    }
  }
  async ChangeUserPassword({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: any;
  }) {
    await page.getByTestId("password").fill(Data.Edit.before.password);
    await page
      .getByTestId("password_confirmation")
      .fill(Data.Edit.before.password);
    await page.getByTestId("save-button").click();
    await page.waitForTimeout(3000);
  }

  async ExecuteFullUserFlow({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: any;
  }) {
    // 1. توليد الرقم العشوائي مرة واحدة فقط للعملية كلها
    const sharedUniqueNum = randomNumber();

    // 2. تجهيز كائن (Object) جديد فيه البيانات النهائية "المطبوخة"
    const finalData = {
      ...Data,
      Edit: {
        before: {
          ...Data.Edit.before,
          fullname: Data.Edit.before.fullname + sharedUniqueNum,
          email: Data.Edit.before.email + sharedUniqueNum + "@face.com",
          employee_id: Data.Edit.before.employee_id + sharedUniqueNum,
        },
        after: {
          ...Data.Edit.after,
          // لو عاوز الـ Edit يغير الاسم لاسم جديد خالص برقم جديد ممكن تعمل randomNumber تاني هنا
          fullname: Data.Edit.after.fullname + randomNumber(),
          email: Data.Edit.after.email,
          employee_id: Data.Edit.after.employee_id + randomNumber(),
        },
      },
    };

    const targetUser = finalData.Edit.before.fullname;
    console.log(`🛠️ Starting Flow for User: ${targetUser}`);

    // --- المرحلة 1: Create ---
    await this.GoToCreateUser({ page, expect });
    await this.CreateUser({
      page,
      expect,
      Data: finalData.Edit.before,
      Required: false,
      NotRandom: true, // بنقوله متضيفش أرقام من عندك، أنا بعتلك الداتا جاهزة
    });

    // --- المرحلة 2: Show ---
    // بنبحث بالاسم اللي إحنا لسه مألفينه فوق
    await TableSearch({ page, Name: targetUser, Show: true, User: true });
    await this.ShowUser({ page, expect, Data: finalData });

    // ارجع للجدول عشان الخطوة اللي بعدها
    await page.goto("/users-management/users");

    // --- المرحلة 3: Change Password ---
    // لاحظ: بعد الـ Edit الاسم اتغير لـ finalData.Edit.after.fullname
    await TableSearch({
      page,
      Name: finalData.Edit.before.fullname,
      password: true,
      User: true,
    });
    await this.ChangeUserPassword({ page, expect, Data: finalData });

    console.log(`✅ All operations done for: ${targetUser}`);

    // --- المرحلة 4: Edit ---
    await TableSearch({ page, Name: targetUser, Edit: true, User: true });
    await this.EditUser({
      page,
      expect,
      DataBefore: finalData.Edit.before,
      DataAfter: finalData.Edit.after,
    });
  }
}
export default Users;
