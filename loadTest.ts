import http from "k6/http";
import { sleep, group } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 50 }, // بنطلع لـ 50 مستخدم في دقيقة
    { duration: "10m", target: 1000 }, // بنثبت الـ 50 مستخدم لمدة 10 دقائق (وقت تشغيل الأوتوميشن بتاعك)
    { duration: "1m", target: 0 }, // بننزل تدريجياً
  ],
};

export default function () {
  // محاكاة مستخدم بيفتح الصفحة الرئيسية
  group("Home Page", function () {
    http.get("https://your-website.com/");
  });

  sleep(2); // المستخدم بيقعد ثانيتين يتفرج

  // محاكاة مستخدم بيعمل بحث أو بيفتح صفحة منتجات
  group("Products Page", function () {
    http.get("https://your-website.com/products");
  });

  sleep(3); // وقت انتظار واقعي (Think Time)
}
