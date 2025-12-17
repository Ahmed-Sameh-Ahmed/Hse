import { expect } from "@playwright/test";

const safeAction = async (action: () => Promise<any>) => {
  try {
    await action();
  } catch (err) {
    console.log("معلش حنكمل ", err);
  }
};

const CheckFilteredData = (result: [], expectedData: any) => {
  //حل عبقري
  expect(result).toEqual(Array(result.length).fill(expectedData));
};

const ChangeStatus = async ({ page, Row }: { page: any; Row: any }) => {
  await Row.locator(".self-center").click();
  await page.getByRole("button", { name: "OK" }).click();
  await page.waitForTimeout(3000);
};

export { safeAction, CheckFilteredData, ChangeStatus };
