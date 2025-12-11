# HSE Project Architecture Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [Page Object Model (POM)](#page-object-model-pom)
6. [Test Structure](#test-structure)
7. [Data Management](#data-management)
8. [Utilities](#utilities)
9. [Configuration](#configuration)
10. [Best Practices](#best-practices)

---

## Project Overview

The **HSE** project is a comprehensive **Health, Safety & Environment (HSE)** management automation testing suite built with **Playwright**. It follows the **Page Object Model** design pattern for maintainability and scalability.

### Key Characteristics

- **Type**: End-to-End (E2E) Testing Suite
- **Framework**: Playwright Test
- **Language**: TypeScript
- **Application Under Test**: https://hse.bitwise-solutions.com
- **Purpose**: Automate testing for HSE management features including Master Data, Users Management, and Group management

---

## Technology Stack

### Core Dependencies

| Technology           | Version  | Purpose                             |
| -------------------- | -------- | ----------------------------------- |
| **@playwright/test** | ^1.57.0  | E2E testing framework               |
| **@types/node**      | ^24.10.1 | TypeScript Node.js type definitions |
| **TypeScript**       | -        | Static typing for JavaScript        |

### Key Features

- **Multi-browser testing**: Chromium, Firefox, WebKit
- **Parallel test execution**: Tests run in parallel for faster feedback
- **HTML reporting**: Built-in HTML test reporter
- **Retry mechanism**: Automatic retries on CI environment
- **Trace recording**: Detailed trace collection on first retry for debugging

---

## Directory Structure

```
Hse/
├── Pages/                           # Page Object Models (POM)
│   ├── Home/
│   │   └── Home.ts                 # Home page navigation
│   ├── Login/
│   │   └── Login.ts                # Login authentication flow
│   ├── MasterData/
│   │   ├── MasterData.ts           # Master Data hub page
│   │   ├── Consequences/
│   │   │   └── Consequences.ts     # Consequences management
│   │   ├── Hazards/
│   │   │   └── Hazards.ts          # Hazards management (358 lines)
│   │   └── OrganizationHierarchy/
│   │       └── OrganizationHierarchy.ts
│   └── UsersManagement/
│       ├── UsersManagement.ts      # Users Management hub page
│       └── Groups/
│           └── Groups.ts            # Groups management
│
├── tests/                           # Test Specifications
│   ├── example.spec.ts             # Example test file (empty)
│   ├── MasterData/
│   │   ├── Consequences/
│   │   │   └── CreateConsequences.spec.ts
│   │   ├── Hazard/
│   │   │   ├── CreateHazard.spec.ts
│   │   │   ├── EditShowHazard.spec.ts
│   │   │   └── FilterHazard.spec.ts
│   │   └── OrganizationHierarchy/
│   │       ├── CreateOrganizationHierarchy.spec.ts
│   │       ├── EditShowOrganizationHierarchy.spec.ts
│   │       └── FilterOrganizationHierarchy.spec.ts
│   └── UsersManagement/
│       └── Groups/
│           └── CreateGroup.spec.ts
│
├── Data/                            # Test Data Files (JSON)
│   ├── MasterData/
│   │   ├── Hazard.json             # Hazard test data (Right/Wrong/Show/FilterData)
│   │   ├── Consequences.json
│   │   └── OrganizationHierarchy.json
│   └── UsersManagement/
│       └── Group.json
│
├── utils/                           # Shared Utilities
│   └── utils.ts                    # Helper functions
│
├── docs/                            # Documentation
│   └── test_plans.md               # Test planning documentation
│
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Project dependencies
├── README.md                       # Project readme
└── tsconfig.json                   # TypeScript configuration
```

---

## Architecture Patterns

### 1. **Page Object Model (POM)**

The project implements the **Page Object Model** design pattern, which encapsulates page elements and interactions into reusable page classes.

#### Benefits

- **Maintainability**: Changes to UI selectors require updates in one place
- **Reusability**: Page methods can be reused across multiple tests
- **Readability**: Tests read like natural language
- **Scalability**: Easy to add new pages and tests

#### Example Structure

```typescript
// Page Class (Pages/MasterData/Hazards/Hazards.ts)
class Hazards {
  async GoToCrateHazard(page: any, expect: any) {
    await page.getByRole("button", { name: "Create Hazard" }).click();
    expect(page).toHaveURL("/master-data/hazards/create");
  }

  async CreateHazard(page: any, expect: any, Data: TData, Empty?: boolean) {
    // Implementation
  }
}

// Test Usage
test("Create Hazard With Right Data", async ({ page }) => {
  const hazards = new Hazards();
  await hazards.GoToCrateHazard(page, expect);
  await hazards.CreateHazard(page, expect, Data.Right);
});
```

### 2. **Navigation Hierarchy**

Pages follow a hierarchical navigation structure mirroring the application's flow:

```
Login
  ↓
Home
  ├→ Users Management
  │    └→ Groups
  └→ Master Data
       ├→ Hazards
       ├→ Consequences
       └→ Organization Hierarchy
```

Each page class returns the next logical page for chainable navigation:

```typescript
// Login.ts
async login(page: any, username: string, password: string) {
  // ... login steps ...
  return new Home();  // Returns Home page object
}

// Home.ts
async GoToMasterData(page: any, expect: any) {
  // ... navigation steps ...
  return new MasterData();  // Returns MasterData page object
}
```

---

## Page Object Model (POM)

### Core Page Classes

#### **Login.ts**

- **Purpose**: Handles user authentication
- **Methods**:
  - `login(page, username, password)`: Authenticates user and returns Home page
- **Test IDs Used**: `email`, `password`
- **Assertions**: URL validation to `/home`

#### **Home.ts**

- **Purpose**: Navigation hub for authenticated users
- **Methods**:
  - `GoToMasterData(page, expect)`: Navigate to Master Data section
  - `GoToUsersManagement(page, expect)`: Navigate to Users Management section
- **Returns**: Page objects for destination sections

#### **MasterData.ts**

- **Purpose**: Master Data hub page
- **Methods**: Navigation to sub-modules (Hazards, Consequences, Organization Hierarchy)

#### **Hazards.ts** (358 lines - Most Complex)

- **Purpose**: Comprehensive hazard management
- **Key Methods**:

  - `GoToCrateHazard(page, expect)`: Navigate to hazard creation form
  - `CreateHazard(page, expect, Data, Empty?)`: Create hazard with validation
  - `GoToShowHazard(page, expect, Data, CreateData)`: Retrieve and display hazard
  - `EditHazard(page, expect, NewData)`: Edit existing hazard
  - `FilterHazardByName()`: Filter hazards by name
  - `FilterHazardByCategory()`: Filter hazards by category
  - `FilterHazardBySeverity()`: Filter hazards by severity
  - `FilterHazardByStatus()`: Filter hazards by status

- **Data Type**:
  ```typescript
  type TData = {
    Name: string;
    Category: string;
    Severity: string;
    Associated_Caution: string;
    How_to_Detect: string;
    Contamination_Procedure: string;
  };
  ```

#### **Similar Modules**

- **Consequences.ts**: Manages consequence records
- **OrganizationHierarchy.ts**: Manages organizational structure
- **Groups.ts**: Manages user groups

---

## Test Structure

### Test Organization

Tests follow a **feature-based organization** aligned with application modules:

```
tests/
├── MasterData/
│   ├── Hazard/
│   │   ├── CreateHazard.spec.ts      → CREATE operations
│   │   ├── EditShowHazard.spec.ts    → READ & UPDATE operations
│   │   └── FilterHazard.spec.ts      → FILTER & SEARCH operations
│   ├── Consequences/
│   │   └── CreateConsequences.spec.ts
│   └── OrganizationHierarchy/
│       ├── CreateOrganizationHierarchy.spec.ts
│       ├── EditShowOrganizationHierarchy.spec.ts
│       └── FilterOrganizationHierarchy.spec.ts
└── UsersManagement/
    └── Groups/
        └── CreateGroup.spec.ts
```

### Test Patterns

#### Pattern 1: Setup with beforeEach Hook

All tests use a consistent setup pattern:

```typescript
test.beforeEach(async ({ page }) => {
  const Home = await new login().login(page, "admin@admin.com", "123456");
  const MasterDataPage = await Home.GoToMasterData(page, expect);
  await MasterDataPage.GoToHazards(page, expect);
});
```

#### Pattern 2: Test Cases per Spec File

Each spec file typically includes:

1. **Happy Path**: Create with correct data

   ```typescript
   test("Create Hazard With Right Data", async ({ page }) => {
     const hazards = new Hazards();
     await hazards.GoToCrateHazard(page, expect);
     await hazards.CreateHazard(page, expect, Data.Right);
   });
   ```

2. **Validation Tests**: Empty/invalid data

   ```typescript
   test("Empty Fields", async ({ page }) => {
     const Empty = true;
     const hazards = new Hazards();
     await hazards.GoToCrateHazard(page, expect);
     await hazards.CreateHazard(page, expect, Data.Right, Empty);
     await expect(page.getByText("This field is required")).toBeVisible();
   });
   ```

3. **Error Handling**: Wrong/invalid data

   ```typescript
   test("Create Hazard With Wrong Data", async ({ page }) => {
     const hazards = new Hazards();
     await hazards.GoToCrateHazard(page, expect);
     await hazards.CreateHazard(page, expect, Data.Wrong);
     await expect(page.getByText("Name must be at least 2")).toBeVisible();
   });
   ```

4. **Edit/Show Tests**: View and modify records
5. **Filter Tests**: Search and filter functionality

---

## Data Management

### Test Data Structure

Test data is stored in **JSON files** organized by module:

#### **Data/MasterData/Hazard.json** (Example)

```json
{
  "Right": {
    "Name": "qqqq",
    "Category": "tester",
    "Severity": "High",
    "Associated_Caution": "ss",
    "How_to_Detect": "qqq",
    "Contamination_Procedure": "qqqq"
  },
  "Wrong": {
    "Name": "q",
    "Category": "tester",
    "Severity": "High",
    "Associated_Caution": "ss",
    "How_to_Detect": "qqq",
    "Contamination_Procedure": "qqqq"
  },
  "ShowInTable": ["Infection Spread", "phyisical", "Critical", "Inactive"],
  "Show": {
    "Name": "Infection Spread",
    "Category": "physical",
    "Severity": "critical",
    "Associated_Caution": "use hearing prtection",
    "How_to_Detect": "Sound level > 85",
    "Contamination_Procedure": "isolate area"
  },
  "FilterData": {
    "Name": "Infection Spread",
    "Category": "tester",
    "Severity": "Critical",
    "Status": "Inactive"
  }
}
```

### Data Organization Strategy

- **Right**: Valid test data for successful operations
- **Wrong**: Invalid test data for validation testing
- **Show**: Known data for retrieval and display tests
- **ShowInTable**: Table row representation of known data
- **FilterData**: Data for filter and search tests

### Data Import Pattern

```typescript
// Test file imports data as JSON
import Data from "../../../Data/MasterData/Hazard.json";

// Used in tests
test("Create with right data", async ({ page }) => {
  await hazards.CreateHazard(page, expect, Data.Right);
});
```

---

## Utilities

### Shared Helper Functions

#### **utils/utils.ts**

```typescript
// Safe Action Wrapper
const safeAction = async (action: () => Promise<any>) => {
  try {
    await action();
  } catch (err) {
    console.log("معلش حنكمل ", err); // Arabic: "It's okay, we'll continue"
  }
};

// Filter Data Validation
const CheckFilteredData = (result: [], expectedData: any) => {
  expect(result).toEqual(Array(result.length).fill(expectedData));
};
```

#### **Usage**

```typescript
// Safe error handling
await safeAction(async () => {
  await page.click("selector");
});

// Filter validation
CheckFilteredData(filteredResults, expectedValue);
```

### Selector Patterns Used

The project uses **Playwright's locator strategies**:

1. **Test IDs**: `page.getByTestId("field-name")`

   ```typescript
   await page.getByTestId("name").fill(Data.Name);
   await page.getByTestId("save-button").click();
   ```

2. **Role-based**: `page.getByRole("button", { name: "..." })`

   ```typescript
   await page.getByRole("button", { name: "Create Hazard" }).click();
   ```

3. **Text Content**: `page.getByText("...")`

   ```typescript
   await expect(page.getByText("This field is required")).toBeVisible();
   ```

4. **CSS Classes**: `page.locator(".className")`
   ```typescript
   await page
     .locator(".m_38a85659")
     .locator("span", { hasText: Data.Category })
     .click();
   ```

---

## Configuration

### Playwright Configuration

#### **playwright.config.ts**

```typescript
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "https://hse.bitwise-solutions.com",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
```

### Configuration Highlights

| Setting           | Value                               | Purpose                        |
| ----------------- | ----------------------------------- | ------------------------------ |
| **testDir**       | `./tests`                           | Test discovery directory       |
| **testMatch**     | `**/*.spec.ts`                      | Test file pattern              |
| **fullyParallel** | `true`                              | Run tests in parallel          |
| **baseURL**       | `https://hse.bitwise-solutions.com` | Application URL                |
| **reporter**      | `html`                              | Generate HTML reports          |
| **trace**         | `on-first-retry`                    | Detailed debugging information |
| **retries**       | `2 (CI only)`                       | Automatic retry on CI          |
| **workers**       | `1 (CI), undefined (local)`         | Parallel workers               |
| **browsers**      | Chromium, Firefox, WebKit           | Multi-browser testing          |

---

## Best Practices

### 1. **Page Object Design**

✅ **Do**

- Create a class for each page/section
- Encapsulate all interactions within the page class
- Return page objects for navigation
- Use meaningful method names

❌ **Don't**

- Expose selectors in test files
- Mix UI interactions with assertions in tests
- Create overly large page classes

### 2. **Test Organization**

✅ **Do**

- Group related tests in the same spec file
- Use `beforeEach` for common setup
- Follow Arrange-Act-Assert pattern
- Use descriptive test names

❌ **Don't**

- Create dependencies between tests
- Use `test.only` in production code
- Hard-code data in tests

### 3. **Data Management**

✅ **Do**

- Store test data in JSON files
- Organize data by module/feature
- Include multiple data scenarios (Right, Wrong, Empty)
- Import data as typed objects when possible

❌ **Don't**

- Hard-code data in test files
- Create duplicate test data
- Mix test setup and test data

### 4. **Selector Strategy**

✅ **Do**

- Prefer test IDs (`getByTestId`)
- Use role-based selectors (`getByRole`)
- Use semantic text selectors (`getByText`)
- Make selectors specific and unique

❌ **Don't**

- Rely solely on CSS classes
- Use overly complex XPath selectors
- Use brittle selectors (position-based)
- Hard-code numeric indices

### 5. **Error Handling**

✅ **Do**

- Use try-catch with safe actions
- Provide meaningful error messages
- Log errors appropriately
- Continue test execution when safe

❌ **Don't**

- Ignore all errors silently
- Stop execution on non-critical failures
- Use generic error messages

### 6. **Assertion Patterns**

✅ **Do**

- Validate URL changes after navigation
- Check for success/error messages
- Verify data display in tables
- Use explicit waits (`expect` with `toBeVisible()`)

❌ **Don't**

- Use hardcoded waits (`page.waitForTimeout`)
- Assert implementation details
- Create flaky assertions

---

## Running Tests

### Local Development

```bash
# Install dependencies
npm install

# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/MasterData/Hazard/CreateHazard.spec.ts

# Run in debug mode
npx playwright test --debug

# View test report
npx playwright show-report
```

### CI/CD

- Automatic retries enabled (2 retries)
- Single worker for sequential execution
- HTML reports generated automatically
- Trace collection on first retry

---

## Future Enhancements

1. **Test Data Management**

   - Implement data factory patterns
   - Use external database for test data
   - Add API-based data setup

2. **Reporting**

   - Integrate with reporting systems
   - Add custom reporters
   - Implement metrics collection

3. **CI/CD Integration**

   - GitHub Actions workflow
   - Parallel execution optimization
   - Artifact management

4. **Code Quality**

   - Add ESLint configuration
   - Implement pre-commit hooks
   - Add code coverage reports

5. **Localization**
   - Support multiple languages
   - Manage localized test data
   - Handle RTL (Right-to-Left) languages

---

## Contact & Support

For questions or issues regarding the test architecture:

- Review [test_plans.md](./docs/test_plans.md)
- Check individual test files for usage examples
- Refer to [Playwright documentation](https://playwright.dev)

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Framework**: Playwright Test ^1.57.0
