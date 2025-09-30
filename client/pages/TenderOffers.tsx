import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';

export default function TenderOffers() {
  const { id } = useParams();
  const [modalSupplier, setModalSupplier] = useState<any | null>(null);

  // sample offers data
  const offers = [
    {
      id: 'o1',
      company: 'شركة البناء الحديثة المحدودة',
      amount: '950,000 ريال',
      date: '2025-01-10',
      status: 'قيد المراجعة',
      summary: [
        'العرض المالي تنافسي ويقل عن متوسط السوق بنسبة 8%',
        'المواصفات الفنية تتوافق بنسبة 95% مع المتطلبات',
        'المواد معتمدة ومطابقة للمواصفات'
      ],
      supplier: {
        name: 'شركة البناء الحديثة المحدودة',
        commercialRecord: '1010123456',
        phone: '966112345678',
        city: 'الرياض',
        industry: 'البناء والإنشاءات',
        licenses: ['رخصة البناء', 'رخصة المقاولات', 'رخصة السلامة'],
        certs: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
        contact: { name: 'أحمد محمد العلي', email: 'ahmed.ali@construction-co.sa', mobile: '966501234567' },
        registeredOnPlatformYears: 15
      }
    },
    {
      id: 'o2',
      company: 'مؤسسة الإنشاءات التطبيقية',
      amount: '1,020,000 ريال',
      date: '2025-01-10',
      status: 'مطروح',
      summary: ['العرض المالي ضمن النطاق', 'يوفر خدمات صيانة متميزة'],
      supplier: {
        name: 'مؤسسة الإنشاءات التطبيقية',
        commercialRecord: '1012345678',
        phone: '966198765432',
        city: 'جدة',
        industry: 'الإنشاءات',
        licenses: ['رخصة البناء'],
        certs: ['ISO 9001'],
        contact: { name: 'سعيد الخالد', email: 'saeed@apptco.sa', mobile: '966512345678' },
        registeredOnPlatformYears: 3
      }
    },
    {
      id: 'o3',
      company: 'شركة الشباب الهندسية',
      amount: '980,000 ريال',
      date: '2025-01-10',
      status: 'معتمد',
      summary: ['عرض فني جيد', 'التسليم خلال 45 يوم'],
      supplier: {
        name: 'شركة الشباب الهندسية',
        commercialRecord: '1098765432',
        phone: '966155544433',
        city: 'مكة',
        industry: 'الهندسة',
        licenses: ['رخصة المقاولات'],
        certs: ['ISO 9001'],
        contact: { name: 'محمد السالم', email: 'm.salem@shabab.sa', mobile: '966512345000' },
        registeredOnPlatformYears: 8
      }
    }
  ];

  const openSupplierModal = (supplier: any) => setModalSupplier(supplier);
  const closeSupplierModal = () => setModalSupplier(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="buyer" />
      <div className="max-w-[900px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6" dir="rtl">
          <div className="text-right">
            <h2 className="text-xl font-semibold">تقييم العروض المقدمة</h2>
            <p className="text-sm text-gray-500">عرض قائمة العروض المقدمة للمناقصة {id}</p>
          </div>
          <div>
            <Link to={id ? `/tender/${id}` : '/buyer'} className="text-sm text-tawreed-green">عودة للمناقصة</Link>
          </div>
        </div>

        <div className="space-y-6">
          {offers.map((o) => (
            <div key={o.id} className="bg-white rounded shadow p-6" dir="rtl">
              <div className="flex items-start justify-between">
                <div className="text-right">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-semibold">{o.company}</h4>
                      <p className="text-xs text-gray-500">تاريخ التقديم: {o.date}</p>
                    </div>
                  </div>
                </div>

                <div className="text-left">
                  <div className="inline-block bg-gray-50 px-3 py-2 rounded-md text-sm text-gray-700">إجمالي العرض <span className="font-bold text-tawreed-green">{o.amount}</span></div>
                </div>
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-100 rounded p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 text-right">
                    <div className="text-sm text-gray-700 mb-2">ملخص العرض الفني</div>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {o.summary.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="w-16">
                    {/* small actions / menu placeholder */}
                    <div className="bg-white rounded shadow p-2 text-center text-sm">⋯</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => openSupplierModal(o.supplier)} className="px-3 py-1 border rounded text-sm">تفاصيل المورد</button>
                </div>

                <div className="flex-1">
                  <button className="w-full bg-tawreed-green text-white py-3 rounded shadow">اعتماد المورد الفائز</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Supplier modal */}
        {modalSupplier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={closeSupplierModal}></div>
            <div className="relative bg-white w-[720px] max-w-[95%] rounded-lg shadow-lg p-6" dir="rtl">
              <button className="absolute top-3 left-3 text-gray-500" onClick={closeSupplierModal}>✕</button>
              <div className="text-right mb-4">
                <h3 className="text-lg font-semibold">{modalSupplier.name}</h3>
                <p className="text-sm text-gray-500">{modalSupplier.name}</p>
              </div>

              <div className="bg-gray-50 rounded p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">السجل التجاري</p>
                    <p className="font-medium">{modalSupplier.commercialRecord}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">الهاتف التجاري</p>
                    <p className="font-medium">{modalSupplier.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">المدينة</p>
                    <p className="font-medium">{modalSupplier.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">الصناعة</p>
                    <p className="font-medium">{modalSupplier.industry}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-right">التراخيص والشهادات</h4>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {modalSupplier.licenses.map((l:string) => (
                    <span key={l} className="px-3 py-1 bg-green-50 text-green-800 rounded-full text-sm">{l}</span>
                  ))}
                </div>

                <div className="mt-3 flex gap-2 flex-wrap">
                  {modalSupplier.certs.map((c:string) => (
                    <span key={c} className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm">{c}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded p-4 mb-4">
                <h4 className="font-semibold text-right">بيانات المسؤول</h4>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">اسم المسؤول</p>
                    <p className="font-medium">{modalSupplier.contact.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">رقم الجوال</p>
                    <p className="font-medium">{modalSupplier.contact.mobile}</p>
                  </div>
                  <div className="col-span-2 text-right">
                    <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                    <p className="font-medium">{modalSupplier.contact.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-right text-sm text-gray-500">تاريخ التسجيل في المنصة: {modalSupplier.registeredOnPlatformYears} سنة</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
