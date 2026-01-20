import { test as setup, expect } from "@playwright/test";
import Login from "../Pages/Login/Login";

setup("authenticate", async ({ page }) => {
  const loginPage = new Login();
  await loginPage.login(page, "admin@admin.com", "123456");

  // 1. استنى لحد ما تتأكد إن الـ URL اتغير لصفحة الـ Dashboard
  await page.waitForURL("**/home", { timeout: 30000 });

  // 2. (أهم خطوة) استنى عنصر معين "مبيظهرش غير بعد اللوجن"
  // مثلاً: لوجو البروفايل أو كلمة Dashboard أو المنيو
  await page.waitForSelector(".main-container", { state: "visible" });

  // 3. تأكيد إضافي: استنى ثانية كمان عشان نضمن إن التوكن اتكتب في الـ Storage
  await page.waitForTimeout(2000);

  // 4. احفظ الحالة دلوقتي
  await page.context().storageState({ path: "./user.json" });

  console.log("✅ الآن تم حفظ السيشن والتوكن بنجاح!");
});
