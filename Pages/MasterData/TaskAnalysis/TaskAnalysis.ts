import { duplexPair } from "stream";
import { randomNumber, TableSearch } from "../../../utils/utils";
import { table } from "console";
import { ROUTES } from "../routes";

type TQuestions = {
  Label: string;
};
type TClassification = {
  ID: string;
  Name: string;
  Description: string;
  Example: string;
};

class TaskAnalysis {
  RandomNumber = randomNumber();
  //Create Task Analysis Questions
  async GoToCreateTaskAnalysisQuestions({
    page,
    expect,
    Duplicate,
  }: {
    page: any;
    expect: any;
    Duplicate?: boolean;
  }) {
    await page.getByRole("button", { name: "Add Question" }).click();
    await expect(
      page.getByRole("heading", { name: "Add Task Analysis Question" }),
    ).toBeVisible();
  }
  async CreateTaskAnalysisQuestions({
    page,
    expect,
    Data,
    Empty,
    NotRandomNumber,
    Duplicate,
  }: {
    page: any;
    expect: any;
    Data: TQuestions;
    Empty?: boolean;
    NotRandomNumber?: boolean;
    Duplicate?: boolean;
  }) {
    if (Empty) {
      await page.getByRole("button", { name: "Create Question" }).click();
      await expect(page.getByText("This field is required")).toBeVisible();
    } else {
      await page
        .getByTestId("label")
        .fill(NotRandomNumber ? Data.Label : Data.Label + this.RandomNumber);
      await page.getByRole("button", { name: "Create Question" }).click();
      if (Duplicate) {
        await expect(
          page.getByText("Question label must be unique."),
        ).toBeVisible();
      }
      await page.waitForTimeout(3000);
    }
  }

  // Edit Task Analysis Questions
  async GoToEditTaskAnalysisQuestions({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TQuestions;
  }) {
    const Found = await TableSearch({
      page,
      Name: Data.Label,
      Edit: true,
      Button: true,
    });

    if (!Found) {
      await this.GoToCreateTaskAnalysisQuestions({ page, expect });
      await this.CreateTaskAnalysisQuestions({
        page,
        expect,
        Data,
        NotRandomNumber: true,
      });

      await page.waitForTimeout(3000);
      await this.GoToEditTaskAnalysisQuestions({ page, expect, Data });
    }
  }

  async EditTaskAnalysisQuestions({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TQuestions;
  }) {
    await expect(page.getByTestId("label")).toHaveValue(Data.Label);
    await page.getByTestId("label").clear();
    await page.getByTestId("label").fill(Data.Label);
    await page.getByRole("button", { name: "Update Question" }).click();
  }

  // Delete Task Analysis Questions
  async DeleteTaskAnalysisQuestions({
    page,
    Data,
  }: {
    page: any;
    Data: TQuestions;
  }) {
    const Found = await TableSearch({
      page,
      Name: Data.Label,
      Show: true,
      Button: true,
    });

    if (Found) {
      await page.getByRole("button", { name: "OK" }).click();
      await page.waitForTimeout(3000);
    } else {
      console.log("No Data Found Delete Task Analysis Questions");
    }
  }

  // ------------------------------------------------------
  // ------------------------------------------------------
  // ------------------------------------------------------

