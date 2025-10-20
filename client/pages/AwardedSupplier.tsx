import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';

interface TenderData {
  id: number;
  title: string;
  status_id: number;
  finished_at: string;
  domain_name: string;
}

interface SupplierData {
  id: number;
  company_name: string;
  commercial_register: string;
  phone: string;
  email: string;
  contact_person: string;
  city_name: string;
  region_name: string;
}

interface AwardedSupplierResponse {
  success: boolean;
  data: {
    tender: TenderData;
    supplier: SupplierData;
  };
}

export default function AwardedSupplier() {
  const { id, offerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [awardedData, setAwardedData] = useState<AwardedSupplierResponse['data'] | null>(null);

  useEffect(() => {
    const fetchAwardedSupplier = async () => {
      if (!id) {
        setError('معرف المناقصة غير موجود');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/tenders/${id}/awarded-supplier`);
        
        if (response.ok) {
          const data: AwardedSupplierResponse = await response.json();
          
          if (data.success) {
            setAwardedData(data.data);
          } else {
            setError('لم يتم العثور على مورد فائز لهذه المناقصة');
          }
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'خطأ في تحميل بيانات المورد الفائز');
        }
      } catch (error) {
        console.error('Error fetching awarded supplier:', error);
        setError('حدث خطأ أثناء تحميل بيانات المورد الفائز');
      } finally {
        setLoading(false);
      }
    };

    fetchAwardedSupplier();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Header userType="buyer" />
        <div className="max-w-[920px] mx-auto px-6 py-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tawreed-green mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل بيانات المورد الفائز...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !awardedData) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <Header userType="buyer" />
        <div className="max-w-[920px] mx-auto px-6 py-10">
          <div className="text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">خطأ في تحميل البيانات</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => navigate('/buyer')}
              className="px-6 py-2 bg-tawreed-green text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              العودة إلى الصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { tender, supplier } = awardedData;

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
          <p className="text-gray-500">المناقصة: {tender.title}</p>
          <p className="text-sm text-gray-400 mt-2">تم الاعتماد في: {new Date(tender.finished_at).toLocaleDateString('ar-SA')}</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-tawreed-border-gray rounded-xl shadow-sm p-6">
          {/* Supplier header */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b">
            <div className="text-right">
              <h3 className="text-xl font-semibold">{supplier.company_name}</h3>
              <div className="text-sm text-gray-500 flex gap-2">
                <span>السجل التجاري: {supplier.commercial_register}</span>
                <span>•</span>
                <span>{supplier.city_name}</span>
                <span>•</span>
                <span>{supplier.region_name}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 text-lg">توريد</div>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">رقم الهاتف</div>
              <div className="flex items-center justify-between">
                <div className="font-medium">{supplier.phone || 'غير متوفر'}</div>
                <button className="text-green-600">📞</button>
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="text-sm text-gray-500 mb-1">البريد الإلكتروني</div>
              <div className="flex items-center justify-between">
                <div className="font-medium">{supplier.email || 'غير متوفر'}</div>
                <button className="text-blue-600">✉️</button>
              </div>
            </div>
            <div className="md:col-span-2 border rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">المسؤول</div>
              <div className="h-10 bg-gray-800 rounded text-white flex items-center px-3">{supplier.contact_person || 'غير محدد'}</div>
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
