# Automation Test Plan (وفق معايير ISTQB)

> **الغرض من الوثيقة**: هذه الوثيقة تُستخدم لوصف استراتيجية وخطة اختبار الأتمتة (Automation Testing) للمشروع، بما يتوافق مع معايير **ISTQB**، وتُعد مرجعًا رسميًا لفريق الـ QA، المطورين، والإدارة.

---

## 1. Introduction (المقدمة)

### **1.1 Purpose**

The purpose of this document is to define the automation strategy, scope, architecture, and execution approach for the MasterData modules. It ensures consistency, maintainability, and audit‑ready traceability across all automated tests.

---

## **1.3 Scope**

### **In‑Scope**

#### **Test Levels**

- End‑to‑End (E2E)

#### **Test Types**

- Functional Testing

#### **Modules**

- Hazard
- Cause
- Consequence
- Root Cause Analysis
- Severity Matrix
- Classifications
- TaskAnalysis
- Sites
- Organization Hierarchy

#### **Environment**

- Testing environment only

#### **Browsers**

- Chrome
- Safari
- Firefox

---

### **Out‑of‑Scope**

#### **Test Types Not Covered**

1. Performance Testing
2. Load Testing
3. Security Testing
4. Mobile Native App Testing

#### **Modules Not Covered**

- non Master Data Modules .

#### **Browsers Not Covered**

Any browser other than Chrome, Safari, and Firefox  
(e.g., Edge, IE, Opera, mobile browsers)

---

## 2. Test Automation Objectives (أهداف الأتمتة)

- Establish a clear and scalable automation framework
- Ensure functional and E2E coverage for MasterData modules
- Improve testing efficiency and reduce regression time

---

## 3. Test Items

The following test items are included in the automation testing scope:

- Master Data Module
- Hazard
- Cause
- Consequence
- Root Cause Analysis
- Severity Matrix
- Classifications
- TaskAnalysis
- Sites
- Organization Hierarchy

---

## 4. Automation Test Strategy (استراتيجية الأتمتة)

### 4.1 Automation Approach

A Data Driven Automation Framework is used for this project.

- Test data is maintained in external JSON files.
- Currently, the test data is static
- The framework is designed to support future enhancements for dynamic or multiple datasets.

---

### 4.2 Test Levels Covered

The following test level is currently covered by automation:

- **Functional Automation** to validate core business functionalities and ensure the system meets specified requirements.

Other test levels such as **Smoke**, **Regression**, and **API Automation** are planned for future phases.

<!-- ---

### 4.3 Test Design Techniques

The following test design technique is identified for this project:

- **Equivalence Partitioning**: Planned to group input data into valid and invalid partitions to optimize test coverage.

> **Note:** This technique has not been implemented yet and will be applied in future test case design activities. -->

---

## 5. Automation Tools & Technologies (الأدوات والتقنيات)

**اكتب هنا:**

- Automation Tool: Playwright
- Programming Language: JavaScript
- Build Tool: npm
- Version Control: (Git)

---

## 6. Test Environment (بيئة الاختبار)

- Environments:

  - Testing

- Browsers:

  - Chrome
  - Firefox
  - Safari

- OS:

  - Windows

---

## 7. Automation Framework Design (تصميم إطار الأتمتة)

7.1 Framework Architecture

**Structure of the framework:**

الفريمورك مبني بأسلوب **Basic POM (Functions Only)**، وده بيخليه بسيط، واضح، وسهل لأي حد في الفريق يشتغل عليه.

الهيكل الأساسي:/tests /pages /utils /data /config /reports

**شرح المجلدات:**

- **/tests**  
  يحتوي على جميع التستات، منظمة حسب الـ Module والـ CRUD.

- **/pages**  
  يحتوي على Page Functions الخاصة بكل Module، وتشمل:

  - Navigation
  - Actions
  - Validations (اختياري)

- **/utils**  
  يحتوي على:

  - Validation Helpers
  - Skip Error Helpers

- **/data**  
  يحتوي على Test Data (Static الآن).

- **/config**  
  يحتوي على إعدادات Playwright.

- **/reports**  
  يحتوي على:
  - HTML Reports

**Layers (Test Layer, Business Layer, Utility Layer):**

- **Test Layer**

  - موجود داخل `/tests`
  - يحتوي على التستات نفسها
  - كل Test يستدعي Page Functions مباشرة
  - Naming بسيط وواضح (Create Hazard, Edit Hazard…)

- **Business Layer (داخل Pages)**

  - مفيش Layer منفصل
  - كل Module ليه ملف Page Functions خاص بيه
  - كل Function تحتوي على:
    - Locators
    - Navigation
    - Actions
    - Optional Assertions

- **Utility Layer**
  - موجود داخل `/utils`
  - يحتوي على:
    - Validation Helpers
    - Skip Error Helpers
  - بيستخدم داخل Pages أو Tests حسب الحاجة

---

## 8. Test Data Management (إدارة بيانات الاختبار)

**اكتب هنا:**

- مصدر البيانات (Excel, JSON, DB).
- كيفية إنشاء وتحديث بيانات الاختبار.
- Data Reset Strategy.

---

## 9. Test Execution Plan (خطة التنفيذ)

**اكتب هنا:**

- Execution frequency ( Per Build ).

---

## 10. Defect Management (إدارة العيوب)

**اكتب هنا:**

- Tool
  - Zoho
- Defect Life Cycle
  - New
  - Assigned
  - In Progress
  - Fixed
  - Retest
  - Closed
- Severity & Priority definitions
  - Critical: <Definition>
  - High: <Definition>
  - Medium: <Definition>
  - Low: <Definition>

---

## 11. Reporting & Metrics (التقارير والمؤشرات)

**اكتب هنا:**

- Execution Reports.
- Pass/Fail Rate.
- Automation Coverage.
- Defect Leakage.

---
