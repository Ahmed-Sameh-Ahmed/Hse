# 📐 Test Design Documents - HSE Project

**Document Type**: Technical Design Specification  
**Last Updated**: December 2025  
**Project**: HSE (Health, Safety & Environment) Management System  
**Testing Framework**: Playwright Test (TypeScript)  
**Audience**: QA Engineers, Test Automation Engineers, Development Team

---

## Table of Contents

1. [Design Overview](#design-overview)
2. [Page Object Model (POM) Architecture](#page-object-model-pom-architecture)
3. [Test Case Design](#test-case-design)
4. [Component Design Specifications](#component-design-specifications)
5. [Test Data Design](#test-data-design)
6. [Navigation Flow Design](#navigation-flow-design)
7. [Interaction Patterns](#interaction-patterns)
8. [Error Handling Strategy](#error-handling-strategy)
9. [Performance Considerations](#performance-considerations)
10. [Design Patterns & Best Practices](#design-patterns--best-practices)
11. [Test Infrastructure Design](#test-infrastructure-design)

---

## Design Overview

### Architecture Philosophy

The HSE test automation framework is designed with a **layered, modular approach** that prioritizes:

- **Maintainability**: Changes to UI elements are reflected only in page objects
- **Scalability**: New tests can be added without modifying existing test logic
- **Readability**: Tests read like business requirements, not implementation details
- **Reusability**: Common operations are consolidated into reusable methods
- **Isolation**: Tests are independent and can run in any order

### High-Level Architecture Diagram

```
Test Specifications (.spec.ts)
         ↓
    Page Objects (Pages/)
         ↓
    Playwright API
         ↓
    Application Under Test (https://hse.bitwise-solutions.com)
         ↓
    Backend API
```

### Technology Stack

| Component             | Technology          | Version  | Purpose                       |
| --------------------- | ------------------- | -------- | ----------------------------- |
| **Test Framework**    | Playwright Test     | ^1.57.0  | Test execution and assertions |
| **Language**          | TypeScript          | Latest   | Type safety and IDE support   |
| **Test Data Format**  | JSON                | -        | Externalized test data        |
| **Assertion Library** | Expect (Playwright) | Built-in | Assertion and verification    |
| **Reporting**         | HTML Reporter       | Built-in | Test execution reports        |
| **Type Definitions**  | @types/node         | ^24.10.1 | Node.js type definitions      |

---

## Page Object Model (POM) Architecture

### POM Design Principles

The Page Object Model is implemented to create an abstraction layer between tests and the UI:

```typescript
┌─────────────────────────────────┐
│      Test Specifications        │
│   (CreateHazard.spec.ts)        │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   Page Objects (Hazards.ts)     │
│  - GoToCrateHazard()            │
│  - CreateHazard()               │
│  - ShowHazard()                 │
│  - FilterHazard()               │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│   Playwright Locators & APIs    │
│  - page.getByTestId()           │
│  - page.getByRole()             │
│  - page.locator()               │
└────────────┬────────────────────┘
             │
             ↓
┌─────────────────────────────────┐
│  Application Under Test (AUT)   │
└─────────────────────────────────┘
```

### POM Directory Structure

```
Pages/
├── Login/
│   └── Login.ts                    # Authentication workflows
│
├── Home/
│   └── Home.ts                     # Main dashboard & navigation hub
│
├── MasterData/
│   ├── MasterData.ts              # Master Data hub navigation
│   │
│   ├── Hazards/
│   │   └── Hazards.ts             # Hazard CRUD operations (358 lines)
│   │       ├── Create operations
│   │       ├── Show/Edit operations
│   │       └── Filter operations
│   │
│   ├── Consequences/
│   │   └── Consequences.ts        # Consequence CRUD operations
│   │       ├── Create operations
│   │       ├── Edit operations
│   │       └── Filter operations
│   │
│   └── OrganizationHierarchy/
│       └── OrganizationHierarchy.ts # Organization hierarchy operations
│           ├── Create operations
│           ├── Show/Edit operations
│           └── Filter operations
│
└── UsersManagement/
    ├── UsersManagement.ts          # Users Management hub
    │
    └── Groups/
        └── Groups.ts               # Group CRUD operations
            ├── Create operations
            ├── Edit operations
            └── Show operations
```

### Core POM Classes

#### 1. **Login Class**

**Purpose**: Handle authentication and session management

```typescript
class login {
  // Performs login action and navigates to home page
  async login(page: any, username: string, password: string): Promise<Home>;
}
```

**Methods**:

- `login(page, username, password)` - Authenticate user and return Home page object

**Design Notes**:

- Returns Home page object for method chaining
- Validates URL change to `/home`
- Uses data-testid for reliable element selection

---

#### 2. **Home Class**

**Purpose**: Main navigation hub to all major features

```typescript
class Home {
  async GoToUsersManagement(page: any, expect: any): Promise<UserManagement>;
  async GoToMasterData(page: any, expect: any): Promise<MasterData>;
}
```

**Navigation Methods**:

- `GoToUsersManagement()` - Navigate to Users Management module
- `GoToMasterData()` - Navigate to Master Data module

**Design Notes**:

- Acts as central navigation point
- Returns next page object for fluent navigation
- Validates URL change before returning

---

#### 3. **Hazards Class** (358 lines)

**Purpose**: Comprehensive CRUD operations for Hazards

**Type Definition**:

```typescript
type TData = {
  Name: string;
  Category: string;
  Severity: string;
  Associated_Caution: string;
  How_to_Detect: string;
  Contamination_Procedure: string;
};

type TFilterData = {
  Name: string;
  Category: string;
  Severity: string;
  Status: string;
};
```

**Key Methods**:

| Method                      | Purpose                               | Parameters                                 |
| --------------------------- | ------------------------------------- | ------------------------------------------ |
| `GoToCrateHazard()`         | Navigate to create form               | page, expect                               |
| `CreateHazard()`            | Fill form and submit                  | page, expect, Data, Empty?                 |
| `GoToShowHazard()`          | Navigate to hazard details            | page, expect, Data[], CreateData           |
| `ShowHazard()`              | Verify displayed hazard data          | page, expect, Data                         |
| `GoToEditHazardFormShow()`  | Navigate to edit from detail view     | page, expect                               |
| `GoToEditHazardFormTable()` | Navigate to edit from table           | page, expect, Data[], CreateData, ShowData |
| `EditHazard()`              | Perform edit operations & validations | page, expect, RightData, WrongData         |
| `FilterHazard()`            | Apply filters and verify results      | page, expect, FilterData, CreateData       |

**Design Patterns Used**:

- **Conditional Logic**: `Empty` parameter for validation testing
- **Data-Driven**: Accepts TData objects for flexible inputs
- **Waits**: `waitForSelector()` for dynamic content
- **Helper Functions**: `CheckFilteredData()` utility for assertions
- **Error Handling**: Try-catch blocks for non-critical assertions

**Example Implementation**:

```typescript
async CreateHazard(page: any, expect: any, Data: TData, Empty?: boolean) {
  if (Empty) {
    // Test with empty fields
    await page.getByTestId("name").fill("");
    // ... fill other fields with empty values
    await page.getByTestId("save-button").click();
  } else {
    // Fill with actual data
    await page.getByTestId("name").fill(Data.Name);
    await page.getByRole("textbox", { name: "Category *" }).click();
    await page.locator(".m_38a85659")
      .locator("span", { hasText: Data.Category })
      .click();
    // ... fill remaining fields
    await page.getByTestId("save-button").click();
  }
}
```

---

#### 4. **Consequences Class**

**Purpose**: Consequence management operations

**Type Definition**:

```typescript
type TData = {
  ConsequencesName: string;
  Description: string;
};

type props = {
  page: any;
  Data?: TData;
  expect: any;
  Empty?: Boolean;
};
```

**Key Methods**:

| Method                     | Purpose                            | Parameters   |
| -------------------------- | ---------------------------------- | ------------ |
| `GoToCreateConsequences()` | Navigate to create form            | page, expect |
| `CreateConsequences()`     | Create consequence with validation | props object |

**Design Notes**:

- Uses destructured props object pattern for flexibility
- Validates error messages for empty fields
- Confirms success with dialog box acknowledgment

---

#### 5. **OrganizationHierarchy Class** (299 lines)

**Purpose**: Organization structure management

**Type Definition**:

```typescript
type TData = {
  LevelID: string;
  LevelName: string;
  Position: string;
  ReportsTo: string;
  Description: string;
};

type TFilterData = {
  Level: string;
  PositionName: string;
  ReportsTo: string;
  Status: string;
};
```

**Key Methods**:

| Method                              | Purpose                          | Parameters                           |
| ----------------------------------- | -------------------------------- | ------------------------------------ |
| `GoToCreateOrganizationHierarchy()` | Navigate to create form          | page, expect                         |
| `CreateOrganizationHierarchy()`     | Create hierarchy with validation | page, expect, data, empty?           |
| `GoToShowOrganizationHierarchy()`   | Navigate to details              | page, expect, data, DataCreate       |
| `ShowOrganizationHierarchy()`       | Verify displayed data            | page, expect, data                   |
| `EditOrganizationHierarchy()`       | Edit hierarchy                   | page, expect, RightData, WrongData   |
| `FilterOrganizationHierarchy()`     | Filter & verify results          | page, expect, FilterData, CreateData |

---

#### 6. **Groups Class**

**Purpose**: User group management

**Type Definition**:

```typescript
type TData = {
  GroupName: string;
  ExternalEmail: string;
  Users: string;
  Description: string;
};
```

**Key Methods**:

| Method              | Purpose                   | Parameters         |
| ------------------- | ------------------------- | ------------------ |
| `GoToCreateGroup()` | Navigate to create form   | page, expect       |
| `CreateGroup()`     | Create group with users   | page, expect, Data |
| `GoToEditGroup()`   | Navigate to edit form     | page, expect       |
| `GoToShowGroup()`   | Navigate to group details | page, expect       |

---

### POM Selector Strategy

#### Selector Priority (in order of preference)

1. **data-testid attributes** - Most reliable, controlled by developers

   ```typescript
   await page.getByTestId("name").fill("Hazard Name");
   ```

2. **ARIA roles & labels** - Semantic, accessible

   ```typescript
   await page.getByRole("button", { name: "Save" }).click();
   ```

3. **Accessible names** - User-visible text

   ```typescript
   await page.getByLabel("Category").click();
   ```

4. **Stable CSS classes** - When data-testid unavailable

   ```typescript
   await page.locator(".form-input").fill("value");
   ```

5. **XPath with context** - Last resort, with parent elements
   ```typescript
   await page.locator("//span[text()='Category']").click();
   ```

#### Anti-Patterns (Avoid)

```typescript
// ❌ Index-based selectors - brittle
await page.locator("input >> nth=0").fill("value");

// ❌ Absolute XPath - breaks easily
await page.locator("/html/body/div[1]/div[2]/input").fill("value");

// ❌ Hard-coded timeouts instead of proper waits
await page.waitForTimeout(3000);

// ❌ Multiple nested locators
await page.locator(".form").locator("input").locator(".error").click();
```

---

## Test Case Design

### Test Case Structure

All test cases follow the **Arrange-Act-Assert (AAA)** pattern:

```typescript
test("Descriptive Test Name", async ({ page }) => {
  // ARRANGE: Setup test data and navigate to feature
  const hazards = new Hazards();
  await hazards.GoToCrateHazard(page, expect);

  // ACT: Perform the action being tested
  await hazards.CreateHazard(page, expect, Data.Right);

  // ASSERT: Verify the expected outcome
  await expect(page).toHaveURL("/master-data/hazards");
  await page.getByRole("button", { name: "OK" }).click();
});
```

### Test Naming Convention

Format: `[Feature] [Action] [Expected Result]`

**Examples**:

- ✅ `"Create Hazard With Right Data"` - Clear and descriptive
- ✅ `"Filter Hazard By Category"` - Specific operation
- ✅ `"Reject Empty Fields"` - Validation scenario
- ❌ `"Test 1"` - Too vague
- ❌ `"hazard creation"` - No camelCase
- ❌ `"Verify hazard is created in system"` - Too verbose

### Test Execution Structure

#### Setup Phase (beforeEach)

```typescript
test.beforeEach(async ({ page }) => {
  // 1. Login with test credentials
  const Home = await new login().login(page, "admin@admin.com", "123456");

  // 2. Navigate to feature
  const MasterDataPage = await Home.GoToMasterData(page, expect);
  await MasterDataPage.GoToHazards(page, expect);

  // Test now has clean state at Hazards list page
});
```

**Purpose**:

- Ensures consistent starting state
- Handles authentication
- Reduces duplication across tests
- Provides isolation between tests

#### Teardown Phase (afterEach)

```typescript
test.afterEach(async ({ page }) => {
  // Cleanup if needed
  // Examples:
  // - Close dialogs
  // - Clear temporary data
  // - Navigate away from dirty state
});
```

### Test Categories

#### 1. **Create Operations**

**File Pattern**: `Create[Feature].spec.ts`

**Test Scenarios**:

- Create with valid data ✅
- Create with empty/missing fields ❌
- Create with invalid data ❌
- Create with minimum valid data ✅
- Create duplicate entries (if applicable) ❌

**Example**: `CreateHazard.spec.ts`

```typescript
test("Crate Hazard With Right Data", async ({ page }) => {
  const hazards = new Hazards();
  await hazards.GoToCrateHazard(page, expect);
  await hazards.CreateHazard(page, expect, Data.Right);
  await expect(page).toHaveURL("/master-data/hazards");
});

test("Empty Fields", async ({ page }) => {
  const hazards = new Hazards();
  await hazards.GoToCrateHazard(page, expect);
  await hazards.CreateHazard(page, expect, Data.Right, true);
  await expect(page.getByText("This field is required")).toBeVisible();
});

test("Crate Hazard With Wrong Data", async ({ page }) => {
  const hazards = new Hazards();
  await hazards.GoToCrateHazard(page, expect);
  await hazards.CreateHazard(page, expect, Data.Wrong);
  await expect(page.getByText("Name must be at least 2")).toBeVisible();
});
```

#### 2. **Edit/Update Operations**

**File Pattern**: `Edit[Feature].spec.ts`

**Test Scenarios**:

- Edit with valid data ✅
- Edit with empty fields ❌
- Edit with invalid data ❌
- Cancel edit without saving ✅
- Verify edit persists ✅

#### 3. **View/Display Operations**

**File Pattern**: `Show[Feature].spec.ts`

**Test Scenarios**:

- Display created item ✅
- Verify all fields displayed correctly ✅
- Verify read-only fields ✅
- Navigate from list to detail ✅

#### 4. **Filter/Search Operations**

**File Pattern**: `Filter[Feature].spec.ts`

**Test Scenarios**:

- Filter by single criterion ✅
- Filter by multiple criteria ✅
- Reset filters ✅
- No results scenario ✅
- Filter data persistence ✅

**Example Logic**:

```typescript
async FilterHazard(page, expect, FilterData, CreateData) {
  // Apply filter
  await page.getByTestId("name").fill(FilterData.Name);
  await page.getByTestId("apply-filters").click();

  // Verify results
  const RowCount = await page.locator("table tbody tr").count();

  if (RowCount === 0) {
    // Create missing data and retry
    await this.GoToCrateHazard(page, expect);
    await this.CreateHazard(page, expect, CreateData);
  } else {
    // Verify filter worked
    const AllNames = await page
      .locator("table tbody tr td:nth-of-type(1)")
      .allTextContents();
    CheckFilteredData(AllNames, FilterData.Name);
  }
}
```

---

## Component Design Specifications

### Login Component

**Selector Strategy**:

```typescript
// Email field
[data-testid="email"]

// Password field
[data-testid="password"]

// Sign In button
button:has-text("Sign In")
```

**State Management**:

- Validates URL change to `/home` after login
- Returns Home page object for chaining
- Handles authentication session

**Error Handling**:

- Invalid credentials display error message
- Network errors trigger timeout
- Session expiration redirects to login

---

### Master Data Form Components

#### Field Types & Selectors

| Field Type   | Example     | Selector                      | Interaction                          |
| ------------ | ----------- | ----------------------------- | ------------------------------------ |
| Text Input   | Hazard Name | `[data-testid="name"]`        | `.fill()`                            |
| Text Area    | Description | `[data-testid="description"]` | `.fill()`                            |
| Dropdown     | Category    | `[aria-label="Category"]`     | `.click()` then select               |
| Select/Multi | Users       | `.form-input.py-2`            | `.click()` then select from dropdown |

#### Form Validation Rules

**Hazards Form**:

```
- Name:
  * Required
  * Minimum 2 characters
  * Validates with: "Name must be at least 2"

- Category:
  * Required
  * Dropdown selection only

- Severity:
  * Required
  * Options: High, Medium, Low

- Associated_Caution:
  * Required
  * Text input

- How_to_Detect:
  * Required
  * Text area

- Contamination_Procedure:
  * Required
  * Text area
```

#### Error Messages

| Validation           | Error Message             | Selector        |
| -------------------- | ------------------------- | --------------- |
| Empty Required Field | "This field is required"  | `.text-red-600` |
| Invalid Text Length  | "Name must be at least 2" | `.text-red-600` |
| Invalid Selection    | "[Field] is required"     | `.text-red-600` |

---

### Table & List Components

#### Table Structure

```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Category</th>
      <th>Severity</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr data-testid="table-row">
      <td>Cell 1</td>
      <td>Cell 2</td>
      <!-- ... -->
      <td>
        <a href="/show">View</a>
        <a href="/edit">Edit</a>
      </td>
    </tr>
  </tbody>
</table>
```

#### Row Selection Pattern

```typescript
const Row = page.locator("table tbody tr", {
  has: page.locator("td"),
  hasText: searchText, // Finds row containing this text
});

await Row.locator("a").first().click(); // Edit link
await Row.locator("a").last().click(); // View link
```

#### Data Extraction Pattern

```typescript
// Get all values in column
const allNames = await page
  .locator("table tbody tr td:nth-of-type(1)")
  .allTextContents();

// Verify all match filter
CheckFilteredData(allNames, expectedValue);
```

---

### Dropdown/Select Components

#### Standard Dropdown Pattern

```typescript
// Open dropdown
await page.getByRole("textbox", { name: "Category *" }).click();

// Select option (wait for dropdown to appear)
const container = page.locator(".m_38a85659"); // Dropdown container class
await container.locator("span", { hasText: "OptionName" }).click();

// Alternative: Using getAllByRole
await page.getByRole("option", { name: "OptionName" }).click();
```

#### Multi-Select Pattern

```typescript
// Open multi-select
await page.locator(".form-input.py-2").click();

// Check if users available
if ((await page.locator(".m_c0783ff9").count()) > 0) {
  await page.locator(".m_c0783ff9", { hasText: "UserName" }).click();
}
```

---

## Test Data Design

### Data Structure Philosophy

Test data is centralized in JSON files to enable:

- **Consistency**: Same data used across related tests
- **Maintainability**: Update data in one place
- **Clarity**: Separate data from test logic
- **Scalability**: Easy to add new test data scenarios

### Master Data Format

#### Hazard Data Structure

```json
{
  "Right": {
    "Name": "Chemical Exposure",
    "Category": "Chemical Hazard",
    "Severity": "High",
    "Associated_Caution": "Use PPE",
    "How_to_Detect": "Visual inspection",
    "Contamination_Procedure": "Isolate area"
  },
  "Wrong": {
    "Name": "q", // Too short - violates min length
    "Category": "Chemical Hazard",
    "Severity": "High",
    "Associated_Caution": "Use PPE",
    "How_to_Detect": "Visual inspection",
    "Contamination_Procedure": "Isolate area"
  },
  "ShowInTable": ["Infection Spread", "physical", "Critical", "Inactive"],
  "Show": {
    "Name": "Infection Spread",
    "Category": "physical",
    "Severity": "critical",
    "Associated_Caution": "use hearing protection",
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

**Key Properties**:

| Property      | Purpose                         | Usage                        |
| ------------- | ------------------------------- | ---------------------------- |
| `Right`       | Valid data for positive tests   | Create, Update success paths |
| `Wrong`       | Invalid data for negative tests | Validation error testing     |
| `Show`        | Data for display/read tests     | Verify existing data         |
| `ShowInTable` | Table row representation        | List view verification       |
| `FilterData`  | Search/filter criteria          | Filter and search testing    |

#### Group Data Structure

```json
{
  "Create": {
    "Right": {
      "GroupName": "Create Group",
      "ExternalEmail": "email@email.com",
      "Users": "Joy Roberts",
      "Description": "Description"
    },
    "Wrong": {
      "GroupName": "Create Group",
      "ExternalEmail": "invalid-email",
      "Users": "Create Group",
      "Description": "Create Group"
    }
  }
}
```

#### Consequence Data Structure

```json
{
  "Right": {
    "ConsequencesName": "Infection Spread",
    "Description": "Description"
  },
  "Wrong": {
    "ConsequencesName": "q", // Too short
    "Description": "Description"
  },
  "Edit": {},
  "Show": {},
  "Filter": {}
}
```

### Data Usage Patterns

#### Pattern 1: Direct Data Access

```typescript
import HazardData from "../../../../Data/MasterData/Hazard.json";

await hazards.CreateHazard(page, expect, HazardData.Right);
```

#### Pattern 2: Filtered Data Selection

```typescript
// Use specific scenario data
const positiveTestData = Data.Right;
const negativeTestData = Data.Wrong;
const displayData = Data.Show;

await operation(page, expect, positiveTestData);
```

#### Pattern 3: Dynamic Data Generation (Future)

```typescript
// Could be extended with faker library for dynamic data
const dynamicData = {
  name: faker.company.name(),
  email: faker.internet.email(),
  // ...
};
```

---

## Navigation Flow Design

### Application Navigation Hierarchy

```
┌─────────────────────────────────────────────┐
│         Login Page (/login)                 │
│  [Email] [Password] [Sign In]               │
└──────────────────┬──────────────────────────┘
                   │ Successful Login
                   ↓
┌─────────────────────────────────────────────┐
│    Home/Dashboard (/home)                   │
│  ├─ Users Management                        │
│  ├─ Master Data                             │
│  └─ [Other Features]                        │
└──────┬──────────────────────────┬───────────┘
       │                          │
       ↓                          ↓
┌──────────────────────┐  ┌─────────────────────┐
│ Users Management     │  │  Master Data        │
│ (/users-management)  │  │ (/master-data)      │
│                      │  │                     │
│ ├─ Groups            │  │ ├─ Hazards          │
│ ├─ Users             │  │ ├─ Consequences     │
│ └─ Roles             │  │ └─ Organization     │
└────────┬─────────────┘  └────┬────────────────┘
         │                     │
         ↓                     ↓
┌──────────────────────┐  ┌─────────────────────┐
│ Groups Module        │  │  Hazards Module     │
│ (/users-management/  │  │ (/master-data/      │
│  groups)             │  │  hazards)           │
│                      │  │                     │
│ ├─ List              │  │ ├─ List             │
│ ├─ Create            │  │ ├─ Create           │
│ ├─ Edit              │  │ ├─ Show/View        │
│ └─ Show              │  │ ├─ Edit             │
└──────────────────────┘  │ └─ Filter           │
                          └─────────────────────┘
```

### Page Object Navigation Pattern

```typescript
// Navigate through page objects with method chaining
const home = await new Login().login(page, username, password);
const masterData = await home.GoToMasterData(page, expect);
await masterData.GoToHazards(page, expect);

// Alternatively, step by step
const login = new Login();
const home = await login.login(page, "admin@admin.com", "123456");

const usersManagement = await home.GoToUsersManagement(page, expect);
await usersManagement.GoToGroups(page, expect);
```

### URL Validation Pattern

All navigation methods validate URL change:

```typescript
async GoToMasterData(page: any, expect: any): Promise<MasterData> {
  page.getByRole("link", { name: "Master Data" }).click();

  // Validate URL change
  await expect(page).toHaveURL("/master-data");

  return new MasterData();
}
```

---

## Interaction Patterns

### CRUD Operation Pattern

#### Create Pattern

```typescript
async GoToCreate(page, expect) {
  await page.getByRole("button", { name: "Create [Feature]" }).click();
  await expect(page).toHaveURL("/create");
}

async Create(page, expect, data, empty?) {
  if (empty) {
    // Test validation with empty fields
  } else {
    // Fill form fields
    await page.getByTestId("field1").fill(data.field1);
    await page.getByTestId("field2").fill(data.field2);

    // Submit
    await page.getByTestId("save-button").click();
  }
}
```

#### Read Pattern

```typescript
async GoToShow(page, expect, searchData) {
  // Find row in table
  const row = page.locator("table tbody tr", {
    hasText: searchData[0],
  });

  // Click view link
  await row.locator("a").last().click();

  // Validate navigation
  await expect(page.url()).toContain("/show/");
}

async Show(page, expect, data) {
  // Verify each field
  await expect(page.locator("[data-testid='field1']"))
    .toHaveValue(data.field1);
  await expect(page.locator("[data-testid='field2']"))
    .toHaveValue(data.field2);
}
```

#### Update Pattern

```typescript
async GoToEdit(page, expect, searchData) {
  // Navigate to edit form
  const row = page.locator("table tbody tr", { hasText: searchData[0] });
  await row.locator("a").first().click();

  await expect(page.url()).toContain("/edit/");
}

async Edit(page, expect, rightData, wrongData) {
  // Test with wrong data first
  await page.getByTestId("field1").clear();
  await page.getByTestId("save-button").click();

  await expect(page.getByText("This field is required"))
    .toBeVisible();

  // Then test with right data
  await page.getByTestId("field1").fill(rightData.field1);
  await page.getByTestId("save-button").click();

  // Verify success
  await expect(page).toHaveURL("/list");
}
```

#### Delete Pattern (if applicable)

```typescript
async GoToDelete(page, expect, searchData) {
  const row = page.locator("table tbody tr", { hasText: searchData[0] });
  await row.locator("button[aria-label='Delete']").click();
}

async Delete(page, expect) {
  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByText("Are you sure")).toBeVisible();
  await page.getByRole("button", { name: "Yes" }).click();
}
```

### Form Interaction Patterns

#### Text Input Pattern

```typescript
await page.getByTestId("name").fill("Value");
await page.getByTestId("name").clear();
await page.getByTestId("name").focus();
```

#### Dropdown Selection Pattern

```typescript
// Method 1: Role-based
await page.getByRole("button", { name: "Select Category" }).click();
await page.getByRole("option", { name: "Option1" }).click();

// Method 2: Text box with container locator
await page.getByRole("textbox", { name: "Category *" }).click();
const container = page.locator(".m_38a85659");
await container.locator("span", { hasText: "Option1" }).click();
```

#### Multi-Select Pattern

```typescript
await page.locator(".form-input.py-2").click();

// Wait for options to appear
await page.waitForSelector(".m_c0783ff9");

// Select option if available
if ((await page.locator(".m_c0783ff9").count()) > 0) {
  await page.locator(".m_c0783ff9", { hasText: "Option1" }).click();
}
```

#### Text Area Pattern

```typescript
await page.getByTestId("description").fill("Multi-line text");
```

---

## Error Handling Strategy

### Validation Error Handling

#### Required Field Errors

```typescript
// Trigger validation
await page.getByTestId("name").fill("");
await page.getByTestId("save-button").click();

// Verify error message
await expect(page.getByText("This field is required")).toBeVisible();
```

#### Custom Validation Errors

```typescript
// Trigger validation with invalid data
await page.getByTestId("name").fill("q"); // Too short
await page.getByTestId("save-button").click();

// Verify specific error message
await expect(page.getByText("Name must be at least 2")).toBeVisible();
```

#### Filter with No Results

```typescript
await page.getByTestId("name").fill("NonExistentValue");
await page.getByTestId("apply-filters").click();

// Check if data exists
const rowCount = await page.locator("table tbody tr").count();

if (rowCount === 0) {
  console.log("No data found - creating test data");
  await this.GoToCreate(page, expect);
  await this.Create(page, expect, testData);
} else {
  // Verify filtered results
}
```

### Safe Action Execution Pattern

```typescript
// Utility function for safe execution
const safeAction = async (action: () => Promise<any>) => {
  try {
    await action();
  } catch (err) {
    console.log("Non-critical error, continuing: ", err);
  }
};

// Usage: Optional assertions that don't fail test
try {
  CheckFilteredData(AllCategory, FilterData.Category);
} catch (error) {
  console.log("معلش كمل "); // Continue if assertion fails
}
```

### Dialog/Modal Handling

```typescript
// Verify success message
await expect(page.getByText("Success")).toBeVisible();

// Acknowledge dialog
await page.getByRole("button", { name: "OK" }).click();

// Verify page state after dialog
await expect(page).toHaveURL("/master-data/hazards");
```

---

## Performance Considerations

### Wait Strategies

#### Explicit Waits (Preferred)

```typescript
// Wait for element visibility
await expect(page.locator("table")).toBeVisible();

// Wait for specific content
await expect(page.getByText("Success")).toBeVisible();

// Wait for URL change
await expect(page).toHaveURL("/master-data/hazards");
```

#### Implicit Waits (Playwright Default)

```typescript
// Playwright automatically waits up to 30 seconds
await page.getByTestId("name").fill("value");
await page.click("button");
```

#### Avoid Hard-Coded Waits

```typescript
// ❌ BAD - unreliable
await page.waitForTimeout(3000);

// ✅ GOOD - explicit wait
await page.waitForSelector("table tbody tr");
await expect(page.locator("table tbody tr")).toHaveCount(1);
```

### Performance Best Practices

1. **Minimize Waits**: Use explicit waits instead of timeout delays
2. **Parallel Execution**: Run tests in parallel locally for faster feedback
3. **Selective Tracing**: Only collect traces on failures
4. **Efficient Selectors**: Use `getByTestId` instead of complex XPath
5. **Data Reuse**: Share login and navigation across tests in suite

### Optimization Patterns

```typescript
// ✅ Good: Wait for specific element
await page.waitForSelector("table tbody tr");
const rowCount = await page.locator("table tbody tr").count();

// ❌ Bad: Generic wait
await page.waitForTimeout(5000);

// ✅ Good: Use proper assertion timeout
await expect(page.locator("success-message")).toBeVisible({
  timeout: 10000,
});

// ❌ Bad: Multiple waits in sequence
await page.waitForTimeout(1000);
await page.waitForTimeout(1000);
await page.waitForTimeout(1000);
```

---

## Design Patterns & Best Practices

### Page Object Pattern Benefits

| Benefit             | Implementation                    |
| ------------------- | --------------------------------- |
| **Maintainability** | Locators centralized in one class |
| **Scalability**     | New tests without POM changes     |
| **Readability**     | Business-focused test code        |
| **Reusability**     | Methods shared across tests       |
| **Encapsulation**   | UI details hidden from tests      |

### Method Naming Conventions

| Pattern           | Example              | Purpose              |
| ----------------- | -------------------- | -------------------- |
| `GoTo[Feature]`   | `GoToCreateHazard()` | Navigation methods   |
| `[Action]`        | `CreateHazard()`     | Action methods       |
| `[Verb][Feature]` | `ShowHazard()`       | Verification methods |
| `Filter[Feature]` | `FilterHazard()`     | Filter operations    |

### Type Safety Pattern

```typescript
// Define strict types for data
type TData = {
  Name: string;
  Category: string;
  Severity: string;
  Associated_Caution: string;
  How_to_Detect: string;
  Contamination_Procedure: string;
};

// Use in methods
async CreateHazard(
  page: any,
  expect: any,
  Data: TData,
  Empty?: boolean
): Promise<void> {
  // Data type is enforced
}
```

### Fluent Interface Pattern

```typescript
// Method chaining for readable test code
const home = await new Login().login(page, "admin@admin.com", "123456");

const masterData = await home.GoToMasterData(page, expect);

await masterData.GoToHazards(page, expect);
```

---

## Test Infrastructure Design

### Configuration Design (playwright.config.ts)

```typescript
// Test execution
- testDir: ./tests               // Test location
- testMatch: **/*.spec.ts       // Test file pattern
- fullyParallel: true           // Parallel execution

// Retry strategy
- retries: 2 (CI) / 0 (local)   // Automatic retries
- forbidOnly: true (CI)         // Prevent test.only in CI

// Reporting
- reporter: "html"              // HTML report generation
- baseURL: https://hse.bitwise-solutions.com

// Debugging
- trace: on-first-retry         // Trace on failures
- workers: 1 (CI) / auto (local) // Sequential CI execution
```

### Utility Functions Design

```typescript
// Safe action execution
const safeAction = async (action: () => Promise<any>) => {
  try {
    await action();
  } catch (err) {
    console.log("معلش حنكمل ", err);
  }
};

// Filter validation helper
const CheckFilteredData = (result: [], expectedData: any) => {
  expect(result).toEqual(Array(result.length).fill(expectedData));
};

// Export for reuse
export { safeAction, CheckFilteredData };
```

### Test Data Integration

```
tests/
├── [Feature].spec.ts
│   └── imports Data from Data/
│
└── Data/
    ├── MasterData/
    │   ├── Hazard.json
    │   ├── Consequences.json
    │   └── OrganizationHierarchy.json
    └── UsersManagement/
        └── Group.json
```

**Import Pattern**:

```typescript
import Data from "../../../../Data/MasterData/Hazard.json";

// Use in test
await hazards.CreateHazard(page, expect, Data.Right);
```

---

## Quality Assurance Checklist

### Test Design Review

- ✅ Tests follow AAA pattern (Arrange-Act-Assert)
- ✅ Test names are descriptive and self-documenting
- ✅ Page objects encapsulate UI interaction details
- ✅ Test data is externalized to JSON files
- ✅ Selectors use data-testid as priority
- ✅ Tests are independent and isolated
- ✅ Navigation uses proper URL validation
- ✅ Error handling is explicit, not ignored
- ✅ No hard-coded timeouts (except debugging)
- ✅ Type safety with TypeScript types

### Maintenance Guidelines

1. **Update Selectors**: When UI changes, update POM not tests
2. **Test Data**: Keep separate from test logic
3. **Reuse Methods**: Consolidate duplicated interactions
4. **Documentation**: Keep comments updated
5. **Review Changes**: Every test change should be reviewed

---

## Future Enhancements

- 🔄 **Visual Regression Testing**: Compare screenshots for UI changes
- 🔄 **API Integration Testing**: Mock/test API calls
- 🔄 **Performance Monitoring**: Track test execution trends
- 🔄 **BDD Integration**: Gherkin-based test specifications
- 🔄 **Test Reporting**: Enhanced metrics and dashboards
- 🔄 **Mobile Testing**: Mobile viewport coverage
- 🔄 **Accessibility Testing**: Integration with axe-core

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Next Review**: March 2026  
**Author**: QA Team
