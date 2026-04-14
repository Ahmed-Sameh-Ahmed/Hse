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
        .fill(Data.email + uniqueNum + "@face.com");
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
      this.GoToShowUser({ page, expect, Data });
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
    const FullName = page.locator("div .flex.items-start.gap-3 ").nth(0);
    const Email = page.locator("div .flex.items-start.gap-3 ").nth(1);
    const Contact_Number = page.locator("div .flex.items-start.gap-3 ").nth(2);
    const Gender = page.locator("div .flex.items-start.gap-3 ").nth(3);
    const Date_of_Birth = page.locator("div .flex.items-start.gap-3 ").nth(4);
    const Employee_ID = page.locator("div .flex.items-start.gap-3 ").nth(5);
    const Company_Number = page.locator("div .flex.items-start.gap-3 ").nth(6);
    const Occupation = page.locator("div .flex.items-start.gap-3 ").nth(7);
    const Entity_Type = page.locator("div .flex.items-start.gap-3 ").nth(8);
    const Employee_Type = page.locator("div .flex.items-start.gap-3 ").nth(9);
    const Site = page.locator("div .flex.items-start.gap-3 ").nth(10);
    const Position = page.locator("div .flex.items-start.gap-3 ").nth(11);
    const Report_To = page.locator("div .flex.items-start.gap-3 ").nth(12);
    const Escalate_To = page.locator("div .flex.items-start.gap-3 ").nth(13);
    const Roles = page.locator("div .flex.items-start.gap-3 ").nth(14);
    const Resignation_Date = page
      .locator("div .flex.items-start.gap-3 ")
      .nth(15);
    const Disabilities = page.locator("div .flex.items-start.gap-3 ").nth(16);

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
      this.GoToEditUser({ page, expect, Data });
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
    // await expect(page.locator("#resignation_date")).toHaveValue(DataBefore.resignation_date);

    if (DataBefore.is_hse_team) {
      await expect(page.locator("#is_hse_team")).toBeChecked();
    } else {
      await expect(page.locator("#is_hse_team")).not.toBeChecked();
    }
    // Reporting to
    await expect(page.locator("div .mb-3").nth(16)).toHaveText(
      DataBefore.report_to,
    );
    // Escalate to
    await expect(page.locator("div .mb-3").nth(17)).toHaveText(
      DataBefore.escalate_to,
    );

    // 1. امسك الحاوية اللي فيها الأمراض المزمنة
    const disabilitiesContainer = page.locator("div.md\\:col-span-2").last();
    // 2. هات كل الـ spans اللي موجودة جوه الحاوية دي في مصفوفة
    const allSpans = await disabilitiesContainer.locator("span").all();
    // 3. ابدأ اللوب الكبيرة على الداتا اللي عندك (Array)
    for (const disease of DataBefore.disabilities) {
      let found = false;
      // 4. ابدأ اللوب الصغيرة: لف على كل span موجود في الـ UI حالياً
      for (const span of allSpans) {
        const text = await span.innerText();
        // قارن النص اللي في الـ UI باللي في الداتا
        if (text.trim() === disease.trim()) {
          found = true;
          break; // لو لقاه، اخرج من اللوب الصغيرة وادخل على المرض اللي بعده
        }
      }
      // 5. تأكد إن المرض ده اتوجد في أي span من اللي لفينا عليهم
      expect(found, `المرض "${disease}" مش موجود في أي span على الشاشة!`).toBe(
        true,
      );
    }
  }
}

export default Users;
