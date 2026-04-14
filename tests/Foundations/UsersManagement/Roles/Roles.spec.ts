import { test, expect } from '@playwright/test';

import Home from "../../../../Pages/Home/Home"

test('E2E: Admin modifies permissions and User verifies', async ({ browser }, testInfo) => {

  // ==========================================
  // 1. إنشاء بيئتين منعزلتين (Contexts)
  // ==========================================
  const adminContext = await browser.newContext();
  const userContext = await browser.newContext();

  const adminPage = await adminContext.newPage();
  const userPage = await userContext.newPage();

  // ==========================================
  // دالة مساعدة (Helper) لليوزر عشان يعمل Log out / Log in بسرعة
  // ==========================================
  async function reloginUser({ fristTime }: { fristTime: boolean }) {

    if (fristTime) {
      await userPage.goto('/login');
      await userPage.fill('input[name="email"]', 'test1@face.com');
      await userPage.fill('input[name="password"]', '123456789');
      await userPage.getByRole('button', { name: 'Sign In' }).click(); // للتأكد إن الحقل متفاعل
      await userPage.waitForURL('/home');
    } else {
      await userPage.goto('/dashboard');
      // افتراض إن فيه زرار خروج
      await userPage.locator('button[type="button"].relative.group.block').click();
      await userPage.getByRole('button', { name: 'Sign Out' }).click();


      // تسجيل الدخول من جديد لجلب الـ Token والصلاحيات الجديدة
      await userPage.goto('/login');
      await userPage.fill('input[name="email"]', 'test1@face.com');
      await userPage.fill('input[name="password"]', '123456789');
      await userPage.getByRole('button', { name: 'Sign In' }).click(); // للتأكد إن الحقل متفاعل
      await userPage.waitForURL('/home');
    }


  }

  // ==========================================
  // 2. بداية السيناريو الفعلي باستخدام test.step
  // ==========================================

  await test.step('Admin logs in', async () => {
    await adminPage.goto('/login');
    await adminPage.fill('input[name="email"]', 'admin@admin.com');
    await adminPage.fill('input[name="password"]', '123456');
    await adminPage.getByRole('button', { name: 'Sign In' }).click(); // للتأكد إن الحقل متفاعل
    await adminPage.waitForLoadState('networkidle');

  });

  //   await test.step('User logs in initially and checks lack of permission', async () => {
  //     await reloginUser();
  //     // اليوزر لسه معندوش صلاحية إدارة المستخدمين، فالمفروض المنيو تكون مخفية
  //     await expect(userPage.locator('text=Users Management')).toBeHidden();
  //   });

  await test.step('Admin GRANTS permission to User "list asset"', async () => {
    await adminPage.goto('/users-management/roles/3/edit');
    // الأدمن بيعلم على الـ Checkbox بتاع الصلاحية ويدوس حفظ

    await adminPage.waitForLoadState('networkidle');
    await adminPage.getByText('List Asset', { exact: true }).click(); // للتأكد إنه يضغط على النص مش على الـ Checkbox نفسه
    await adminPage.getByTestId('edit-button').click();
    // await expect(adminPage.locator('text=Saved Successfully')).toBeVisible();
  });

  await test.step('User re-logs in and VERIFIES granted permission "list asset"', async () => {
    // اليوزر بيعمل خروج ودخول عشان السيرفر يبعتله الـ JSON الجديد
    await reloginUser({ fristTime: true });
    await userPage.getByRole('link', { name: 'Incidents Management' }).click();
    await adminPage.waitForLoadState('networkidle');

    // دلوقتي المنيو لازم تكون ظهرت!
    const screenshot = await userPage.screenshot();
    await testInfo.attach('Incidents Management => Assets list', {
      body: screenshot,
      contentType: 'image/png',
    });
    await userPage.getByRole('link', { name: 'Assets' }).click(); // للتأكد إنه يقدر يدخل الصفحة

    await userPage.goto("/incidents-management/assets")
    await expect(userPage).toHaveURL('/incidents-management/assets');


    // await expect(userPage.locator('text=Users Management')).toBeVisible();

    // // يتأكد إنه يقدر يدخل الصفحة فعلاً والـ API مش هيرفضه
    // await userPage.click('text=Users Management');
    // await expect(userPage).toHaveURL('**/users-management');
  });

  //   await test.step('Admin REVOKES permission from User', async () => {
  //     await adminPage.goto('/users-management/testuser');
  //     // الأدمن بيلغي الصلاحية ويدوس حفظ
  //     await adminPage.uncheck('input[name="permission_manage_users"]');
  //     await adminPage.click('text=Save Permissions');
  //   });

  //   await test.step('User re-logs in and VERIFIES revoked permission', async () => {
  //     await reloginUser();
  //     // المنيو لازم تختفي تاني
  //     await expect(userPage.locator('text=Users Management')).toBeHidden();

  //     // لو حاول يكتب اللينك بإيده (Security Check) المفروض يترد بـ 403 أو يرجع للداشبورد
  //     await userPage.goto('/users-management');
  //     await expect(userPage.locator('text=Access Denied')).toBeVisible(); 
  //   });

  // ==========================================
  // 3. إغلاق المتصفحات لتنظيف الميموري
  // ==========================================
  await adminContext.close();
  await userContext.close();
});