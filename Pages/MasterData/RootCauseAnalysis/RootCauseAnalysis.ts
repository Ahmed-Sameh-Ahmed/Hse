import { randomNumber } from "../../../utils/utils";

type TData = {
  name: string;
  Description: string;
  PossibleCauses: string;
};

class RootCauseAnalysis {
  randomNumber = randomNumber();

  async CreateRootCauseAnalysis({
    page,
    expect,
    Data,
  }: {
    page: any;
    expect: any;
    Data: TData;
  }) {
    await page.waitForTimeout(5000);
    const count = await page.locator("div .border-slate-100").count();

    console.log(count);

    await page.getByRole("button", { name: "Add Pillar" }).click();

    // Empty
    await page.getByTestId("save-configuration-button").click();
    await expect(page.getByText("Required field missing")).toBeVisible();
    await expect(page.getByText("This field is required").nth(0)).toBeVisible();
    await expect(page.getByText("This field is required").nth(1)).toBeVisible();

    //Required

    await page
      .getByTestId(`pillars.${count}.title`)
      .fill(Data.name + this.randomNumber);
    await page
      .getByTestId(`pillars.${count}.causes.${0}.definition`)
      .fill(Data.PossibleCauses);
    await page.getByTestId("save-configuration-button").click();

    //-----------------
    await page.reload();
    await page.waitForTimeout(3000);
    //-----------------

    // open pillar

    const selectedCard = await page.locator("div.border-slate-100").filter({
      has: page.locator("span", { hasText: Data.name + this.randomNumber }),
    });

    const CardNumber = await selectedCard
      .locator(" span ")
      .nth(0)
      .textContent();

    console.log(Number(CardNumber));
    // try {
    //   await expect(
    //     page.getByTestId(`pillars.${Number(CardNumber) - 1}.title`)
    //   ).toHaveValue(Data.name + this.randomNumber);
    // } catch (error) {
    //   await selectedCard.click();
    // }

    await expect(selectedCard).toBeVisible({ timeout: 10000 });
    await selectedCard.click();
    // check Data
    await expect(
      page.getByTestId(`pillars.${Number(CardNumber) - 1}.title`)
    ).toHaveValue(Data.name + this.randomNumber);
    await expect(
      page.getByTestId(
        `pillars.${Number(CardNumber) - 1}.causes.${0}.definition`
      )
    ).toHaveValue(Data.PossibleCauses);

    // new pillar with Description
    const NewCount = await page.locator("div .border-slate-100").count();

    await page.getByRole("button", { name: "Add Pillar" }).click();

    await page
      .getByTestId(`pillars.${NewCount}.title`)
      .fill(Data.name + this.randomNumber + 5);
    await page
      .getByTestId(`pillars.${NewCount}.description`)
      .fill(Data.Description);

    await page
      .getByTestId(`pillars.${NewCount}.causes.${0}.definition`)
      .fill(Data.PossibleCauses);
    await page.getByTestId("save-configuration-button").click();

    //-----------------
    await page.reload();
    await page.waitForTimeout(3000);
    //-----------------

    await page
      .locator("div .border-slate-100", {
        hasText: Data.name + this.randomNumber + 5,
      })
      .locator("div")
      .nth(2)
      .locator("button")
      .first()
      .click();

    await page.getByRole("button", { name: "OK" }).click();
    await page.getByTestId("save-configuration-button").click();
  }
}

export default RootCauseAnalysis;
