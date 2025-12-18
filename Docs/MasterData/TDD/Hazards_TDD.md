# Hazards Module – Test Design Document (TDD)

---

# 1. Purpose

Define the test design, high-level scenarios, and coverage scope for the **Hazards** module within HSE MasterData.

---

# 2. References

## 2.1 Test Documents

- MasterData Test Plan
- Hazards Flow Charts

## 2.2 Business / Requirements

- Hazards Stories (Zoho)

---

# 3. Module Overview

### 3.1 What is Hazards module?

The Hazards module allows users to create, edit, show, and filter hazard records.  
It serves as a centralized repository for all hazard definitions used across the HSE system.

---

### 3.2 What does it store?

Each hazard record contains the following core fields:

- **Name** – The title of the hazard.
- **Category** – The classification the hazard belongs to.
- **Severity** – The risk level associated with the hazard.
- **Associated Caution** – The safety warning linked to the hazard.
- **How To Detect** – Instructions on how to identify the hazard.
- **Contamination Procedure** – Steps to follow in case of contamination or exposure.
- **Photo** – An image representing the hazard, used for visual identification and documentation.

<!-- ### 3.3 How is it used?

The Hazards module is maintained as part of the MasterData layer, where users can create, edit, and manage hazard records.

These hazards are later used in other modules within the HSE system—specifically the **Incident module**, where users select a hazard from the predefined list created in MasterData. This ensures consistency, standardization, and accurate reporting across the system.

### 3.4 Any special logic?

- Hazard Name + Category must be unique. Duplicate combinations are not allowed.
- Required fields: Name, Category, Severity, Associated Caution, Photo.
- Inactive hazards cannot be assigned to new incidents but remain visible in historical records.
- Hazards cannot be marked as Inactive if they are currently linked to active incidents.
- No delete operation is allowed. Hazards can only be toggled between Active and Inactive. -->

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

The Hazards module supports the following core functionalities:

- **Create** – Add new hazard records with all required fields and photo attachment.
- **Edit** – Modify existing hazard details.
- **View** – Navigates to a dedicated read‑only page showing all hazard details, including the photo, without allowing any edits.
- **Search by Name** – Search hazards using partial or full name matching.
- **Filter by category** – Filter hazard records based on their assigned category.
- **Filter by Severity** – Filter hazard records based on their assigned Severity.
- **Filter by Status** – View only active or inactive hazards.
- **Pagination** – Navigate through large sets of hazard records using paginated views.
- **Status Toggle** – Change hazard status between Active and Inactive.
- **Validation** – Ensure required fields are filled and uniqueness rules are respected.
- **Error Handling** – Display system-standard error messages for invalid inputs or rule violations.

---

## 6. Section 5 – Test Scenarios

SC‑01 ✅ Create Hazard (Valid Data)

SC‑02 ✅ Create Hazard (Wrong Data)

SC‑03 ✅ Prevent Duplicate Hazard  
 ⬅️ لسه ما اتعملتش

SC‑04 ✅ Missing Required Fields

SC‑05 ✅ View Hazard (Read‑Only Page)

SC‑06 ✅ Edit Hazard

SC‑07–10 ✅ Search & Filters (Combined Test) - Search by Name - Filter by Category - Filter by Severity - Filter by Status

SC‑11 ⬅️ لسه ما اتعملتش  
 Pagination

SC‑12 ✅ Prevent Inactivation if Hazard is Used in Incident  
 ⬅️ لسه ما اتعملتش

SC‑13 ✅ Inactive Hazard Cannot Be Assigned to New Incident  
 ⬅️ لسه ما اتعملتش

---

# 7. Detailed Scenario Breakdown

### SC‑(01-04) – Create Hazard

**Objective:** Create Hazard

<!-- **Preconditions** -->

**Steps:** & **Expected Result:**

<img src="../Test%20Cases%20(Flow%20Charts)/Auto/Hazard//CreateHazard.drawio.png" width="900">

---

---

### SC‑(05-06) – Edit & Show Hazard

**Objective:** Edit & Show Hazard

<!-- **Preconditions** -->

**Steps:** & **Expected Result:**

<img src="../Test%20Cases%20(Flow%20Charts)/Auto/Hazard/Edit&ShowHazard.drawio.png" width="900">

---

---

### SC‑07–10 – Hazards List Filter

**Objective:** Hazards List Filter

<!-- **Preconditions** -->

**Steps:** & **Expected Result:**

<img src="../Test%20Cases%20(Flow%20Charts)/Auto/Hazard/HazardsFilter.drawio.png" width="900">

---

# 8. Business Rules

1. Name + Category must be unique.
2. Required fields must be filled before saving.
3. Hazard cannot be deactivated if linked to incidents.
4. Inactive hazards cannot be assigned to incidents.
5. Severity must be selected from predefined values.
6. Photo must be a valid image format.

---

# 9. Test Data

```json
"Right": {
  "Name": "qqqq",
  "Category": "tester",
  "Severity": "High",
  "Associated_Caution": "ss",
  "How_to_Detect": "qqq",
  "Contamination_Procedure": "qqqq",
  "Photo": "valid_image.jpg"
},

"Wrong": {
  "Name": "q",
  "Category": "tester",
  "Severity": "High",
  "Associated_Caution": "ss",
  "How_to_Detect": "qqq",
  "Contamination_Procedure": "qqqq",
  "Photo": null
},

"Empty": {
  "Name": "",
  "Category": "",
  "Severity": "",
  "Associated_Caution": "",
  "How_to_Detect": "",
  "Contamination_Procedure": "",
  "Photo": ""
}

```

# 10. Error Messages

### 8.1 Required Field Errors

- This field is required.  
  (Name, Category, Severity, Associated Caution, Photo)

---

### 8.2 Validation Errors

- Name must be at least 2 characters.

---

### 8.3 Business Rule Errors

- This hazard already exists.  
  ⬅️ لسه متعملتش

- Cannot deactivate this hazard because it is linked to incidents.  
  ⬅️ لسه متعملتش

- Inactive hazards cannot be assigned to incidents.  
  ⬅️ لسه متعملتش

---

<!-- ## 11. Assumptions

1. All required fields (Name, Category, Severity, Associated Caution, Photo) must be provided by the user before saving.
2. The combination of Name + Category must be unique across all hazards.
3. Severity values are predefined and provided by the system (e.g., Low, Medium, High).
4. Photo upload supports standard image formats only (e.g., JPG, PNG).
5. Users have the necessary permissions to create, edit, and deactivate hazards.
6. A hazard cannot be deactivated if it is linked to existing incidents.
7. Inactive hazards cannot be assigned to new incidents.
8. The system handles all backend validations and returns appropriate error messages.
9. Network stability and backend availability are assumed during hazard creation and updates.
10. Pagination and filters are handled by the backend with consistent response times. -->
