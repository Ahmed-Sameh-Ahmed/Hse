import test from "@playwright/test";
import { readExcel } from "../utils/utils";

test("sample test", async ({ page }) => {
  const Data = await readExcel("./Data/ExcelSheets/Test.xlsx");
  console.log(Data[0]);
});
