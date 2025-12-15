# Consequences Module – Test Design Document (TDD)

---

# 1. Purpose

Define the test design, high-level scenarios, and coverage scope for the **Consequences** module within HSE MasterData.

---

# 2. References

## 2.1 Test Documents

- MasterData Test Plan
- Consequences Flow Charts

## 2.2 Business / Requirements

- Consequences Stories (Zoho)

---

# 3. Module Overview

### 3.1 What is Consequences module?

The Consequences module allows users to create, edit, show, and filter Consequences records.  
It serves as a centralized repository for all Consequences definitions used across the HSE system.

---

### 3.2 What does it store?

Each Consequences record contains the following core fields:

- **Name** – The title of the Consequences.
- **Description** – The Description of the Consequences.

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

The Consequences module supports the following core functionalities:

- **Create** – Add new Consequences records with all required fields.
- **Edit** – Modify existing Consequences details.
- **View** – Navigates to a dedicated read‑only page showing all Consequences details, without allowing any edits.
- **Search by Name** – Search Consequences using partial or full name matching.
- **Search by Status** – View only active or inactive Consequences.
- **Pagination** – Navigate through large sets of Consequences records using paginated views.
- **Status Toggle** – Change Consequences status between Active and Inactive.
- **Validation** – Ensure required fields are filled and uniqueness rules are respected.
- **Error Handling** – Display system-standard error messages for invalid inputs or rule violations.

---

# 6. Test Scenarios

SC‑01 ✅ Create Consequences (Valid Data)

SC‑02 ✅ Create Consequences (Wrong Data)

SC‑03 ✅ Prevent Duplicate Consequences  
 ⬅️ لسه ما اتعملتش

SC‑04 ✅ Missing Required Fields

SC‑05 ✅ View Consequences (Read‑Only Page)
⬅️ لسه ما اتعملتش

SC‑06 ✅ Edit Consequences
⬅️ لسه ما اتعملتش

SC‑07–10 ✅ Search & Filters (Combined Test) - Filter by Name - Filter by Status ⬅️ لسه ما اتعملتش

SC‑11 Pagination
⬅️ لسه ما اتعملتش

SC‑12 ✅ Prevent Inactivation if Consequences is Used in Incident  
⬅️ لسه ما اتعملتش

SC‑13 ✅ Inactive Consequences Cannot Be Assigned to New Incident  
⬅️ لسه ما اتعملتش

---

# 7. Detailed Scenario Breakdown

### SC‑(01-04) – Add Consequence

**Objective:** Add Consequence

<!-- **Preconditions** -->

**Steps:** & **Expected Result:**

<img src="../Test%20Cases%20(Flow%20Charts)/Auto/Consequence/AddConsequence.drawio.png" width="900">

---

---

### SC‑(05-06) – Edit & Show Consequence

**Objective:** Edit & Show Consequence

<!-- **Preconditions** -->

**Steps:** & **Expected Result:**

<img src="../Test%20Cases%20(Flow%20Charts)/Auto/Consequence/Edite&ShowConsequence.drawio.png" width="900">

---

---

### SC‑07–10 – Consequences List Filter

**Objective:** Consequences List Filter

<!-- **Preconditions** -->

**Steps:** & **Expected Result:**

<img src="../Test%20Cases%20(Flow%20Charts)/Auto/Consequence/ConsequencesListFilter.drawio.png" width="900">

---

# 8. Business Rules

1. Name must be unique.
2. Required fields must be filled before saving.
3. Consequences cannot be deactivated if linked to incidents.
4. Inactive Consequences cannot be assigned to incidents.

---

# 9. Test Data

```json
  "Right": {
    "ConsequencesName": "Infection Spread",
    "Description": "Description"
  },

  "Empty": {
    "ConsequencesName": "",
    "Description": ""
  },

```

# 10. Error Messages

### 10.1 Required Field Errors

- This field is required.  
  (Name)

---

### 10.2 Business Rule Errors

- This Consequences already exists.  
  ⬅️ لسه متعملتش

- Cannot deactivate this Consequences because it is linked to incidents.  
  ⬅️ لسه متعملتش

- Inactive Consequences cannot be assigned to incidents.  
  ⬅️ لسه متعملتش

---

<!-- # 11. Assumptions

1. All required fields (Name) must be provided by the user before saving.
2. The Name must be unique across all Consequences.
3. Users have the necessary permissions to create, edit, and deactivate Consequences.
4. A Consequences cannot be deactivated if it is linked to existing incidents.
5. Inactive Consequences cannot be assigned to new incidents.
6. The system handles all backend validations and returns appropriate error messages.
7. Network stability and backend availability are assumed during Consequences creation and updates.
8. Pagination and filters are handled by the backend with consistent response times. -->
