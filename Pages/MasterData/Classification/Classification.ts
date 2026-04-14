import { randomNumber, TableSearch } from "../../../utils/utils";
import { ROUTES } from "../routes";

type TData = {
  Name: string;
  Parent: string;
  Description: string;
  Status?: Boolean;
};

class Classification {
  randomNumber = randomNumber();

  // Create
  async GoToCreateClassification({ page, expect }: { page: any; expect: any }) {
    await page.getByRole("button", { name: "Add Classification" }).click();
    await expect(page).toHaveURL(ROUTES.CLASSIFICATIONS_CREATE);
  }

  async CreateClassification({
    page,
    expect,
    Status,
    Data,
    NotRandomNumber,
    Duplicate,
  }: {
    page: any;
    expect: any;
    Status: string;
    Data?: TData;
    NotRandomNumber?: boolean;
    Duplicate?: boolean;
  }) {
    // if (Empty) {
    //   await page.getByTestId("save-button").click();
    //   await expect(
    //     page.getByText("This field is required").nth(0)
    //   ).toBeVisible();
    // } else {
    // }

    if (Status === "Empty") {
      await page.getByTestId("save-button").click();
      await expect(
        page.getByText("This field is required").nth(0),
      ).toBeVisible();
    } else if (Status === "Primary_Required") {
      await page
        .getByTestId("name")
        .fill(
          NotRandomNumber ? Data?.Name : `${Data?.Name}${this.randomNumber}`,
        );
      await page.getByTestId("save-button").click();
      await expect(page).toHaveURL(ROUTES.CLASSIFICATIONS);
      await page.getByRole("button", { name: "OK" }).click();
    } else if (Status === "Primary_AllFields") {
      await page
        .getByTestId("name")
        .fill(
          NotRandomNumber ? Data?.Name : `${Data?.Name}${this.randomNumber}`,
        );
      await page.getByTestId("description").fill(Data?.Description);
      await page.getByTestId("save-button").click();

      if (Duplicate) {
        await expect(
          page.getByText("Classification with this name already exists"),
        ).toBeVisible();
      } else {
        await expect(page).toHaveURL(ROUTES.CLASSIFICATIONS);
        await page.getByRole("button", { name: "OK" }).click();
      }
    } else if (Status === "Secondary_Required") {
      await page
        .getByTestId("name")
        .fill(
          NotRandomNumber ? Data?.Name : `${Data?.Name}${this.randomNumber}`,
        );
      await page
        .getByRole("textbox", { name: "Parent Classification" })
        .click();
      await page
        .getByRole("option")
        .getByText(Data?.Parent, { exact: true })
        .click();
      await page.getByTestId("save-button").click();
      await expect(page).toHaveURL(ROUTES.CLASSIFICATIONS);
      await page.getByRole("button", { name: "OK" }).click();
    } else if (Status === "Secondary_AllFields") {
      await page
        .getByTestId("name")
        .fill(
          NotRandomNumber ? Data?.Name : `${Data?.Name}${this.randomNumber}`,
        );
      await page.getByTestId("description").fill(Data?.Description);
      await page
        .getByRole("textbox", { name: "Parent Classification" })
        .click();
      await page
        .getByRole("option")
        .getByText(Data?.Parent)
        .click();
      await page.getByTestId("save-button").click();

      if (Duplicate) {
        await expect(
          page.getByText("Classification with this name already exists"),
        ).toBeVisible();
      } else {
        await expect(page).toHaveURL(ROUTES.CLASSIFICATIONS);
        await page.getByRole("button", { name: "OK" }).click();
      }
    }
  }

  // Edit

