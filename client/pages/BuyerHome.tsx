import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function BuyerHome() {
  const [currentBuyer, setCurrentBuyer] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if buyer is logged in
    const buyerData = localStorage.getItem('currentBuyer');
    if (buyerData) {
      setCurrentBuyer(JSON.parse(buyerData));
    } else {
      // Redirect to sign in if not logged in
      navigate('/buyer/signin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentBuyer');
    navigate('/buyer/signin');
  };

  if (!currentBuyer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        {/* Site header: logo, nav, search, user area */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="bg-tawreed-green text-white px-3 py-1 rounded-md">
                مؤسسة: {currentBuyer.company_name}
              </button>
              <div className="hidden md:flex items-center gap-6 text-sm text-tawreed-text-dark" dir="rtl">
                <Link to="/tenders/active" className="hover:underline">المناقصات النشطة</Link>
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
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    مرحباً، {currentBuyer.account_name}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="px-3 py-1 border rounded text-sm hover:bg-gray-50"
                  >
                    تسجيل الخروج
                  </button>
                </div>
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
        {/* Stats row with four small white cards (icon + large green number + small percent) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button className="bg-tawreed-green text-white px-3 py-1 rounded-md">نشر مناقصة جديدة</button>
            </div>
            <div className="text-right">
              <h3 className="text-base font-semibold">الإحصائيات الحية</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm text-right flex items-center gap-4">
              <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#16a34a" strokeWidth="1.2" fill="none"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">عروض مقدمة</div>
                <div className="text-2xl font-bold text-tawreed-green">1,719,931</div>
                <div className="text-xs text-green-500">12.5% ↑</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-right flex items-center gap-4">
              <div className="w-14 h-14 bg-yellow-50 rounded-lg flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M3 17l3-3 4 4 8-8 3 3" stroke="#c59f10" strokeWidth="1.2" fill="none"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">مناقصات تم ترسيطها</div>
                <div className="text-2xl font-bold text-tawreed-green">405,926</div>
                <div className="text-xs text-green-500">8.3% ↑</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-right flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 20v-1c0-2.21 1.79-4 4-4h4c2.21 0 4 1.79 4 4v1" stroke="#1e40af" strokeWidth="1.2" fill="none"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">مناقصات نشطة</div>
                <div className="text-2xl font-bold text-tawreed-green">4,020</div>
                <div className="text-xs text-green-500">15.2% ↑</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-right flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M9 12a4 4 0 1 1 6 0" stroke="#15803d" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="#15803d" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">موردين نشطين</div>
                <div className="text-2xl font-bold text-tawreed-green">892</div>
                <div className="text-xs text-green-500">5.7% ↑</div>
              </div>
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">عدد العروض: 2</span>
                  <span className="px-2 py-1 bg-green-600 text-white rounded-full text-xs">مباشر</span>
                </div>
                <div className="mt-1 flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-green-100 text-sm text-green-800 rounded-full">مقاولات</span>
                  <span className="px-3 py-1 bg-green-100 text-sm text-green-800 rounded-full">ترميم</span>
                  <span className="px-3 py-1 bg-green-100 text-sm text-green-800 rounded-full">تصليح</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <div className="text-right">
                  <p className="text-sm">قيمة العطاء</p>
                  <p className="font-bold">1000 ريال</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link to="/tender/25073901054/offers" className="inline-flex items-center gap-2 px-3 py-1 bg-tawreed-green text-white rounded">
                    {/* offers svg */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M3 7h18M7 11h10M9 15h6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    العروض المقدمة
                  </Link>
                  <Link to="/tender/25073901054" className="px-3 py-1 bg-white border rounded inline-block text-center">التفاصيل</Link>
                </div>
              </div>

              <div className="text-xs text-gray-400 mt-3">رقم المرجع: 25073901054 | تاريخ النشر: 2025-08-01</div>
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
