import React from "react";
import { Link, useParams } from "react-router-dom";
import Header from '../components/Header';

export default function TenderDetails() {
  const { id } = useParams();

  // Function to create progress circle
  const ProgressCircle = ({ days, color }: { days: number; color: string }) => (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${color}`}>
      {days}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="buyer" />
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8" dir="rtl">
          <div className="flex items-center justify-between mb-8">
            <div className="text-right">
              <h2 className="text-2xl font-semibold text-green-700 mb-2">بناء ورشة سيارات</h2>
              <p className="text-gray-600">مؤسسة بناء المنشآت</p>
            </div>
            <div>
              <Link to={id ? `/tender/${id}/offers` : '#'} className="inline-flex items-center gap-2 px-4 py-2 bg-tawreed-green text-white rounded-lg hover:bg-green-600 transition-colors">
                العروض المقدمة
              </Link>
            </div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Column - Competition Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">معلومات المناقصة</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-900 font-medium">#250739010054</span>
                  <span className="text-gray-500">الرقم المرجعي</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-900 font-medium">2025-8-1</span>
                  <span className="text-gray-500">تاريخ النشر</span>
                </div>
                
                <div className="flex justify-between items-center py-4">
                  <span className="text-gray-900 font-medium">ريال</span>
                  <span className="text-gray-500">ميزانية المناقصة</span>
                </div>
              </div>
            </div>

            {/* Right Column - Important Dates */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">المواعيد المهمة</h3>
              </div>

              <div className="space-y-6">
                {/* Offer Submission Deadline */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <ProgressCircle days={15} color="bg-green-500" />
                    <div className="text-right">
                      <p className="text-gray-900 font-medium">موعد انتهاء تقديم العروض</p>
                      <p className="text-sm text-gray-500">2025-08-04</p>
                    </div>
                  </div>
                </div>

                {/* Inquiry Deadline */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <ProgressCircle days={8} color="bg-orange-500" />
                    <div className="text-right">
                      <p className="text-gray-900 font-medium">موعد انتهاء الاستفسارات</p>
                      <p className="text-sm text-gray-500">2025-08-04</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities - Moved to top */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8" dir="rtl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <h4 className="font-semibold text-lg">الأنشطة الأخيرة</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">تم تقديم عرض جديد</p>
                <p className="text-sm text-gray-600 mt-1">شركة الخليج للمقاولات - منذ ساعتين</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">استفسار جديد</p>
                <p className="text-sm text-gray-600 mt-1">لديك استفسار جديد من شركة EY قبل 30 دقيقة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Content - Stats and Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-right" dir="rtl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">📅</div>
              <div>
                <p className="text-sm text-gray-500">الأيام المتبقية</p>
                <p className="text-xl font-bold text-tawreed-green">15</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-right" dir="rtl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center text-2xl">📄</div>
              <div>
                <p className="text-sm text-gray-500">العروض المقدمة</p>
                <p className="text-xl font-bold">8</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-right" dir="rtl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">❓</div>
              <div>
                <p className="text-sm text-gray-500">عدد الاستفسارات</p>
                <Link to={id ? `/tender/${id}/quires` : '#'} className="text-xl font-bold text-tawreed-green hover:underline">عرض الاستفسارات</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
              <h4 className="font-semibold text-lg mb-4">وصف المناقصة</h4>
              <p className="text-gray-600 leading-relaxed">يهدف هذا المشروع إلى إنشاء ورشة متخصصة في السيارات الثقيلة تشمل جميع الخدمات الفنية والصيانة الشاملة للمركبات التجارية والشاحنات.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
              <h4 className="font-semibold text-lg mb-4">المتطلبات الفنية</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  خبرة لا تقل عن 10 سنوات في مشاريع مماثلة
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  استخدام مواد عالية الجودة ومعتمدة
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  الالتزام بالمعايير السعودية للبناء
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
              <h4 className="font-semibold text-lg mb-4">المتطلبات المالية</h4>
              <p className="text-gray-600">تقديم ضمان بنكي بقيمة 5% من قيمة العقد، وإثبات القدرة المالية للمقاول.</p>
            </div>

            {/* Required Licenses */}
            <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg">التراخيص المطلوبة</h4>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 000 4h12a2 2 0 000-4H4z" />
                      <path fillRule="evenodd" d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 flex-1 leading-relaxed">رخصة المقاولين من الدرجة الأولى</span>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 flex-1 leading-relaxed">في إدارة الجودة</span>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 12a1 1 0 112 0V8a1 1 0 11-2 0v4zm1-7a1 1 0 100 2 1 1 0 000-2zM10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 flex-1 leading-relaxed">في السلامة المهنية</span>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 flex-1 leading-relaxed">ترخيص من الهيئة السعودية للمهندسين</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
              <h5 className="font-semibold text-lg mb-4">ملفات المناقصة</h5>
              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-600">مواصفات المشروع.pdf</span>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-600">المخططات الهندسية.pdf</span>
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
              <h5 className="font-semibold text-lg mb-4">معلومات الاتصال</h5>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-500">البريد الإلكتروني:</span>
                  <p className="text-gray-900">info@construction.sa</p>
                </div>
                <div>
                  <span className="text-gray-500">رقم الهاتف:</span>
                  <p className="text-gray-900">+966 11 123 4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
