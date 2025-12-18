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
    });
  }
};

const ChangeStatus = async ({ page, Row }: { page: any; Row: any }) => {
  await Row.locator(".self-center").click();
  await page.getByRole("button", { name: "OK" }).click();
  await page.waitForTimeout(3000);
};

const randomNumber = () => {
  return Math.floor(Math.random() * 99999999); // مثال: رقم لحد 8 digits
};

export { safeAction, CheckFilteredData, ChangeStatus, randomNumber };
