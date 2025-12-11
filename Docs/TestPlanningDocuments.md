# 📋 Test Planning Documents - HSE Project

**Last Updated**: December 2025  
**Project**: HSE (Health, Safety & Environment) Management System  
**Testing Framework**: Playwright Test (TypeScript)  
**Application URL**: https://hse.bitwise-solutions.com

---

## Table of Contents

1. [Test Strategy Overview](#test-strategy-overview)
2. [Test Scope](#test-scope)
3. [Test Objectives](#test-objectives)
4. [Testing Framework & Tools](#testing-framework--tools)
5. [Test Structure](#test-structure)
6. [Test Coverage Areas](#test-coverage-areas)
7. [Page Object Model (POM) Design](#page-object-model-pom-design)
8. [Test Data Management](#test-data-management)
9. [Test Execution](#test-execution)
10. [Reporting & Monitoring](#reporting--monitoring)
11. [Best Practices & Guidelines](#best-practices--guidelines)
12. [Known Issues & Limitations](#known-issues--limitations)

---

## Test Strategy Overview

### Purpose

The HSE project follows a **comprehensive End-to-End (E2E) testing strategy** using Playwright Test framework to ensure the reliability, functionality, and user experience of the HSE management system across all major features including:

- Master Data Management (Hazards, Consequences, Organization Hierarchy)
- Users Management & Group Administration
- Authentication & Authorization
- Data Validation & Business Logic

### Testing Approach

- **Pyramid Model**: Focus on critical user workflows through E2E tests
- **Page Object Model (POM)**: Maintainable, scalable test architecture
- **Data-Driven Testing**: Externalized test data in JSON format
- **Multi-Browser Testing**: Chromium, Firefox, WebKit compatibility
- **Parallel Execution**: Optimized test performance
- **Automatic Retries**: Failed tests retry automatically on CI environment

---

## Test Scope

### In Scope

✅ **Master Data Management**

- Hazards (Create, Edit, View, Filter)
- Consequences (Create, Edit, View, Filter)
- Organization Hierarchy (Create, Edit, View, Filter)

✅ **Users Management**

- Group Management (Create, Edit, View, Delete)
- User Permissions & Access Control

✅ **Core Features**

- User Authentication (Login/Logout)
- Navigation & Page Transitions
- Form Validations & Error Handling
- Data Persistence (API Integration)

✅ **Cross-Functional**

- UI Component Behavior
- Responsive Design Verification
- Accessibility Considerations

### Out of Scope

❌ Performance & Load Testing
❌ Security & Penetration Testing (separate scope)
❌ API Contract Testing (backend responsibility)
❌ Database-Level Testing

---

## Test Objectives

### Primary Objectives

1. **Functional Correctness**: Verify all features work as designed
2. **Data Integrity**: Ensure data is saved and retrieved correctly
3. **User Experience**: Validate smooth navigation and intuitive workflows
4. **Business Rules**: Test compliance with business logic requirements
5. **Consistency**: Ensure consistent behavior across browsers and devices
6. **Regression Prevention**: Catch unintended side effects from changes

### Quality Metrics

- **Test Coverage**: Minimum 80% of critical user paths
- **Pass Rate**: Target 100% on main branch
- **Execution Time**: Tests complete in < 5 minutes per browser
- **Flakiness**: Zero flaky tests (< 1% retry rate)

---

## Testing Framework & Tools

### Core Stack

| Component             | Technology          | Version  |
| --------------------- | ------------------- | -------- |
| **Test Framework**    | Playwright Test     | ^1.57.0  |
| **Language**          | TypeScript          | Latest   |
| **Assertion Library** | Expect (Playwright) | Built-in |
| **Type Safety**       | @types/node         | ^24.10.1 |

### Browsers Under Test

| Browser         | Coverage     | Status    |
| --------------- | ------------ | --------- |
| Chromium        | Full Desktop | ✅ Active |
| Firefox         | Full Desktop | ✅ Active |
| WebKit (Safari) | Full Desktop | ✅ Active |

### Playwright Configuration

**File**: `playwright.config.ts`

**Key Settings**:

```typescript
- Test Directory: ./tests
- Match Pattern: **/*.spec.ts
- Parallel Execution: Enabled (fullyParallel: true)
- Retries: 2 on CI, 0 locally
- Reporter: HTML (playwright-report/)
- Base URL: https://hse.bitwise-solutions.com
- Trace: On first retry
```

---

## Test Structure

### Directory Organization

```
tests/
├── Foundations/                          # Foundation Features
│   └── UsersManagement/
│       └── Groups/
│           └── CreateGroup.spec.ts
│
├── Incidents/                            # Incident-Related Tests
│   └── MasterData/
│       ├── Consequences/
│       │   └── CreateConsequences.spec.ts
│       ├── Hazard/
│       │   ├── CreateHazard.spec.ts
│       │   ├── EditShowHazard.spec.ts
│       │   └── FilterHazard.spec.ts
│       └── OrganizationHierarchy/
│           ├── CreateOrganizationHierarchy.spec.ts
│           ├── EditShowOrganizationHierarchy.spec.ts
│           └── FilterOrganizationHierarchy.spec.ts
│
└── MasterData/
    └── Assets/                           # Asset Management (Future)
```

### Test File Naming Convention

- **Pattern**: `[Feature][Action].spec.ts`
- **Examples**:
  - `CreateGroup.spec.ts` - Create functionality tests
  - `EditShowHazard.spec.ts` - Edit and display functionality
  - `FilterHazard.spec.ts` - Filter and search functionality
  - `CreateConsequences.spec.ts` - Create consequences

### Test Structure Template

```typescript
import { test, expect } from "@playwright/test";
import { PageObjects } from "../../../../Pages/...";
import { TestData } from "../../../../Data/...";

test.beforeEach(async ({ page }) => {
  // Setup: Login and navigate to feature
  const home = await new Login().login(page, credentials);
  const featurePage = await home.navigateToFeature(page, expect);
});

test("Create [Feature] With Right Data", async ({ page }) => {
  const feature = new FeatureClass();
  await feature.create(page, expect, TestData.Create.Right);
  // Assert success
});

test("Reject [Feature] With Wrong Data", async ({ page }) => {
  const feature = new FeatureClass();
  await feature.create(page, expect, TestData.Create.Wrong);
  // Assert validation errors
});

test.afterEach(async ({ page }) => {
  // Cleanup if needed
});
```

---

## Test Coverage Areas

### 1. Master Data Management

#### A. Hazards Module

**File**: `tests/Incidents/MasterData/Hazard/`

**Test Cases**:

| Test Case        | Purpose                                | Scope                         |
| ---------------- | -------------------------------------- | ----------------------------- |
| `CreateHazard`   | Verify hazard creation with valid data | Create functionality          |
| `EditShowHazard` | Verify hazard editing and display      | Update & View functionality   |
| `FilterHazard`   | Verify hazard filtering and search     | Search & Filter functionality |

**Key Test Scenarios**:

- ✅ Create hazard with all valid inputs
- ✅ Validate required field enforcement
- ✅ Verify API persistence
- ✅ Edit existing hazards
- ✅ Display hazard details correctly
- ✅ Filter by multiple criteria
- ✅ Verify data consistency after operations

**Test Data Location**: `Data/MasterData/Hazard.json`

**Data Structure**:

```json
{
  "Create": {
    "Right": {
      /* Valid hazard data */
    },
    "Wrong": {
      /* Invalid hazard data */
    }
  },
  "Show": {
    /* Data for display tests */
  },
  "FilterData": {
    /* Data for filter tests */
  }
}
```

#### B. Consequences Module

**File**: `tests/Incidents/MasterData/Consequences/`

**Test Cases**:

- `CreateConsequences` - Consequences creation with validation

**Key Test Scenarios**:

- ✅ Create consequence with valid data
- ✅ Validate required fields
- ✅ Verify severity levels (High/Medium/Low)
- ✅ Persist data to API
- ✅ Handle duplicates appropriately

**Test Data Location**: `Data/MasterData/Consequences.json`

#### C. Organization Hierarchy Module

**File**: `tests/Incidents/MasterData/OrganizationHierarchy/`

**Test Cases**:

- `CreateOrganizationHierarchy` - Create organizational units
- `EditShowOrganizationHierarchy` - Edit and display hierarchy
- `FilterOrganizationHierarchy` - Filter organizational structure

**Key Test Scenarios**:

- ✅ Create organizational units with valid structure
- ✅ Validate hierarchy depth and relationships
- ✅ Edit organizational data
- ✅ Display hierarchy correctly
- ✅ Filter by department/unit
- ✅ Prevent circular dependencies

**Test Data Location**: `Data/MasterData/OrganizationHierarchy.json`

### 2. Users Management

#### A. Group Management

**File**: `tests/Foundations/UsersManagement/Groups/`

**Test Cases**:

- `CreateGroup` - Group creation and management

**Key Test Scenarios**:

- ✅ Create group with valid name
- ✅ Assign users to groups
- ✅ Validate group name uniqueness
- ✅ Persist group data to API
- ✅ Verify group permissions inheritance
- ✅ Handle special characters in group names

**Test Data Location**: `Data/UsersManagement/Group.json`

**Data Structure**:

```json
{
  "Create": {
    "Right": {
      /* Valid group data */
    },
    "Wrong": {
      /* Invalid group data */
    }
  }
}
```

### 3. Authentication & Authorization

**Module**: Login & Session Management

**Test Scenarios** (Built into beforeEach):

- ✅ Login with valid credentials
- ✅ Session persistence across navigation
- ✅ Access control based on user role
- ✅ Logout functionality
- ✅ Invalid credential rejection

**Credentials for Testing**:

- Default Admin: `admin@admin.com` / `123456`

---

## Page Object Model (POM) Design

### Architecture

```
Pages/
├── Home/
│   └── Home.ts                 # Entry point & main navigation
├── Login/
│   └── Login.ts                # Authentication flow
├── MasterData/
│   ├── MasterData.ts           # Hub page navigation
│   ├── Consequences/
│   │   └── Consequences.ts     # Consequence operations (Create, Edit, etc.)
│   ├── Hazards/
│   │   └── Hazards.ts          # Hazard operations (358 lines, comprehensive)
│   └── OrganizationHierarchy/
│       └── OrganizationHierarchy.ts  # Organization operations
└── UsersManagement/
    ├── UsersManagement.ts      # Hub page navigation
    └── Groups/
        └── Groups.ts           # Group management operations
```

### POM Key Principles

1. **Encapsulation**: User interactions are methods within page classes
2. **Abstraction**: Complex workflows are hidden from test logic
3. **Reusability**: Common actions are shared across tests
4. **Maintainability**: Element locators centralized in POM
5. **Fluent API**: Methods return page objects for chaining

### Example POM Method Pattern

```typescript
// Page Object Class
class Hazards {
  async GoToCreateHazard(page: Page, expect: any): Promise<void> {
    // Navigate to create form
    await page.click('button:has-text("Create Hazard")');
    await expect(page.locator("form")).toBeVisible();
  }

  async CreateHazard(page: Page, expect: any, data: any): Promise<void> {
    // Fill form fields
    await page.fill('input[name="hazard_name"]', data.name);
    await page.fill('input[name="description"]', data.description);

    // Submit form
    await page.click('button:has-text("Save")');

    // Verify success
    await expect(page.locator("text=Success")).toBeVisible();
  }
}

// Test Usage
test("Create Hazard With Right Data", async ({ page }) => {
  const hazards = new Hazards();
  await hazards.GoToCreateHazard(page, expect);
  await hazards.CreateHazard(page, expect, HazardData.Create.Right);
});
```

### Navigation Flow

**Typical User Journey**:

```
Login.ts
  ↓
Home.ts (Dashboard)
  ├→ UsersManagement.ts
  │   └→ Groups.ts
  └→ MasterData.ts
      ├→ Hazards.ts
      ├→ Consequences.ts
      └→ OrganizationHierarchy.ts
```

---

## Test Data Management

### Data Storage

**Location**: `Data/` directory with JSON files

**Structure**:

```
Data/
├── MasterData/
│   ├── Hazard.json
│   ├── Consequences.json
│   └── OrganizationHierarchy.json
└── UsersManagement/
    └── Group.json
```

### Data Organization Pattern

Each JSON file contains multiple data scenarios:

```json
{
  "Create": {
    "Right": {
      /* Valid data that should pass all validations */
    },
    "Wrong": {
      /* Invalid data that should trigger error messages */
    }
  },
  "Show": {
    /* Data used in display/view tests */
  },
  "FilterData": {
    /* Data used in filter/search tests */
  }
}
```

### Example: Hazard.json Structure

```json
{
  "Create": {
    "Right": {
      "hazardName": "Chemical Exposure",
      "severity": "High",
      "category": "Chemical Hazard",
      "description": "Exposure to hazardous chemicals"
    },
    "Wrong": {
      "hazardName": "", // Invalid: missing required field
      "severity": "Invalid", // Invalid: non-existent severity
      "category": "" // Invalid: missing category
    }
  },
  "Show": {
    "expectedHazardName": "Chemical Exposure",
    "expectedCategory": "Chemical Hazard"
  },
  "FilterData": {
    "filterByCategory": "Chemical Hazard",
    "expectedResultCount": 5
  }
}
```

### Data Management Best Practices

1. **Separation of Concerns**: Test data separate from test logic
2. **Realistic Data**: Use actual business data scenarios
3. **Maintainability**: Centralized updates across multiple tests
4. **Versioning**: Track data changes with test updates
5. **Security**: Avoid hardcoding sensitive information
6. **Cleanup**: Use test credentials that are separated from production

---

## Test Execution

### Running Tests Locally

**Install Dependencies**:

```bash
npm install
```

**Run All Tests**:

```bash
npx playwright test
```

**Run Specific Test File**:

```bash
npx playwright test tests/Foundations/UsersManagement/Groups/CreateGroup.spec.ts
```

**Run Tests in Headed Mode** (see browser):

```bash
npx playwright test --headed
```

**Run Tests in Debug Mode**:

```bash
npx playwright test --debug
```

**Run Tests with Specific Browser**:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### CI/CD Execution

**Environment Variable**: `CI=true`

**Automatic Behaviors**:

- ✅ Retries on failure: 2 times
- ✅ Workers: Single (sequential execution)
- ✅ Trace: Recorded on first retry for debugging
- ✅ forbidOnly: Fails build if test.only found

**CI Example**:

```bash
CI=true npx playwright test
```

### Test Execution Best Practices

1. **Sequential on CI**: Single worker prevents race conditions
2. **Parallel Locally**: Full parallelization for faster feedback
3. **Retry Strategy**: Automatic retries reduce flakiness
4. **Trace Collection**: First retry traces for debugging
5. **Clean State**: beforeEach ensures fresh login state
6. **Isolation**: Tests don't depend on execution order

---

## Reporting & Monitoring

### HTML Report

**Location**: `playwright-report/` directory

**Generated After**: Every test run

**Contents**:

- ✅ Test summary (passed/failed/skipped)
- ✅ Detailed test steps
- ✅ Screenshots for failures
- ✅ Video recordings (if enabled)
- ✅ Execution timeline
- ✅ Error messages & stack traces

**Viewing Report**:

```bash
npx playwright show-report
```

### Test Results

**Location**: `test-results/` directory

**Contains**:

- ✅ Screenshots of failed tests
- ✅ Video recordings (if configured)
- ✅ Traces for debugging
- ✅ JSON results

### Monitoring Metrics

**Key Metrics to Track**:

| Metric         | Target  | Threshold        |
| -------------- | ------- | ---------------- |
| Pass Rate      | 100%    | > 95% acceptable |
| Execution Time | < 5 min | Monitor trend    |
| Flakiness      | 0%      | < 1% acceptable  |
| Coverage       | 80%+    | Expand quarterly |

### Integration with CI/CD

**Artifacts to Archive**:

- `playwright-report/` - Full HTML report
- `test-results/` - Detailed results and videos
- Failed test screenshots
- Trace files for investigation

---

## Best Practices & Guidelines

### Test Writing Guidelines

✅ **Do**:

- Use descriptive test names that explain what is being tested
- Keep tests focused on single feature/scenario
- Use test data from JSON files, not hardcoded values
- Follow the Arrange-Act-Assert pattern
- Use page object methods for interactions
- Add meaningful comments for complex logic
- Clean up test data in afterEach hooks
- Use expect assertions with clear messages

❌ **Don't**:

- Create interdependent tests
- Hardcode test data in test files
- Use brittle selectors (index-based, unstable XPath)
- Ignore waits and use sleep() instead
- Write very long test methods
- Skip accessibility considerations
- Commit console.log debugging statements
- Test implementation details instead of behavior

### Code Quality Standards

**TypeScript**:

- Strict mode enabled
- Proper type annotations
- No implicit any types
- Use interfaces for data structures

**Naming Conventions**:

- Classes: PascalCase (e.g., `CreateHazard`)
- Methods: camelCase (e.g., `createHazard()`)
- Constants: UPPER_SNAKE_CASE
- Files: PascalCase for classes, kebab-case for utilities

**Comments & Documentation**:

- JSDoc comments for public methods
- Inline comments for complex logic
- Arabic comments acceptable for team communication
- Keep comments updated with code changes

### Element Selection Strategy

**Priority Order**:

1. data-testid attributes (most reliable)
2. ARIA labels / roles
3. Accessible names
4. Stable CSS classes
5. Last resort: XPath with parent context

**Example**:

```typescript
// Good: Using data-testid
await page.fill('[data-testid="hazard-name"]', data.name);

// Acceptable: Using ARIA
await page.fill('input[aria-label="Hazard Name"]', data.name);

// Avoid: Using index-based selectors
await page.fill("input >> nth=0", data.name);
```

### Assertion Guidelines

```typescript
// Good: Clear, descriptive assertions
await expect(page.locator("text=Success Message")).toBeVisible();
await expect(hazardCount).toBeGreaterThan(0);

// Better: With custom messages
await expect(page.locator("#success-msg")).toBeVisible({
  timeout: 5000,
});

// Avoid: Vague assertions
expect(page).toBeTruthy();
```

---

## Known Issues & Limitations

### Current Limitations

| Limitation                    | Impact                             | Workaround                            |
| ----------------------------- | ---------------------------------- | ------------------------------------- |
| No mobile testing             | Mobile coverage gaps               | Add mobile projects to config         |
| No API mocking                | Tests dependent on backend         | Use test environment with stable data |
| Limited accessibility testing | A11y compliance unknown            | Integrate axe-playwright              |
| No performance baseline       | Performance regressions undetected | Add performance CI/CD step            |

### Flaky Test Prevention

**Known Flaky Patterns**:

- ⚠️ Dynamic content loading without explicit waits
- ⚠️ Network timeouts in CI environment
- ⚠️ Element visibility checks without proper waits
- ⚠️ Race conditions in parallel execution

**Prevention Strategies**:

1. Use `expect()` for waits instead of `waitForSelector()`
2. Add explicit waits for dynamic content
3. Use proper network idle waits
4. Implement retry logic in critical paths
5. Monitor and fix intermittent failures immediately

### Future Improvements

- 🔄 Add visual regression testing
- 🔄 Implement API contract testing
- 🔄 Add performance testing suite
- 🔄 Expand mobile device coverage
- 🔄 Integrate accessibility testing (axe)
- 🔄 Add BDD/Gherkin integration
- 🔄 Implement test result trend analysis
- 🔄 Add test flakiness detection and alerts

---

## Test Maintenance

### Regular Maintenance Tasks

| Task                            | Frequency   | Owner     |
| ------------------------------- | ----------- | --------- |
| Review & update test data       | Monthly     | QA Team   |
| Fix failing tests               | Immediately | QA Team   |
| Update selectors for UI changes | As needed   | QA Team   |
| Analyze test execution trends   | Weekly      | QA Lead   |
| Update documentation            | Per release | QA Lead   |
| Dependency updates              | Quarterly   | DevOps/QA |

### Test Evolution

- **v1.0**: Foundation tests for basic CRUD operations
- **v1.1**: Advanced filter and search functionality
- **v1.2**: Cross-browser compatibility validation
- **Future**: Visual regression, API integration, accessibility tests

---

## Contact & Support

For questions about test planning or test execution:

- **QA Lead**: [Contact Information]
- **Test Documentation**: `/docs/` directory
- **Issue Tracking**: GitHub Issues
- **Slack Channel**: #hse-testing

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Next Review**: March 2026
