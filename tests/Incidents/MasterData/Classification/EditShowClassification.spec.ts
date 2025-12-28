import Login from "../../../../Pages/Login/Login";
import { expect, test } from "@playwright/test";

import Data from "../../../../Data/MasterData/Classification.json";

import Classification from "../../../../Pages/MasterData/Classification/Classification";
import { TableSearch } from "../../../../utils/utils";

test.beforeEach(async ({ page }) => {
  const home = await new Login().login(page, "admin@admin.com", "123456");
  const MasterData = await home.GoToMasterData(page, expect);
  await MasterData.GoToClassifications(page, expect);
});

test("Edit Classification (primary)", async ({ page }) => {
  const classification = new Classification();

  await classification.GoToEditClassification({
    page,
    expect,
    Secondary: false,
    Data: Data.Edit.Primary.Before,
  });

  await classification.EditClassification({
    page,
    expect,
    DataAfter: Data.Edit.Primary.After,
    DataBefore: Data.Edit.Primary.Before,
    Secondary: false,
  });
});
test("Edit Classification (Secondary)", async ({ page }) => {
  const classification = new Classification();

  await classification.GoToEditClassification({
    page,
    Data: Data.Edit.Secondary.Before,
    expect,
    Secondary: true,
  });

  await classification.EditClassification({
    page,
    expect,
    DataBefore: Data.Edit.Secondary.Before,
    DataAfter: Data.Edit.Secondary.After,
    Secondary: true,
  });
});

test("Show Classification (primary)", async ({ page }) => {
  const Found = await TableSearch({
    page,
    Show: true,
    Name: Data.Edit.Primary.After.Name,
  });

  if (!Found) {
    console.log("Data Not Found");
  } else {
    await expect(page.getByTestId("name")).toHaveValue(
      Data.Edit.Primary.After.Name
    );
    await expect(page.getByTestId("parent_classification.name")).toHaveValue(
      Data.Edit.Primary.After.Parent
    );
    await expect(page.getByTestId("description")).toHaveValue(
      Data.Edit.Primary.After.Description
    );
  }
});
test("Show Classification (Secondary)", async ({ page }) => {
  const classification = new Classification();

  await classification.GoToShowClassification({
    page,
    DataAfter: Data.Edit.Secondary.After,
  });
  await classification.ShowClassification({
    page,
    DataAfter: Data.Edit.Secondary.After,
    expect,
  });
});
