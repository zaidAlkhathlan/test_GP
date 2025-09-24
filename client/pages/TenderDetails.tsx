import React from "react";
import { Link, useParams } from "react-router-dom";

export default function TenderDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-[900px] mx-auto px-6">
        <div className="bg-white rounded-lg shadow p-6" dir="rtl">
          <div className="flex items-center justify-between mb-4">
            <div className="text-right">
              <h2 className="text-xl font-semibold text-green-700">متابعة حالة المناقصة</h2>
              <p className="text-sm text-gray-500">تتبع حالة المناقصة ومتابعة التحديثات</p>
            </div>
            <div>
              <button className="bg-tawreed-green text-white px-3 py-1 rounded">العروض المقدمة</button>
            </div>
          </div>

          {/* Tender summary box */}
          <div className="bg-white border rounded p-4 mb-6">
            <div className="flex justify-between items-start gap-4">
              <div className="text-right flex-1">
                <h3 className="font-semibold text-lg">بناء ورشة سيارات</h3>
                <p className="text-sm text-gray-500">مؤسسة بناء المنشآت</p>
              </div>
              <div className="w-40 text-left">
                <div className="bg-green-50 p-3 rounded text-center">15</div>
                <p className="text-xs text-gray-500 mt-2">موعد انتهاء التقديم</p>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded p-4 text-right shadow">
              <p className="text-xs text-gray-500">الأيام المتبقية</p>
              <p className="text-xl font-bold text-tawreed-green">15</p>
            </div>
            <div className="bg-white rounded p-4 text-right shadow">
              <p className="text-xs text-gray-500">العروض المقدمة</p>
              <p className="text-xl font-bold">8</p>
            </div>
            <div className="bg-white rounded p-4 text-right shadow">
              <p className="text-xs text-gray-500">عدد الزيارات</p>
              <p className="text-xl font-bold">12</p>
            </div>
            <div className="bg-white rounded p-4 text-right shadow">
              <p className="text-xs text-gray-500">حالة المناقصة</p>
              <p className="text-xl font-bold text-green-600">مفتوحة</p>
            </div>
          </div>

          {/* Activities and description */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded p-4 mb-4 shadow">
                <h4 className="font-semibold text-right">الأنشطة الأخيرة</h4>
                <div className="mt-3 space-y-3">
                  <div className="p-3 bg-gray-50 rounded">لا يوجد أي نشاط جديد</div>
                </div>
              </div>

              <div className="bg-white rounded p-6 mb-4 shadow">
                <h4 className="font-semibold text-right">وصف المناقصة</h4>
                <p className="text-sm text-gray-600 mt-2">يهدف هذا المشروع إلى إنشاء ورشة متخصصة في السيارات الثقيلة...</p>
              </div>

              <div className="bg-white rounded p-6 mb-4 shadow">
                <h4 className="font-semibold text-right">المتطلبات الفنية</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                  <li>خبرة 10 سنوات في مشاريع مماثلة</li>
                  <li>استخدام مواد عالية الجودة</li>
                </ul>
              </div>

              <div className="bg-white rounded p-6 mb-4 shadow">
                <h4 className="font-semibold text-right">المتطلبات المالية</h4>
                <p className="text-sm text-gray-600">تفاصيل الشروط المالية هنا</p>
              </div>

              <div className="bg-white rounded p-6 mb-4 shadow">
                <h4 className="font-semibold text-right">التراخيص المطلوبة</h4>
                <p className="text-sm text-gray-600">قائمة التراخيص المطلوبة</p>
              </div>
            </div>

            <div>
              <div className="bg-white rounded p-4 shadow">
                <h5 className="font-semibold text-right">ملفات المناقصة المرفقة</h5>
                <div className="mt-3 space-y-3">
                  <div className="p-3 border rounded">ملف 1</div>
                  <div className="p-3 border rounded">ملف 2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
