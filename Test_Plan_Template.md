# Comprehensive Test Plan Template

## 1. Project Information

-   **Project Name:** *اكتب اسم المشروع هنا*
-   **Release Version:** *اكتب رقم الإصدار هنا*
-   **Author:** *اسمك*
-   **Date:** *تاريخ كتابة الخطة*
-   **Approvers:** *اكتب أسماء الموافقين (PO / PM / QA Lead)*

------------------------------------------------------------------------

## 2. Scope

### In Scope

-   *اكتب ما سيتم اختباره*

### Out of Scope

-   *اكتب ما لن يتم اختباره*

------------------------------------------------------------------------

## 3. Test Objectives & Strategy

### Objectives

-   *اكتب أهداف عملية الاختبار (مثل الجودة، الاستقرار، الأداء...)*

### Strategy

-   *اشرح نهج الاختبار: Manual / Automation / CI/CD / API / UI*
-   *وضح أنواع الاختبارات المستخدمة ولماذا*

------------------------------------------------------------------------

## 4. Test Items

  Component          Description    Owner
  ------------------ -------------- ------------------
  *مثال: Checkout*   *اكتب الوصف*   *الفريق المسؤول*

------------------------------------------------------------------------

## 5. Test Types & Levels

-   **Unit Tests:** *اكتب ما يخصها*
-   **Integration Tests:** *اكتب ما يخصها*
-   **System Tests:** *اكتب ما يخصها*
-   **Regression:** *ما الذي سيتم اختباره في كل إصدار؟*
-   **performance Tests:** *هل يوجد اختبارات أداء؟*
-   **Security Tests:** *هل يتم اختبار الـ OWASP؟*

------------------------------------------------------------------------

## 6. Entry & Exit Criteria

### Entry Criteria

-   *ضع كل شروط بدء الاختبار*

### Exit Criteria

-   *ضع شروط قبول الإصدار والـ sign-off*

------------------------------------------------------------------------

## 7. Test Deliverables

-   Test Plan\
-   Test Cases\
-   Test Data\
-   Test Execution Reports\
-   Defect Reports\
-   Final Test Summary

------------------------------------------------------------------------

## 8. Schedule & Milestones

  Milestone               Date             Owner
  ----------------------- ---------------- ---------
  *مثال: Start Testing*   *اكتب التاريخ*   QA Lead

------------------------------------------------------------------------

## 9. Resources & Roles (RACI)

  Role            Name           Responsibility
  --------------- -------------- -------------------------------
  QA Lead         *اكتب الاسم*   Planning, execution overview
  Test Engineer   *اكتب الاسم*   Manual / automation execution

------------------------------------------------------------------------

## 10. Test Environment & Data

### Environments

-   *اكتب التست انفايرونمنت: dev / test / staging*

### Test Data

-   *اكتب مصادر الداتا، هل Production-like؟ هل فيها anonymization؟*

------------------------------------------------------------------------

## 11. Tools & Automation Strategy

### Tools Used

-   **Test Management:** *TestRail / Jira*
-   **Automation:** *Playwright / Cypress*
-   **CI/CD:** *GitHub Actions / Jenkins*

### Automation Scope

-   *اكتب ما سيتم عمله Automation*
-   *وما سيتم اختباره يدويًا*

------------------------------------------------------------------------

## 12. Risk Management

  Risk                           Probability   Impact   Mitigation
  ------------------------------ ------------- -------- -------------------
  *مثال: Unstable environment*   High          High     Add health checks

------------------------------------------------------------------------

## 13. Defect Management

### Severity Levels

-   **Sev1:** *عرفه*
-   **Sev2:** *عرفه*
-   **Sev3:** *عرفه*

### Workflow

-   Open → Triaged → In Progress → Fixed → Verified → Closed

------------------------------------------------------------------------

## 14. Test Estimation

-   *اكتب طريقة الحساب (No. of test cases × avg time)*\
-   *ضع الجدول النهائي*

------------------------------------------------------------------------

## 15. Traceability Matrix (RTM)

  Requirement ID   Test Case ID   Status
  ---------------- -------------- --------
  *REQ-001*        *TC-001*       Ready

------------------------------------------------------------------------

## 16. Reporting & KPIs

-   Pass/Fail rate\
-   Defect density\
-   Regression coverage\
-   Automation coverage

------------------------------------------------------------------------

## 17. Approval & Sign-off

  Role      Name           Signature   Date
  --------- -------------- ----------- ---------
  PO        *اكتب الاسم*   *توقيع*     *تاريخ*
  QA Lead   *اسم*          *توقيع*     *تاريخ*

------------------------------------------------------------------------

> **Note:** كل عنوان تحته Placeholder جاهز تكتب فيه المحتوى حسب المشروع
> بتاعك.
