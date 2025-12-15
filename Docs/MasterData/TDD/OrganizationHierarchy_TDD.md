# Organization Hierarchy Module – Test Design Document (TDD)

---

# 1. Purpose

Define the test design, high-level scenarios, and coverage scope for the **Organization Hierarchy** module within HSE MasterData.

---

# 2. References

## 2.1 Test Documents

- MasterData Test Plan
- Organization Hierarchy Flow Charts

## 2.2 Business / Requirements

- Organization Hierarchy Stories (Zoho)

---

# 3. Module Overview

### 3.1 What is Organization Hierarchy module?

The Organization Hierarchy module allows users to create, edit, show, and filter Organization Hierarchy records.  
It serves as a centralized repository for all Organization Hierarchy definitions used across the HSE system.

---

### 3.2 What does it store?

Each Organization Hierarchy record contains the following core fields:

- **Level ID**: A unique identifier for the organizational hierarchy level.
- **Level Name**: The name or title of the hierarchy level (e.g., Manager, Supervisor).
- **Position**: The job role or position associated with this level.
- **Report_To**: Indicates who this position reports to (e.g., the direct manager or supervisor).
- **Description**: A brief description of the responsibilities or purpose of this level in the organization.

---

# 4. Entry & Exit Criteria

## Entry Criteria

- Stable Test Environment
- Valid build delivered
- Requirements reviewed and clear
- Test Data prepared
- Tools ready
- Required user permissions available

## Exit Criteria

- All planned Test Cases executed
- All Critical & High defects resolved
- Acceptable pass rate achieved
- Test Summary Report delivered

---

# 5. Functional Areas

The Organization Hierarchy module supports the following core functionalities:

- **Create** – Add new Organization Hierarchy records with all required fields.
- **Edit** – Modify existing Organization Hierarchy details.
- **View** – Navigates to a dedicated read‑only page showing all Organization Hierarchy details, without allowing any edits.
- **Search by Level ID** – Search Organization Hierarchy using partial or full name matching.
- **Search by Position Name** – Search Organization Hierarchy using partial or full name matching.
- **Search by Reports To Developer** – Search Organization Hierarchy using partial or full name matching.
- **Search by Status** – View only active or inactive Organization Hierarchy.
- **Pagination** – Navigate through large sets of Organization Hierarchy records using paginated views.
- **Status Toggle** – Change Organization Hierarchy status between Active and Inactive.
- **Validation** – Ensure required fields are filled and uniqueness rules are respected.
- **Error Handling** – Display system-standard error messages for invalid inputs or rule violations.

---

# 6. Test Scenarios

SC‑01 ✅ Create Organization Hierarchy (Valid Data)

SC‑02 ✅ Create Organization Hierarchy (Wrong Data)

SC‑03 ✅ Prevent Duplicate Organization Hierarchy  
 ⬅️ لسه ما اتعملتش

SC‑04 ✅ Missing Required Fields

SC‑05 ✅ View Organization Hierarchy (Read‑Only Page)
⬅️ لسه ما اتعملتش

SC‑06 ✅ Edit Organization Hierarchy
⬅️ لسه ما اتعملتش

SC‑07–10 ✅ Search & Filters (Combined Test) - Search by Level ID - Filter by Position Name - Filter by Reports To Developer - Filter by Status ⬅️ لسه ما اتعملتش

SC‑11 Pagination
⬅️ لسه ما اتعملتش

SC‑12 ✅ Prevent Inactivation if Organization Hierarchy is Used in Incident  
⬅️ لسه ما اتعملتش

SC‑13 ✅ Inactive Organization Hierarchy Cannot Be Assigned to New Incident  
⬅️ لسه ما اتعملتش

---

# 7. Detailed Scenario Breakdown

### SC‑(01-04) – Create Hierarchy

**Objective:** Create Organization Hierarchy

<!-- **Preconditions** -->

**Steps:** & **Expected Result:**

<img src="../Test%20Cases%20(Flow%20Charts)/Auto/Organization Hierarchy/CreateHierarchy.drawio.png" width="900">

---

---

### SC‑(05-06) – Edit & Show Organization Hierarchy

**Objective:** Edit & Show Organization Hierarchy

<!-- **Preconditions** -->

**Steps:** & **Expected Result:**

<img src="../Test%20Cases%20(Flow%20Charts)/Auto/Organization Hierarchy/Edit&ShowHierarchy.drawio.png" width="900">

---

---

### SC‑07–10 – Organization Hierarchy List Filter

**Objective:** Organization Hierarchy List Filter

<!-- **Preconditions** -->

**Steps:** & **Expected Result:**

<img src="../Test%20Cases%20(Flow%20Charts)/Auto/Organization Hierarchy/HierarchyListFilter.drawio.png" width="900">

---

# 8. Business Rules

1. Circular hierarchies are not allowed (e.g., Manager reports to Officer).
2. Duplicate level are not allowed
3. “Reports To” position must exist and be active.
4. Default top level (L1) has no parent.
5. Required fields must be filled before saving.
6. Inactive levels are excluded from new user assignments but remain for history.
7. Positions are linked to Personnel Information via “Position” field.

---

# 9. Test Data

```json
"Empty": {
    "LevelID": "",
    "LevelName": "",
    "Position": "",
    "ReportsTo": "",
    "Description": ""
  },
  "Right": {
    "LevelID": "L1",
    "LevelName": "LevelName",
    "Position": "tester",
    "ReportsTo": "developer",
    "Description": "Description"
  },
  "Wrong": {
    "LevelID": "L2",
    "LevelName": "LevelName",
    "Position": "tester",
    "ReportsTo": "tester",
    "Description": "Description"
  },

```

# 10. Error Messages

### 10.1 Required Field Errors

- This field is required.  
  (Level ID, Name , Position , Reports To)

---

### 10.2 Business Rule Errors

- This Hierarchy Level already exists.  
  ⬅️ لسه متعملتش

---

<!-- # 11. Assumptions

1. All required fields ( Name , Position , Reports To ) must be provided by the user before saving.
3. Users have the necessary permissions to create, edit, and deactivate Organization Hierarchy.
6. The system handles all backend validations and returns appropriate error messages.
7. Network stability and backend availability are assumed during Organization Hierarchy creation and updates.
8. Pagination and filters are handled by the backend with consistent response times. -->