  async GoToEditClassification({
    page,
    expect,
    Data,
    Secondary,
  }: {
    page: any;
    expect: any;
    Data: TData;
    Secondary: boolean;
  }) {
    const Found = await TableSearch({
      page,
      Name: Data.Name,
      Edit: true,
    });
    if (!Found) {
      await this.GoToCreateClassification({ page, expect });
      await this.CreateClassification({
        page,
        expect,
        Status: Secondary ? "Secondary_Required" : "Primary_Required",
        NotRandomNumber: true,
        Data: Data,
      });

      await this.GoToEditClassification({
        page,
        Data,
        expect,
        Secondary: Secondary ? true : false,
      });
    }
  }
  async EditClassification({
    page,
    expect,
    DataBefore,
    DataAfter,
    Secondary,
  }: {
    page: any;
    expect: any;
    DataBefore: TData;
    DataAfter: TData;
    Secondary?: boolean;
  }) {
    await expect(page.getByTestId("name")).toHaveValue(DataBefore.Name);
    await expect(
      page.getByRole("textbox", { name: "Parent Classification" }),
    ).toHaveValue(DataBefore.Parent);
    await expect(page.getByTestId("description")).toHaveValue(
      DataBefore.Description,
    );

    await page.getByTestId("name").clear();
    if (Secondary) {
      await page.locator(".mantine-focus-auto").click();
    }
    await page.getByTestId("description").clear();

    await page.getByTestId("name").fill(DataAfter.Name);
    if (Secondary) {
      await page
        .getByRole("textbox", { name: "Parent Classification" })
        .click();
      await page
        .getByRole("option")
        .getByText(DataAfter?.Parent, { exact: true })
        .click();
    }
    await page.getByTestId("description").fill(DataAfter.Description);
    await page.getByTestId("edit-button").click();
    await expect(page).toHaveURL(ROUTES.CLASSIFICATIONS);
    await page.getByRole("button", { name: "OK" }).click();
  }

  // Show
  async GoToShowClassification({
    page,
    DataAfter,
  }: {
    page: any;
    DataAfter: TData;
  }) {
    const Found = await TableSearch({
      page,
      Show: true,
      Name: DataAfter.Name,
    });

    if (!Found) {
      console.log("Data Not Found");
    }
  }
  async ShowClassification({
    page,
    expect,
    DataAfter,
  }: {
    page: any;
    expect: any;
    DataAfter: TData;
  }) {
    await expect(page.getByTestId("name")).toHaveValue(DataAfter.Name);
    await expect(page.getByTestId("parent_classification.name")).toHaveValue(
      DataAfter.Parent,
    );
    await expect(page.getByTestId("description")).toHaveValue(
      DataAfter.Description,
    );
  }

// Full E2E Workflow: Create -> Show -> Edit -> Inactive
  async E2EClassificationWorkflow({
    page,
    expect,
    initialData,
    editedData,
    isSecondary = false,
  }: {
    page: any;
    expect: any;
    initialData: TData;
    editedData: TData;
    isSecondary?: boolean;
  }) {
    // 1. تجهيز الداتا برقم عشوائي ثابت
    const uniqueNum = randomNumber();
    const dataToCreate = {
      ...initialData,
      Name: `${initialData.Name}-${uniqueNum}`,
    };
    const dataToEdit = {
      ...editedData,
      Name: `${editedData.Name}-${uniqueNum}`,
    };

    // 2. Create Classification
    await this.GoToCreateClassification({ page, expect });
    await this.CreateClassification({
      page,
      expect,
      Status: isSecondary ? "Secondary_AllFields" : "Primary_AllFields",
      Data: dataToCreate,
      NotRandomNumber: true,
    });

    // 3. Show & Verify
    await this.GoToShowClassification({ page, DataAfter: dataToCreate });
    await this.ShowClassification({ page, expect, DataAfter: dataToCreate });

    // ارجع للجدول عشان تعمل Edit
    await page.goto(ROUTES.CLASSIFICATIONS);

    // 4. Edit All Fields
    await this.GoToEditClassification({
      page,
      expect,
      Data: dataToCreate,
      Secondary: isSecondary,
    });
    await this.EditClassification({
      page,
      expect,
      DataBefore: dataToCreate,
      DataAfter: dataToEdit,
      Secondary: isSecondary,
    });
    
  }
  
}
export default Classification;
