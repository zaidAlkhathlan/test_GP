import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';

interface SupplierContact {
  name: string;
  email: string;
  mobile: string;
}

interface SupplierData {
  name: string;
  commercialRecord: string;
  city: string;
  industry: string;
  contact: SupplierContact;
}

export default function AwardedSupplier() {
  const { id, offerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const supplier: SupplierData | undefined = (location.state as any)?.supplier;

  // Fallback demo data if navigated directly
  const data: SupplierData = supplier ?? {
    name: 'شركة البناء الحديثة المحدودة',
    commercialRecord: '1010123456',
    city: 'الرياض',
    industry: 'البناء والإنشاءات',
    contact: { name: 'أحمد محمد العلي', email: 'ahmed.ali@construction-co.sa', mobile: '966501234567' }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header userType="buyer" />
      <div className="max-w-[920px] mx-auto px-6 py-10">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <span className="text-2xl">🏆</span>
          </div>
          <h1 className="text-3xl font-bold text-tawreed-text-dark mb-2">تم اعتماد المورد الفائز</h1>
          <p className="text-gray-500">لقد اخترت هذا المورد ليكون الفائز في طلب العرض</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-tawreed-border-gray rounded-xl shadow-sm p-6">
          {/* Supplier header */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b">
            <div className="text-right">
              <h3 className="text-xl font-semibold">{data.name}</h3>
              <div className="text-sm text-gray-500 flex gap-2">
                <span>السجل التجاري: {data.commercialRecord}</span>
                <span>•</span>
                <span>{data.city}</span>
                <span>•</span>
                <span>{data.industry}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 text-lg">توريد</div>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">رقم الهاتف</div>
              <div className="flex items-center justify-between">
                <div className="font-medium">{data.contact.mobile}</div>
                <button className="text-green-600">📞</button>
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">البريد الإلكتروني</div>
              <div className="flex items-center justify-between">
                <div className="font-medium">{data.contact.email}</div>
                <button className="text-blue-600">✉️</button>
              </div>
            </div>
            <div className="md:col-span-2 border rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">المسؤول/أحمد محمد العلي</div>
              <div className="h-10 bg-gray-800 rounded text-white flex items-center px-3">{data.contact.name}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <button className="px-4 py-2 border border-tawreed-green text-tawreed-green rounded">تحميل الاتفاقية / عقد</button>
            <button className="px-4 py-2 border rounded">الاتصال بالمورد</button>
            <button className="px-4 py-2 bg-gray-900 text-white rounded">إرسال بريد إلكتروني</button>
          </div>

          {/* Success banner */}
          <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg text-center">
            تم إشعار المورد عبر البريد الإلكتروني باعتماده كمورد فائز
          </div>

          <div className="mt-6 flex justify-center">
            <button onClick={() => navigate(id ? `/tender/${id}/offers` : '/buyer')} className="px-5 py-2 bg-white border rounded">عودة إلى صفحة التقييم</button>
          </div>
        </div>
      </div>
    </div>
  );
}
