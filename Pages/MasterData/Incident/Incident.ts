import { randomNumber, TableSearch } from "../../../utils/utils";

class Incident {
  async createIncident({
    page,
    expect,
    Data,
    NotRandom,
  }: {
    page: any;
    expect: any;
    Data: any;
    NotRandom: boolean;
  }) {
    const RandomNum = randomNumber();
    await page.getByRole("button", { name: "Add Incident" }).click();
    await expect(
      page.getByRole("heading", { name: "Add Incident" }),
    ).toBeVisible();
    await page
      .getByTestId("title")
      .fill(NotRandom ? Data.incident.title : Data.incident.title + RandomNum);
    await page.getByRole("textbox", { name: "Shift *" }).click();
    await page.getByRole("option", { name: Data.incident.Shift }).click();

    // 1. اضغط على الـ input لفتح التقويم
    await page.getByTestId("incident_datetime").click();

    // 1. افتح التقويم
    const dateInput = page.getByTestId("incident_datetime");
    await dateInput.click();

    // 2. اختيار السنة (Flatpickr عادة بيستخدم input من نوع number للسنة)
    // بنعمل fill للسنة اللي محتاجينها
    await page
      .locator(".flatpickr-calendar.open .cur-year")
      .fill(Data.incident.incident_datetime.year);
    await page.keyboard.press("Enter");

    // 3. اختيار الشهر (يكون عبارة عن select dropdown)
    // بنختار الشهر بالاسم أو بالترتيب (0 = January)
    await page
      .locator(".flatpickr-calendar.open .flatpickr-monthDropdown-months")
      .selectOption(Data.incident.incident_datetime.month); // June مثلاً

    // 4. اختيار اليوم
    // بنستخدم filter عشان نضمن إننا بنختار اليوم "المتاح" مش يوم من الشهر اللي قبله أو اللي بعده
    await page
      .locator(".flatpickr-calendar.open .flatpickr-day")
      // 1. فلتر بالرقم بالضبط
      .filter({ hasText: Data.incident.incident_datetime.day })
      // 2. فلتر عشان تستبعد أيام الشهر اللي فات
      .filter({ hasNot: page.locator(".prevMonthDay") })
      // 3. فلتر عشان تستبعد أيام الشهر اللي جاي
      .filter({ hasNot: page.locator(".nextMonthDay") })
      .first()
      .click();
    await page
      .getByRole("spinbutton", { name: "Hour" })
      .fill(Data.incident.incident_datetime.hour);
    const inputMinutee = await page.getByRole("spinbutton", { name: "Minute" });

    inputMinutee.click();
    await page.keyboard.press("Control+A"); // تحديد الكل لمسح الـ 0 الموجود
    await page.keyboard.press("Backspace");
    await inputMinutee.pressSequentially(
      Data.incident.incident_datetime.minute,
      {
        delay: 100,
      },
    );
    // .fill(Data.incident.incident_datetime.minute);

    // 1. اضغط على الـ input لفتح التقويم
    await page.getByTestId("reported_at").click();

    // 1. افتح التقويم
    const dateeInput = page.getByTestId("reported_at");
    await dateeInput.click();

    // 2. اختيار السنة (Flatpickr عادة بيستخدم input من نوع number للسنة)
    // بنعمل fill للسنة اللي محتاجينها
    await page
      .locator(".flatpickr-calendar.open .cur-year")
      .fill(Data.incident.reported_at.year);
    await page.keyboard.press("Enter");

    // 3. اختيار الشهر (يكون عبارة عن select dropdown)
    // بنختار الشهر بالاسم أو بالترتيب (0 = January)
    await page
      .locator(".flatpickr-calendar.open .flatpickr-monthDropdown-months")
      .selectOption(Data.incident.reported_at.month); // June مثلاً

    // 4. اختيار اليوم
    // بنستخدم filter عشان نضمن إننا بنختار اليوم "المتاح" مش يوم من الشهر اللي قبله أو اللي بعده
    await page
      .locator(".flatpickr-calendar.open .flatpickr-day")
      // 1. فلتر بالرقم بالضبط
      .filter({ hasText: Data.incident.reported_at.day, exact: true })
      // 2. فلتر عشان تستبعد أيام الشهر اللي فات
      .filter({ hasNot: page.locator(".prevMonthDay") })
      // 3. فلتر عشان تستبعد أيام الشهر اللي جاي
      .filter({ hasNot: page.locator(".nextMonthDay") })
      .first()
      .click();

    await page
      .getByRole("spinbutton", { name: "Hour" })
      .fill(Data.incident.reported_at.hour);
    const inputMinute = await page.getByRole("spinbutton", { name: "Minute" });
    inputMinute.click();
    await page.keyboard.press("Control+A"); // تحديد الكل لمسح الـ 0 الموجود
    await page.keyboard.press("Backspace");
    await inputMinute.pressSequentially(Data.incident.reported_at.minute, {
      delay: 100,
    });
    // .fill(Data.incident.reported_at.minute);
    await page.getByRole("button", { name: "Save" }).click();
  }
  async EditIncident({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: any;
  }) {
    const Found = TableSearch({
      page,
      Name: Data.incident.title,
      Edit: true,
    });
    if (!Found) {
      this.createIncident({ page, expect, Data, NotRandom: true });
      this.EditIncident({ page, expect, Data });
    }
    await expect(page.getByTestId("initial_information.title")).toHaveValue(
      Data.incident.title,
    );
    await expect(page.getByRole("textbox", { name: "Shift" })).toHaveValue(
      Data.incident.Shift,
    );
    // await expect(
    //   page.getByTestId(
    //     "initial_information.time_information.incident_datetime",
    //   ),
    // ).toHaveValue(Data.incident.incident_datetime);
    await expect(
      page.getByTestId("initial_information.time_information.reported_by.name"),
    ).toHaveValue(Data.incident.reported_by);
    await page.getByRole("textbox", { name: "Location" }).click();
    await page.getByRole("option", Data.incident.Location).click();
    await page.getByRole("textbox", { name: "Site" }).click();
    await page.getByRole("option", Data.incident.site).click();
    await page.getByRole("textbox", { name: "Division / Department" }).click();
    await page.getByRole("option", { name: Data.incident.department }).click();

    await page
      .getByTestId("initial_information.initial_description")
      .fill(Data.incident.initial_description);

    await page.getByRole("button", { name: "Add Attachment" }).click();
    await expect(page.getByText("Attachments & Links")).toBeVisible();
    await page.locator('input[type="file"]').setInputFiles(Data.incident.image);
    await page.getByRole("tab", { name: "Links" }).click();
    for (let i = 0; i < Data.incident.links.length; i++) {
      await page
        .getByRole("textbox", { name: "Link title" })
        .fill(Data.incident.links.title[i]);
      await page
        .getByRole("textbox", { name: "URL" })
        .fill(Data.incident.links.url[i]);
      await page.getByRole("button", { name: "Add Link" }).click();
      await page
        .getByLabel("Attachments & Links")
        .getByRole("button", { name: "Save" })
        .click();
      await page.getByRole("textbox", { name: "Consequences" }).click();
      for (let i = 0; i < Data.incident.consequences.length; i++) {
        await page
          .getByRole("option", { name: Data.incident.consequences[i] })
          .click();
      }
      await page.getByRole("textbox", { name: "Consequences" }).click();
      await page.getByRole("button", { name: "Add", exact: true }).click();
    }
  }
}

export default Incident;
