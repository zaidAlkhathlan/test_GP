import React from 'react';
import { Link } from 'react-router-dom';

export default function ExpiredTenders() {
  const sampleTenders = Array.from({ length: 3 }).map((_, i) => ({
    id: `e${i + 1}`,
    title: i === 2 ? 'إنشاء بوابة أمنية على طريق السلامة بخشم النجار' : 'بناء ورشة سيارات',
    org: 'مؤسسة نماء للمشتريات',
    endDate: '2025-08-04',
    offers: 8,
    visits: 12,
    daysLeft: 0,
    budget: '1000 ريال'
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Site header: logo, nav, search, user area (copied from BuyerHome) */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="bg-tawreed-green text-white px-3 py-1 rounded-md">مؤسسة: اسم المنشأة</button>
              <div className="hidden md:flex items-center gap-6 text-sm text-tawreed-text-dark" dir="rtl">
                <Link to="/tenders/active" className="hover:underline">المناقصات النشطة</Link>
                <Link to="/tenders/expired" className="hover:underline">المناقصات المنتهية</Link>
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

        <div className="flex items-start gap-6" dir="rtl">
          <main className="flex-1">
            <div className="text-right mb-6">
              <h1 className="text-2xl font-bold">المناقصات المنتهية</h1>
              <p className="text-sm text-gray-500">قائمة بالمناقصات التي انتهت مواعيد تقديم العروض</p>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div>
                <select className="border rounded px-3 py-2">
                  <option>ترتيب حسب</option>
                  <option>تاريخ الانتهاء</option>
                </select>
              </div>
              <div>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">تصدير القائمة</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sampleTenders.map((t) => (
                <div key={t.id} className="bg-white rounded shadow p-6" dir="rtl">
                  <div className="flex items-start justify-between">
                    <div className="text-right">
                      <h3 className="text-lg font-semibold">{t.title}</h3>
                      <p className="text-sm text-gray-500">{t.org}</p>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">مقاولات</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">تصليح</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-gray-50 p-3 rounded">
                    <div className="flex items-center gap-4 justify-between">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">تاريخ الانتهاء: {t.endDate}</div>
                        <div className="text-xs text-gray-400">عدد العروض: {t.offers}</div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-gray-600">منتهية</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-sm">قيمة العطاء</p>
                      <p className="font-bold">{t.budget}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/tender/${t.id}`} className="px-3 py-1 bg-white border rounded">التفاصيل</Link>
                      <Link to={`/tender/${t.id}/offers`} className="px-3 py-1 bg-gray-500 text-white rounded inline-flex items-center gap-2">
                        العروض المقدمة
                      </Link>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400 mt-3">الرقم المرجعي: 25073901054 | تاريخ النشر: 2025-08-01</div>
                </div>
              ))}
            </div>
          </main>

          <aside className="w-80">
            <div className="bg-white rounded p-4 shadow">
              <h4 className="text-right font-semibold">مناقصاتي</h4>
              <input placeholder="ابحث عن مناقصة" className="w-full border rounded px-3 py-2 mt-3" />

              <div className="mt-4">
                <p className="text-sm text-gray-500">حالة المناقصة</p>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2"><input type="checkbox" /> منتهية</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> ملغاة</label>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
