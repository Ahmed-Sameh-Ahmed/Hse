import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/Classification.json";

import Classification from "../../../../Pages/MasterData/Classification/Classification";

test.beforeEach(async ({ page }) => {
  const home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await home.GoToMasterData(page, expect);
  await MasterData.GoToClassifications(page, expect);
});

test("Empty", async ({ page }) => {
  //Go To Create
  const classifications = new Classification();
  await classifications.GoToCreateClassification({ page, expect });
  //Create
  await classifications.CreateClassification({ page, expect, Status: "Empty" });
});
// Classification Primary
test("Create Classification (Primary) (Required) ", async ({ page }) => {
  //Go To Create
  const classifications = new Classification();
  await classifications.GoToCreateClassification({ page, expect });
  //Create
  await classifications.CreateClassification({
    page,
    expect,
    Status: "Primary_Required",
    Data: Data.Create.Primary.Required,
  });
});
test("Create Classification (Primary) (AllFields) ", async ({ page }) => {
  //Go To Create
  const classifications = new Classification();
  await classifications.GoToCreateClassification({ page, expect });
  //Create
  await classifications.CreateClassification({
    page,
    expect,
    Status: "Primary_AllFields",
    Data: Data.Create.Primary.AllFields,
  });
});

test("Create Classification (Secondary) (Required) ", async ({ page }) => {
  //Go To Create
  const classifications = new Classification();
  await classifications.GoToCreateClassification({ page, expect });
  //Create
  await classifications.CreateClassification({
    page,
    expect,
    Status: "Secondary_Required",
    Data: Data.Create.Secondary.Required,
  });
});
test("Create Classification (Secondary) (AllFields)", async ({ page }) => {
  //Go To Create
  const classifications = new Classification();
  await classifications.GoToCreateClassification({ page, expect });
  //Create
  await classifications.CreateClassification({
    page,
    expect,
    Status: "Secondary_AllFields",
    Data: Data.Create.Secondary.AllFields,
  });
});

//  Duplicate          عيد عليهم تاني
test("Create Classification (AllFields) (Secondary) (Duplicate)", async ({
  page,
}) => {
  //Go To Create
  const classifications = new Classification();
  await classifications.GoToCreateClassification({ page, expect });
  //Create
  try {
    await classifications.CreateClassification({
      page,
      expect,
      Status: "Secondary_AllFields",
      Data: Data.Create.Secondary.AllFields,
      NotRandomNumber: true,
    });
    await classifications.GoToCreateClassification({ page, expect });
    await classifications.CreateClassification({
      page,
      expect,
      Status: "Secondary_AllFields",
      Data: Data.Create.Secondary.AllFields,
      NotRandomNumber: true,
      Duplicate: true,
    });
  } catch (error) {
    console.log("name exists From First time ");
  }
});
test("Create Classification (AllFields) (Primary) (Duplicate)", async ({
  page,
}) => {
  //Go To Create
  const classifications = new Classification();
  await classifications.GoToCreateClassification({ page, expect });
  //Create
  try {
    await classifications.CreateClassification({
      page,
      expect,
      Status: "Primary_AllFields",
      Data: Data.Create.Primary.AllFields,
      NotRandomNumber: true,
    });
    await classifications.GoToCreateClassification({ page, expect });
    await classifications.CreateClassification({
      page,
      expect,
      Status: "Primary_AllFields",
      Data: Data.Create.Primary.AllFields,
      NotRandomNumber: true,
      Duplicate: true,
    });
  } catch (error) {
    console.log("name exists From First time ");
  }
});
