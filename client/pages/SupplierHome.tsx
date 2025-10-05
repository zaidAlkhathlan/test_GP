import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';

interface SupplierSession {
  id: number;
  account_name: string;
  account_email: string;
  company_name: string;
  city: string;
  industry: string;
}

export default function SupplierHomePage() {
  const [supplier, setSupplier] = useState<SupplierSession | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const supplierSession = localStorage.getItem('currentSupplier');
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

  // Sample data for tenders
  const availableTenders = [
    {
      id: '1',
      title: 'بناء ورشة سيارات',
      company: 'مؤسسة بناء المنشآت',
      category: 'مقاولات',
      location: 'الرياض',
      budget: '1000 ريال',
      publishDate: '2025-08-01',
      offerDeadline: '2025-08-04',
      inquiryDeadline: '2025-08-04',
      remainingDays: 15,
      remainingInquiryDays: 8,
      status: 'active' as const,
      referenceNumber: '#250739010054'
    }
  ];

  const appliedTenders = [
    {
      id: '2',
      title: 'تطوير الموقع الإلكتروني',
      company: 'شركة التقنية المتقدمة',
      status: 'تحت المراجعة',
      submissionDate: '2025-08-02',
      amount: '50,000 ريال'
    }
  ];

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
      <Header userType="supplier" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="text-right mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مرحباً بك في منصة توريد</h1>
          <p className="text-gray-600 mb-6">اكتشف الفرص المناسبة لتخصصك وقدم عروضك بكفاءة عالية</p>
          <button className="px-6 py-3 bg-tawreed-green text-white rounded-lg hover:bg-green-600">
            استكشف المناقصات المطابقة
          </button>
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 text-right">توقعات الذكاء الاصطناعي</h2>
        </div>

        {/* AI Performance Predictions Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Categories Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>القطاعات الأعلى طلباً</span>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-tawreed-green">الخدمات السياحية</div>
                <div className="text-sm text-tawreed-green">الذكاء الاصطناعي</div>
                <div className="text-sm text-tawreed-green">الأمن السيبراني</div>
              </div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4">
            <div className="text-center mb-3">
              <p className="text-sm text-gray-600">أسعار السوق المتوقعة</p>
            </div>
            
            {/* Chart Container with Blue Border */}
            <div className="border-2 border-blue-400 rounded-lg p-3 bg-gradient-to-br from-green-50 to-blue-50">
              <div className="h-32 relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                  <span>150</span>
                  <span>140</span>
                  <span>130</span>
                  <span>120</span>
                  <span>110</span>
                  <span>100</span>
                </div>
                
                {/* Chart Area */}
                <div className="ml-6 h-full relative">
                  {/* SVG Chart Path */}
                  <svg className="w-full h-full" viewBox="0 0 300 120">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 20 80 Q 80 60, 120 70 T 200 50 T 280 40"
                      stroke="#10B981"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M 20 80 Q 80 60, 120 70 T 200 50 T 280 40 L 280 120 L 20 120 Z"
                      fill="url(#chartGradient)"
                    />
                  </svg>
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-6 right-0 flex justify-between text-xs text-gray-500">
                  <span>يناير</span>
                  <span>فبراير</span>
                  <span>مارس</span>
                  <span>أبريل</span>
                </div>
              </div>
            </div>
            
            <p className="text-center text-xs text-gray-600 mt-2">
              استناداً إلى الحاجات السوق الحالية
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="space-y-4 text-right">
              <div>
                <div className="text-xs text-gray-600 mb-1">نسبة التوقعات الدقيقة</div>
                <div className="text-2xl font-bold text-tawreed-green mb-1">92.1%</div>
                <div className="text-xs text-gray-500">بناء على نماذج تعلم الآلة</div>
              </div>
              
              <div>
                <div className="text-xs text-gray-600 mb-1">الطلبات المتوقعة هذا الأسبوع</div>
                <div className="text-2xl font-bold text-tawreed-green mb-1">25 طلب</div>
                <div className="text-xs text-gray-500">+12% مقارنة بالأسبوع السابق</div>
              </div>
            </div>
          </div>
        </div>

        {/* Matching Opportunities Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-900 mb-2">الفرص المطابقة مع تخصصك</h2>
              <p className="text-gray-600">بناء على ملفك التعريفي وتخصصاتك، وجدنا</p>
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-tawreed-green">1 فرصة مناسبة لك</div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-tawreed-green rounded-full"></div>
              <span className="text-tawreed-green font-medium">تحديث مباشر</span>
            </div>
            <p className="text-gray-700">
              تم العثور على مناقصة جديدة تتطابق مع خبرتك في مجال البناء والإنشاءات. 
              نوصي بمراجعة التفاصيل وتقديم عرضك قبل انتهاء المهلة.
            </p>
          </div>
          
          {/* Navigation Button */}
          <div className="flex justify-center">
            <button 
              onClick={() => navigate('/supplier/matching-tenders')}
              className="px-6 py-3 bg-tawreed-green text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span>عرض المناقصات المطابقة لملفي</span>
            </button>
          </div>
        </div>

        {/* Available Tenders Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link 
              to="/available-tenders"
              className="text-xl font-semibold text-tawreed-green hover:underline"
            >
              المناقصات المتاحة
            </Link>
            <Link 
              to="/available-tenders"
              className="text-tawreed-green hover:underline"
            >
              عرض الكل
            </Link>
          </div>
          
          {/* Tender Card - Similar to Buyer Page */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availableTenders.map((tender) => (
              <div key={tender.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8" dir="rtl">
                
                {/* Title & Company */}
                <div className="mb-6 text-right">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tender.title}</h3>
                  <p className="text-base text-gray-600">{tender.company}</p>
                </div>

                {/* Category and Location */}
                <div className="mb-4 text-right">
                  <div className="inline-flex gap-2 flex-wrap mb-3">
                    <span className="px-3 py-1 rounded bg-[#28A745] text-white text-xs font-medium">{tender.category}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{tender.location}</span>
                  </div>
                </div>

                {/* Deadline Info */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#28A745]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <div className="text-right">
                        <span className="text-sm text-gray-600 block">آخر موعد للتقديم</span>
                        <span className="text-sm font-medium">{tender.offerDeadline}</span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex flex-col items-center justify-center">
                      <span className="text-sm font-bold text-green-600">{tender.remainingDays}</span>
                      <span className="text-xs text-gray-600">يوم</span>
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="mb-6 text-right">
                  <span className="text-base text-gray-600 block mb-1">قيمة المناقصة:</span>
                  <div className="text-2xl font-bold text-gray-900">{tender.budget}</div>
                </div>

                {/* Actions for Supplier */}
                <div className="flex gap-2 mb-4 justify-end">
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded text-sm">
                    التفاصيل
                  </button>
                  <button className="px-4 py-2 bg-[#28A745] text-white hover:bg-[#28A745]/90 rounded text-sm">
                    تقديم عرض
                  </button>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <span>تاريخ النشر: {tender.publishDate}</span>
                  <span>الرقم المرجعي {tender.referenceNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applied Tenders Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">المناقصات المقدم عليها</h3>
            <span className="text-sm text-gray-500">1 عرض مقدم</span>
          </div>
          
          <div className="space-y-4">
            {appliedTenders.map((tender) => (
              <div key={tender.id} className="border border-gray-200 rounded-lg p-6 hover:border-tawreed-green">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{tender.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{tender.company}</p>
                    <p className="text-xs text-gray-500">تاريخ التقديم: {tender.submissionDate}</p>
                  </div>
                  
                  <div className="text-left">
                    <div className="text-lg font-bold text-tawreed-green mb-2">{tender.amount}</div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {tender.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center py-6">
              <button className="px-6 py-3 bg-tawreed-green text-white rounded-lg hover:bg-green-600">
                عرض جميع العروض المقدمة
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}