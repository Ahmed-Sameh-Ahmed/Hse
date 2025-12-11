# 📄 Test Plan – Incident Module
## 1️⃣ Incident – Initial Information Page
### A. Scope

اختبار جميع الحقول الخاصة بالمعلومات الأولية للإنسيدنت وتشمل:

Shift

Incident Date & Time

Reported By

Reported At

Created At

Onsite/Offsite

Location URL

Department

Description

Attachments

### B. Test Objectives

التأكد من صحة الـ validations.

التأكد من عمل كل أنواع الحقول بشكل سليم.

اختبار حفظ البيانات من خلال الـ API.

اختبار الـ UX وسلوك المكونات.

اختبار رفع الملفات ومعاينتها.

### C. Functional Test Scenarios
#### 1. Shift Dropdown

التأكد من ظهور كل الخيارات.

التأكد من حفظ القيمة في الـ API.

التأكد من منع إرسال النموذج بدون اختيار (إن كان Required).

#### 2. Incident Date & Time

اختيار تاريخ صحيح.

منع اختيار تاريخ مستقبلي (حسب الـ rule).

التأكد من format التاريخ.

مقارنة Incident date مع Reported At (reported ≥ incident).

#### 3. Reported By

التأكد من عمل الـ autocomplete أو الـ dropdown.

رفض أي ID غير موجود.

التأكد من حفظ reported_by_id.

#### 4. Reported At

رفض timestamps مستقبلية.

التأكد من timezone الصحيح.

التأكد من consistency مع incident date.

#### 5. Created At

التأكد من الـ autofill (إن كان النظام يملأه تلقائيًا).

التأكد من صحة الـ format.

#### 6. Onsite / Offsite

Offsite → Location URL يصبح Required.

Onsite → Department يصبح Required.

حفظ نوع الموقع location_type بشكل صحيح.

#### 7. Location URL

قبول روابط صحيحة فقط.

رفض أي نص غير URL.

فتح الرابط في نافذة جديدة.

#### 8. Department

ظهور الأقسام المناسبة حسب صلاحية المستخدم.

رفض أي قسم غير موجود.

التأكد من حفظ department_id صحيح.

#### 9. Description

الحد الأدنى والأقصى للنص.

منع إدخال JavaScript (XSS).

الحفاظ على التنسيق النصي.

#### 10. Attachments (Image / Video)

قبول أنواع ملفات: jpg/png/mp4 …

رفض ملفات غير مسموحة.

التحقق من الحد الأقصى للحجم.

عرض preview للملفات.

إمكانية حذف الملفات.

دعم تعدد الملفات Multi-upload.

### D. Negative Test Cases

إرسال النموذج بدون required fields.

إدخال تاريخ بصيغة خاطئة.

إدخال XSS مثل:

<script>alert(1)</script>


رفع ملف exe.

Location URL غير صحيح.

Reported At أقدم من Incident Date بشكل غير منطقي.

### E. UX/UI Tests

محاذاة الحقول بشكل consistent.

رسائل الخطأ تظهر أسفل الحقول بشكل واضح.

التأكد من الأيقونات والـ spacing.

التأكد من الاستجابة Responsive Behavior.

### F. API Integration Tests

Request Body المتوقع:

{
  "incident_date": "2025-01-01 10:30",
  "reported_by_id": 101,
  "reported_at": "2025-01-01 11:00",
  "created_at": "2025-01-01 12:00",
  "location_type": "onsite",
  "location_url": "https://google.com/maps",
  "department_id": 3,
  "description": "Forklift struck barrier",
  "attachments": []
}


Responses المتوقعة:

200/201 عند نجاح الحفظ

422 عند وجود أخطاء Validation

## 2️⃣ Incident Assessment Page
