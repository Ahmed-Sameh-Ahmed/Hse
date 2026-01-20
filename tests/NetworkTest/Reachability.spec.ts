import { expect, test } from "@playwright/test";
import Login from "../../Pages/Login/Login";

import { Reachability } from "../../utils/utils";
import { ROUTES } from "../../Pages/MasterData/routes";
test.beforeEach(async ({ page }, { project }) => {
  await new Login().login(page, "admin@admin.com", "123456");
});
test.describe("Side Bar", () => {
  test("Incidents Management", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Incidents management",
      URL: ROUTES.INCIDENTS_MANAGEMENT,
      Role: "heading",
      testInfo,
    });
  });
  test("Users Management", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Users Management",
      URL: ROUTES.USER_MANAGEMENT,
      Role: "heading",
      testInfo,
    });
  });
  test("Settings", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Settings",
      URL: ROUTES.SETTINGS,
      Role: "heading",
      testInfo,
    });
  });
});

test.describe("Master Data Modules", () => {
  test.setTimeout(50000);
  test("Organization Hierarchy", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Organization Hierarchy",
      URL: ROUTES.ORGANIZATION_HIERARCHY,
      Role: "paragraph",
      testInfo,
    });
  });
  test("Hazards", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Hazards",
      URL: ROUTES.HAZARDS,
      Role: "paragraph",
      testInfo,
    });
  });
  test("Consequences List", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Consequences List",
      URL: ROUTES.CONSEQUENCES,
      Role: "paragraph",
      testInfo,
    });
  });
  test("Causes List", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Causes List",
      URL: ROUTES.CAUSES,
      Role: "paragraph",
      testInfo,
    });
  });
  test("Classifications List", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Classifications List",
      URL: ROUTES.CLASSIFICATIONS,
      Role: "paragraph",
      testInfo,
    });
  });
  test("Sites", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Sites",
      URL: ROUTES.SITES,
      Role: "paragraph",
      testInfo,
    });
  });
  test("Asset Types List", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "",
      URL: ROUTES.ASSET_TYPES,
      Role: "paragraph",
      testInfo,
    });
  });
  test("Assets List", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Assets List",
      URL: ROUTES.ASSETS,
      Role: "paragraph",
      testInfo,
    });
  });
  test("Severity Matrix", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Severity Matrix",
      URL: ROUTES.SEVERITY_MATRIX,
      Role: "heading",
      testInfo,
    });
  });
  test("Risk Rating Definitions", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Risk Rating Definitions",
      URL: `${ROUTES.SEVERITY_MATRIX}?tab=risk-definitions`,
      Role: "heading",
      testInfo,
    });
  });
  test("Questions Library", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Questions Library",
      URL: ROUTES.TASK_ANALYSIS,
      Role: "heading",
      testInfo,
    });
  });
  test("Classification Reference", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Classification Reference",
      URL: ROUTES.TASK_ANALYSIS,
      Role: "heading",
      testInfo,
    });
  });
  test("RCA Master Configuration", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "RCA Master Configuration",
      URL: ROUTES.ROOT_CAUSE_ANALYSIS,
      Role: "heading",
      testInfo,
    });
  });
});
test.describe("Users Management Modules", () => {
  test("Users List", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Users List",
      URL: "/users-management/users",
      Role: "paragraph",
      testInfo,
    });
  });
  test("Groups List", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Groups List",
      URL: "/users-management/groups",
      Role: "paragraph",
      testInfo,
    });
  });
  test("Roles", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Roles",
      URL: "/users-management/roles",
      Role: "paragraph",
      testInfo,
    });
  });
});
test.describe("Settings Modules", () => {
  test("General Settings", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "General Settings",
      URL: "/settings/general",
      Role: "paragraph",
      testInfo,
    });
  });
  test("Translation Manager", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Translation Manager",
      URL: "/settings/translations",
      Role: "heading",
      testInfo,
    });
  });
  test("Time & Date", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "Time & Date",
      URL: "/settings/time-and-date",
      Role: "paragraph",
      testInfo,
    });
  });
  test("SMTP", async ({ page }, testInfo) => {
    await Reachability({
      page,
      PageName: "SMTP",
      URL: "/settings/smtp",
      Role: "paragraph",
      testInfo,
    });
  });
});