  //Create Task Analysis Classification
  async GoToCreateTaskAnalysisClassification({
    page,
    expect,
    Duplicate,
  }: {
    page: any;
    expect: any;
    Duplicate?: boolean;
  }) {
    if (Duplicate) {
      await page.getByRole("button", { name: "Add Classification" }).click();
    } else {
      await page.getByRole("button", { name: "Task Classifications" }).click();
      await page.getByRole("button", { name: "Add Classification" }).click();
    }
    await expect(
      page.getByRole("heading", { name: "Add Task Classification" }),
    ).toBeVisible();
  }
  async CreateTaskAnalysisClassification({
    page,
    expect,
    Data,
    Empty,
    Required,
    NotRandomNumber,
    Duplicate,
  }: {
    page: any;
    expect: any;
    Data: TClassification;
    Empty?: boolean;
    Required?: boolean;
    NotRandomNumber?: boolean;
    Duplicate?: boolean;
  }) {
    if (Empty) {
      await page.getByRole("button", { name: "Create Classification" }).click();
      await expect(
        page.getByText("This field is required").nth(0),
      ).toBeVisible();
      await expect(
        page.getByText("This field is required").nth(1),
      ).toBeVisible();
    } else {
      if (Required) {
        await page
          .getByTestId("class_id")
          .fill(NotRandomNumber ? Data.ID : Data.ID + this.RandomNumber);
        await page
          .getByTestId("title")
          .fill(NotRandomNumber ? Data.Name : Data.Name + this.RandomNumber);
        await page
          .getByRole("button", { name: "Create Classification" })
          .click();
        if (Duplicate) {
          await expect(
            page.getByText("Classification ID must be unique"),
          ).toBeVisible();
          await expect(
            page.getByText("Classification name must be unique"),
          ).toBeVisible();
        }
        await page.waitForTimeout(3000);
      } else {
        await page
          .getByTestId("class_id")
          .fill(NotRandomNumber ? Data.ID : Data.ID + this.RandomNumber);
        await page
          .getByTestId("title")
          .fill(NotRandomNumber ? Data.Name : Data.Name + this.RandomNumber);
        await page.getByTestId("description").fill(Data.Description);
        await page.getByTestId("example").fill(Data.Example);
        await page
          .getByRole("button", { name: "Create Classification" })
          .click();
        await page.waitForTimeout(3000);
      }
    }
  }
  // Edit Task Analysis Classification
  async GoToEditTaskAnalysisClassification({
    page,
    expect,
    Duplicate,
    Data,
  }: {
    page: any;
    expect: any;
    Duplicate?: boolean;
    Data: TClassification;
  }) {
    await page.getByRole("button", { name: "Task Classifications" }).click();
    const Found = await TableSearch({
      page,
      Name: Data.ID,
      Edit: true,
      Button: true,
    });
    if (!Found) {
      await this.GoToCreateTaskAnalysisClassification({ page, expect });
      await this.CreateTaskAnalysisClassification({
        page,
        expect,
        Data,
        NotRandomNumber: true,
      });
      await page.waitForTimeout(3000);
      await this.GoToEditTaskAnalysisClassification({ page, expect, Data });
    }
  }
  async EditTaskAnalysisClassification({
    page,
    expect,
    DataBefore,
    DataAfter,
  }: {
    page: any;
    expect: any;
    DataBefore: TClassification;
    DataAfter: TClassification;
  }) {
    await expect(page.getByTestId("class_id")).toHaveValue(DataBefore.ID);
    await expect(page.getByTestId("title")).toHaveValue(DataBefore.Name);
    await expect(page.getByTestId("description")).toHaveValue(
      DataBefore.Description,
    );
    await expect(page.getByTestId("example")).toHaveValue(DataBefore.Example);
    await page.getByTestId("class_id").clear();
    await page.getByTestId("title").clear();
    await page.getByTestId("description").clear();
    await page.getByTestId("example").clear();

    await page.getByTestId("class_id").fill(DataAfter.ID);
    await page.getByTestId("title").fill(DataAfter.Name);
    await page.getByTestId("description").fill(DataAfter.Description);
    await page.getByTestId("example").fill(DataAfter.Example);
    await page.getByRole("button", { name: "Update Classification" }).click();
  }
  // Delete Task Analysis Classification
  async DeleteTaskAnalysisClassification({
    page,

    Data,
  }: {
    page: any;
    Data: TClassification;
  }) {
    await page.getByRole("button", { name: "Task Classifications" }).click();
    const Found = await TableSearch({
      page,
      Name: Data.ID,
      Show: true,
      Button: true,
    });

    if (Found) {
      await page.getByRole("button", { name: "OK" }).click();
      await page.waitForTimeout(3000);
    } else {
      console.log("No Data Found From Delete Task Analysis Classification");
    }
  }
}

export default TaskAnalysis;
