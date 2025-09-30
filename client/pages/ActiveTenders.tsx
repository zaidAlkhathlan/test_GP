import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function ActiveTenders() {
  const sampleTenders = Array.from({ length: 3 }).map((_, i) => ({
    id: `t${i + 1}`,
    title: i === 2 ? 'إنشاء بوابة أمنية على طريق السلامة بخشم النجار' : 'بناء ورشة سيارات',
    org: 'مؤسسة نماء للمشتريات',
    endDate: '2025-08-04',
    offers: 8,
    visits: 12,
    daysLeft: 15,
    budget: '1000 ريال'
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="buyer" />
      <div className="max-w-[1200px] mx-auto px-6 py-10">

        <div className="flex items-start gap-6" dir="rtl">
          <main className="flex-1">
            <div className="text-right mb-6">
              <h1 className="text-2xl font-bold">البحث في مناقصاتي</h1>
              <p className="text-sm text-gray-500">ابحث واعثر على المناقصات المناسبة لك</p>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div>
                <select className="border rounded px-3 py-2">
                  <option>ترتيب حسب</option>
                  <option>تاريخ النشر</option>
                </select>
              </div>
              <div>
                <Link to="/tenders/new" className="bg-tawreed-green text-white px-4 py-2 rounded inline-block">نشر مناقصة جديدة</Link>
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
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">مقاولات</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">تصليح</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-green-50 p-3 rounded">
                    <div className="flex items-center gap-4 justify-between">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">موعد انتهاء التقديم: {t.endDate}</div>
                        <div className="text-xs text-gray-400">عدد العروض: {t.offers}</div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-tawreed-green">{t.daysLeft}</div>
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
                      <Link to={`/tender/${t.id}/offers`} className="px-3 py-1 bg-tawreed-green text-white rounded inline-flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 7h18M7 11h10M9 15h6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
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
                  <label className="flex items-center gap-2"><input type="checkbox" /> نشطة</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> قيد المراجعة</label>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
