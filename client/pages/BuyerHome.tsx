import React from "react";
import { Link } from "react-router-dom";

export default function BuyerHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        {/* Site header: logo, nav, search, user area */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="bg-tawreed-green text-white px-3 py-1 rounded-md">مؤسسة: اسم المنشأة</button>
              <div className="hidden md:flex items-center gap-6 text-sm text-tawreed-text-dark" dir="rtl">
                <a className="hover:underline">المناقصات النشطة</a>
                <a className="hover:underline">المناقصات المنتهية</a>
                <a className="hover:underline">من نحن</a>
                <a className="hover:underline">اتصل بنا</a>
              </div>
            </div>

            <div className="flex-1 px-6">
              <div className="max-w-xl mx-auto">
                <input dir="rtl" placeholder="بحث..." className="w-full px-4 py-2 rounded-lg border border-tawreed-border-gray text-sm" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <button className="relative">
                  <span className="inline-block w-8 h-8 bg-gray-100 rounded-full"></span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">3</span>
                </button>
                <button className="px-3 py-1 border rounded text-sm">حسابي</button>
              </div>
              <div className="text-tawreed-green font-bold">توريد</div>
            </div>
          </div>
        </header>

        {/* Page title and center CTA */}
        <div className="text-right mb-6">
          <h1 className="text-2xl font-bold text-tawreed-text-dark">منصة <span className="text-tawreed-green">توريد</span> الذكية للمشتريات</h1>
          <p className="mt-1 text-sm text-gray-500">منصة المشتريات المدعومة بالذكاء الاصطناعي لتبسيط عمليات الشراء وتحسين الكفاءة</p>
        </div>

        <div className="flex justify-center mb-8">
          <button className="bg-tawreed-green text-white px-6 py-2 rounded-full shadow">استكشف المناقصات الذكية</button>
        </div>

        {/* Stats row centered */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm w-52 text-right">
              <p className="text-xs text-gray-500">موردين نشطين</p>
              <p className="text-2xl font-bold text-tawreed-green">892</p>
              <p className="text-xs text-green-500">5.7%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm w-52 text-right">
              <p className="text-xs text-gray-500">مشتريات منجزة</p>
              <p className="text-2xl font-bold">4,020</p>
              <p className="text-xs text-green-500">12.3%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm w-52 text-right">
              <p className="text-xs text-gray-500">مناقصات تم ترسيبها</p>
              <p className="text-2xl font-bold">405,926</p>
              <p className="text-xs text-green-500">8.3%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm w-52 text-right">
              <p className="text-xs text-gray-500">عروض مقدمة</p>
              <p className="text-2xl font-bold">1,719,931</p>
              <p className="text-xs text-green-500">12.5%</p>
            </div>
          </div>
        </div>

        {/* Tender card row: place tender card below stats and aligned to the right */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow p-6" dir="rtl">
              <h4 className="text-green-700 font-semibold mb-2 text-right">بناء ورشة سيارات</h4>
              <p className="text-sm text-gray-500 mb-3 text-right">مؤسسة بناء المنشآت</p>

              <div className="bg-green-50 p-3 rounded mb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border">15</div>
                  <div className="text-sm text-gray-600 text-right">موعد انتهاء التقديم: 2025-08-04</div>
                </div>
                <div className="text-sm text-gray-600 text-right">عدد العروض: 2</div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="text-right">
                  <p className="text-sm">قيمة العطاء</p>
                  <p className="font-bold">1000 ريال</p>
                </div>
                <div className="flex items-center gap-2">
                  <a href="/tender/25073901054" className="px-3 py-1 bg-white border rounded inline-block text-center">التفاصيل</a>
                  <button className="px-3 py-1 bg-tawreed-green text-white rounded">العروض المقدمة</button>
                </div>
              </div>

              <div className="text-xs text-gray-400">رقم المرجع: 25073901054 | تاريخ النشر: 2025-08-01</div>
            </div>
          </div>
        </div>

        {/* No results center */}
        <div className="mt-4 text-center">
          <div className="inline-block bg-white px-4 py-2 rounded shadow-sm">لا يوجد مناقصات</div>
        </div>

        {/* Bottom pale CTA band */}
        <div className="mt-10">
          <div className="bg-green-50 rounded-lg p-8">
            <div className="max-w-[1100px] mx-auto flex items-center justify-between">
              <div className="text-right">
                <h4 className="text-lg font-semibold">ابدأ مشروعك القادم</h4>
                <p className="text-sm text-gray-600">استخدم منصة توريد لإنشاء مناقصة جديدة والعثور على أفضل الموردين</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white border rounded">استعراض الموردين</button>
                <button className="px-4 py-2 bg-tawreed-green text-white rounded">انشاء مناقصة جديدة</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
