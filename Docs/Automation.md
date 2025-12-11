# 🤖 Automation Guide - HSE Project

**Last Updated**: December 2025  
**Project**: HSE (Health, Safety & Environment) Management System  
**Scope**: Guidelines, setup, run, CI integration, debugging and best practices for test automation using Playwright Test (TypeScript).

---

## Purpose

This document describes how to run, extend, and maintain the automation suite for the HSE project. It includes local setup, CI patterns, debugging tips, reporting, and recommended best practices to keep the test-suite stable and fast.

---

## Quick Start (Local)

1. Install dependencies:

```powershell
npm install
```

2. Run the full test suite:

```powershell
npx playwright test
```

3. Run a specific test file:

```powershell
npx playwright test tests/Foundations/UsersManagement/Groups/CreateGroup.spec.ts
```

4. Run tests in headed (visible) mode:

```powershell
npx playwright test --headed
```

5. Run with debugging UI:

```powershell
npx playwright test --debug
```

6. Show last HTML report:

```powershell
npx playwright show-report
```

---

## Recommended NPM Scripts (suggested)

Add the following scripts to `package.json` for convenience:

```json
"scripts": {
  "test": "playwright test",
  "test:headed": "playwright test --headed",
  "test:debug": "playwright test --debug",
  "test:chromium": "playwright test --project=chromium",
  "test:report": "playwright show-report",
  "clean:results": "rimraf test-results playwright-report"
}
```

Note: Install `rimraf` if you add `clean:results` (`npm i -D rimraf`) or use an equivalent Windows-safe command.

---

## Project Layout (what matters for automation)

- `playwright.config.ts` — test runner configuration (projects, retries, baseURL).
- `tests/` — Playwright test specs (E2E scenarios).
- `Pages/` — Page Object Model classes encapsulating UI interactions.
- `Data/` — JSON test data used across tests.
- `utils/` — Reusable helpers such as `safeAction` and `CheckFilteredData`.
- `playwright-report/` and `test-results/` — generated artifacts after test runs.

---

## Environment & Configuration

- Base URL is configured in `playwright.config.ts` (`https://hse.bitwise-solutions.com`).
- Retries are set to `2` on CI and `0` locally by default.
- `trace: "on-first-retry"` is enabled to capture useful traces for failed tests.
- `fullyParallel: true` is enabled for local parallel execution; CI uses a single worker to avoid race conditions.

Environment variables and secrets:

- Use CI provider secret stores (GitHub Actions secrets, GitLab CI variables, Azure Pipelines variables) for credentials and ephemeral tokens.
- Do not commit sensitive credentials to repo. Use test accounts with limited privileges.

---

## CI Integration (example guidance)

This repo can be integrated with any CI (GitHub Actions, GitLab CI, Azure Pipelines). The CI job should:

- Checkout code
- Install dependencies (`npm ci`)
- Run `CI=true npx playwright test`
- Archive `playwright-report/`, `test-results/`, screenshots and traces

Example GitHub Actions job snippet:

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - run: npm ci
      - run: CI=true npx playwright test
      - name: Upload Playwright Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
```

Notes:

- Set `workers: 1` in CI if tests interact with shared test data to avoid race conditions.
- Ensure CI preserves artifacts for failed runs (screenshots, traces, videos).

---

## Test Design & Practices (summary)

- Use Page Object Model in `Pages/` to keep tests readable and maintainable.
- Externalize test data in `Data/` (JSON) and avoid hardcoded values in test specs.
- Prefer `data-testid` and ARIA selectors over brittle XPath or index-based selectors.
- Use Playwright `expect` for waiting/assertions, not `waitForTimeout`.
- Keep tests independent and idempotent; they should be runnable in any order.
- Use `test.beforeEach` to perform login + navigation to the module under test.

---

## Debugging Failed Tests

When a test fails locally or in CI:

1. Open the HTML report: `npx playwright show-report` or open `playwright-report/index.html`.
2. Inspect the screenshot(s), video(s) and trace(s) produced.
3. Re-run a failing test in headed mode: `npx playwright test path/to/test.spec.ts --headed`.
4. Run in interactive debug mode: `npx playwright test --debug`.
5. Use `page.pause()` inside test to stop execution for interactive inspection.

Collecting Traces:

- Playwright records traces on first retry; open them with `npx playwright show-trace <trace.zip>`.

---

## Reporting & Artifacts

- HTML report: `playwright-report/` (open via `npx playwright show-report`).
- Test results: `test-results/` — contains screenshots, videos, and traces.
- CI should archive `playwright-report` and `test-results` for failed runs.

Useful commands:

```powershell
# Show report
npx playwright show-report

# Clean previous results (if rimraf installed)
npm run clean:results
```

---

## Common Troubleshooting

- Flaky tests: Use explicit `expect` waits, increase timeouts for slow CI networks, reduce parallelism.
- Permission or auth failures in CI: Make sure test credentials and environment variables are set in CI secrets.
- Element not found: Prefer stable selectors (`data-testid`), add `await page.waitForSelector(selector)` where necessary.
- Network/API instability: Use a controlled test environment or mock network responses where appropriate.

---

## Best Practices for Contributors

- Write small focused tests that validate one behavior.
- Use descriptive test names following `[Feature] [Action] [Expected Result]`.
- Update `Data/` JSON files for any data changes rather than modifying test files.
- If you change selectors, update the corresponding POM instead of tests.
- Add a short note to the PR describing any required test data or environment changes.

---

## Automation Health Metrics (recommended)

- Test pass rate (daily): target 95%+.
- Flakiness rate: target < 1%.
- Average run time: monitor and aim to keep it minimal (shard tests if needed).
- Test coverage of critical flows: target 80%+

Track these metrics in your CI dashboard or a simple weekly report.

---

## Extending the Suite

- Add new Page Object classes under `Pages/` following existing patterns.
- Add test data under `Data/` and reference them from specs.
- Keep helpers in `utils/` for shared operations (e.g., `safeAction`, `CheckFilteredData`).
- Consider adding Visual Regression (Percy or Playwright snapshots), accessibility checks (`axe-playwright`), and API contract tests as next steps.

---

## Contacts & Support

- QA Lead: `QA Team`
- Issues and bugs: Use GitHub Issues in this repo.
- Slack: `#hse-testing`

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Next Review**: March 2026
