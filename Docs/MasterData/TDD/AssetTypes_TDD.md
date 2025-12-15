# Asset Types Module – Test Design Document (TDD)

---

# 1. Purpose

Define the test design, high-level scenarios, and coverage scope for the **Asset Types** module within HSE MasterData.

---

# 2. References

## 2.1 Test Documents

- MasterData Test Plan
- Asset Types Flow Charts

## 2.2 Business / Requirements

- Asset Types Stories (Zoho)

---

# 3. Module Overview

### 3.1 What is Asset Types module?

The Asset Types module allows users to create, edit and show Asset Type records.
It is used when creating a new asset to define and categorize its type

---

### 3.2 What does it store?

Each Asset Types record contains the following core fields:

- **Asset Types Name** – The title of the Asset Types.
- **Asset Types Description** – Description of the Asset Types.

<!-- ### 3.3 How is it used?

The Asset Typess module is maintained as part of the MasterData layer, where users can create, edit, and manage Asset Types records.

These Asset Typess are later used in other modules within the HSE system—specifically the **Incident module**, where users select a Asset Types from the predefined list created in MasterData. This ensures consistency, standardization, and accurate reporting across the system.

### 3.4 Any special logic?

- Asset Types Name + Category must be unique. Duplicate combinations are not allowed.
- Required fields: Name, Category, Severity, Associated Caution, Photo.
- Inactive Asset Typess cannot be assigned to new incidents but remain visible in historical records.
- Asset Typess cannot be marked as Inactive if they are currently linked to active incidents.
- No delete operation is allowed. Asset Typess can only be toggled between Active and Inactive. -->

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

The Description module supports the following core functionalities:

- **Create** – Add new Asset Types records with all required fields.
- **Edit** – Modify existing Asset Types details.
- **View** – Navigates to a dedicated read‑only page showing all Asset Types details, without allowing any edits.
- **Pagination** – Navigate through large sets of Asset Types records using paginated views.
- **Validation** – Ensure required fields are filled and uniqueness rules are respected.
- **Error Handling** – Display system-standard error messages for invalid inputs or rule violations.

---

## 6. Section 5 – Test Scenarios

SC‑01 ✅ Create Asset Types (Valid Data)

SC‑02 ✅ Create Asset Types (Wrong Data)

SC‑03 ✅ Prevent Duplicate Asset Types  
 ⬅️ لسه ما اتعملتش

SC‑04 ✅ Missing Required Fields

SC‑05 ✅ View Asset Types (Read‑Only Page)

SC‑06 ✅ Edit Asset Types

SC‑7 ⬅️ لسه ما اتعملتش  
 Pagination

SC‑8 ✅ Inactivation Asset Types Can't be used when creating new asset  
 ⬅️ لسه ما اتعملتش

---

# 7. Detailed Scenario Breakdown

### SC‑(01-04) – Create Asset Types

**Objective:** Create Asset Types

<!-- **Preconditions** -->

**Steps:** & **Expected Result:**

<img src="../Test%20Cases%20(Flow%20Charts)/Asset Types/CreateAssetType.drawio.png" width="900">

---

---

### SC‑(05-06) – Edit & Show Asset Types

**Objective:** Edit & Show Asset Types

<!-- **Preconditions** -->

**Steps:** & **Expected Result:**

<img src="../Test%20Cases%20(Flow%20Charts)/Asset Types//Edit&ShowAssetFilter.drawio.png" width="900">

---

# 8. Business Rules

1. Duplicate Asset Type Name
2. Required fields must be filled before saving.
3. Inactive Asset Type Cannot be assigned to new assets.

---

# 9. Test Data

```json
"Right": {
  "Name": "q",
  "Description": "Description",
},

"Empty": {
  "Name": "",
  "Description": "",
}

```

# 10. Error Messages

### 8.1 Required Field Errors

- This field is required.  
  (Name)

---

### 8.2 Business Rule Errors

- This Asset Types already exists.  
  ⬅️ لسه متعملتش

---

<!-- ## 11. Assumptions

1. All required fields (Name, Category, Severity, Associated Caution, Photo) must be provided by the user before saving.
2. The combination of Name + Category must be unique across all Asset Typess.
3. Severity values are predefined and provided by the system (e.g., Low, Medium, High).
4. Photo upload supports standard image formats only (e.g., JPG, PNG).
5. Users have the necessary permissions to create, edit, and deactivate Asset Typess.
6. A Asset Types cannot be deactivated if it is linked to existing incidents.
7. Inactive Asset Typess cannot be assigned to new incidents.
8. The system handles all backend validations and returns appropriate error messages.
9. Network stability and backend availability are assumed during Asset Types creation and updates.
10. Pagination and filters are handled by the backend with consistent response times. -->
