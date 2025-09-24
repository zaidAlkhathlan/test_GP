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
              <Link to={id ? `/tender/${id}/offers` : '#'} className="inline-flex items-center gap-2 px-3 py-1 bg-tawreed-green text-white rounded">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M3 7h18M7 11h10M9 15h6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                العروض المقدمة
              </Link>
            </div>
          </div>

          {/* Tender summary box with badges and fields */}
          <div className="bg-white border rounded p-4 mb-6" dir="rtl">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
              <div className="text-right flex-1">
                <h3 className="font-semibold text-lg">بناء ورشة سيارات</h3>
                <p className="text-sm text-gray-500">مؤسسة بناء المنشآت</p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-xs text-gray-500">رقم المرجع</p>
                    <p className="text-sm font-medium">#25073901054</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-xs text-gray-500">تاريخ النشر</p>
                    <p className="text-sm font-medium">2025-08-01</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-xs text-gray-500">تاريخ الانتهاء</p>
                    <p className="text-sm font-medium">2025-08-04</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded border">
                    <p className="text-xs text-gray-500">ميزانية المناقصة</p>
                    <p className="text-sm font-medium">1000 ريال</p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-64 text-right">
                <div className="flex items-center gap-3 mb-3 justify-end">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center border">15</div>
                  <div className="text-sm text-gray-600">موعد انتهاء التقديم</div>
                </div>

                <div className="flex items-center gap-2 mb-3 justify-end">
                  <Link to={id ? `/tender/${id}/offers` : '#'} className="inline-flex items-center gap-2 px-3 py-1 bg-tawreed-green text-white rounded">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M3 7h18M7 11h10M9 15h6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    العروض المقدمة
                  </Link>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">8</span>
                </div>

                <div className="flex gap-2 flex-wrap justify-end">
                  <span className="px-3 py-1 bg-green-100 text-sm text-green-800 rounded-full">مقاولات</span>
                  <span className="px-3 py-1 bg-green-100 text-sm text-green-800 rounded-full">ترميم</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stat cards - 3 cards like BuyerHome */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded p-4 text-right shadow flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">📅</div>
              <div>
                <p className="text-xs text-gray-500">الأيام المتبقية</p>
                <p className="text-xl font-bold text-tawreed-green">15</p>
              </div>
            </div>
            <div className="bg-white rounded p-4 text-right shadow flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center text-2xl">📄</div>
              <div>
                <p className="text-xs text-gray-500">العروض المقدمة</p>
                <p className="text-xl font-bold">8</p>
              </div>
            </div>
            <div className="bg-white rounded p-4 text-right shadow flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">👥</div>
              <div>
                <p className="text-xs text-gray-500">عدد الزيارات</p>
                <p className="text-xl font-bold">12</p>
              </div>
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
