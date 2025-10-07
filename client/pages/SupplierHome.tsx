import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SupplierSession {
  id: number;
  account_name: string;
  account_email: string;
  company_name: string;
  city: string;
  commercial_registration_number: string;
  commercial_phone_number: string;
  account_phone: string;
  domain: string;
  created_at: string;
}

export default function SupplierHomePage() {
  const [supplier, setSupplier] = useState<SupplierSession | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const supplierSession = localStorage.getItem('supplierSession');
    if (supplierSession) {
      try {
        const supplierData = JSON.parse(supplierSession);
        setSupplier(supplierData);
      } catch (error) {
        console.error('Error parsing supplier session:', error);
        navigate('/supplier/signin');
      }
    } else {
      navigate('/supplier/signin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('supplierSession');
    navigate('/');
  };

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-green-600">توريد - لوحة المورد</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-gray-700">مرحباً، {supplier.account_name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            مرحباً بك في بوابة المورد
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>اسم الشركة:</strong> {supplier.company_name}
            </div>
            <div>
              <strong>المدينة:</strong> {supplier.city}
            </div>
            <div>
              <strong>المجال:</strong> {supplier.domain}
            </div>
            <div>
              <strong>رقم التسجيل التجاري:</strong> {supplier.commercial_registration_number}
            </div>
            <div>
              <strong>البريد الإلكتروني:</strong> {supplier.account_email}
            </div>
            <div>
              <strong>رقم الهاتف:</strong> {supplier.commercial_phone_number}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="mr-4">
                <h3 className="text-lg font-medium text-gray-900">المناقصات المتاحة</h3>
                <p className="text-sm text-gray-500">عرض وتقديم العروض للمناقصات</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="mr-4">
                <h3 className="text-lg font-medium text-gray-900">عروضي</h3>
                <p className="text-sm text-gray-500">متابعة حالة العروض المقدمة</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="mr-4">
                <h3 className="text-lg font-medium text-gray-900">الملف الشخصي</h3>
                <p className="text-sm text-gray-500">تحديث بيانات الشركة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">النشاط الأخير</h3>
          <div className="text-center py-8 text-gray-500">
            لا توجد أنشطة حديثة
          </div>
        </div>
      </main>
    </div>
  );
}