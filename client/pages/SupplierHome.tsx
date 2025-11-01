import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PerformanceChart from '../components/PerformanceChart';
import QuickActionCard from '../components/QuickActionCard';
import TenderCard from '../components/TenderCard';
import RecommendedTenders from '../components/RecommendedTenders';

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
  const [recommended, setRecommended] = useState<any[] | null>(null);
  const [loadingRecommended, setLoadingRecommended] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check both possible storage keys for backward compatibility
    const supplierSession = localStorage.getItem('supplierSession') || localStorage.getItem('currentSupplier');
    if (supplierSession) {
      try {
        const supplierData = JSON.parse(supplierSession);
        setSupplier(supplierData);
        // Ensure consistency by storing in both keys
        localStorage.setItem('currentSupplier', supplierSession);
        localStorage.setItem('supplierSession', supplierSession);
      } catch (error) {
        console.error('Error parsing supplier session:', error);
        navigate('/supplier/signin');
      }
    } else {
      navigate('/supplier/signin');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRecommended = async () => {
      if (!supplier) return;
      setLoadingRecommended(true);
      try {
        const res = await fetch(`/api/suppliers/${supplier.id}/recommended-tenders`);
        if (!res.ok) {
          console.error('Failed to load recommended tenders', await res.text());
          setRecommended([]);
          return;
        }
        const data = await res.json();
        setRecommended(Array.isArray(data.tenders) ? data.tenders : []);
      } catch (err) {
        console.error('Error fetching recommended tenders', err);
        setRecommended([]);
      } finally {
        setLoadingRecommended(false);
      }
    };

    fetchRecommended();
  }, [supplier]);

  const handleLogout = () => {
    localStorage.removeItem('supplierSession');
    localStorage.removeItem('currentSupplier');
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
      <Header userType="supplier" />

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-8 py-6">
        {/* Main Dashboard Header */}
        <div className="text-right mb-8">
          <h1 className="text-3xl font-bold text-tawreed-green mb-2">
            مرحباً بك في منصة <span className="text-tawreed-green">توريد</span>
          </h1>
          <p className="text-gray-600 mb-6">
            اكتشف الفرص المناسبة لتخصصك وقدم عروضك بكفاءة عالية
          </p>
          <div className="flex justify-center mb-8">
            <button className="bg-tawreed-green text-white px-8 py-3 rounded-lg shadow-lg hover:bg-green-600 transition-colors">
              استكشف المناقصات المتطابقة
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <QuickActionCard
            title="المناقصات المتاحة"
            description="عرض وتقديم العروض للمناقصات"
            href="/available-tenders"
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-600"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />

          <QuickActionCard
            title="المناقصات المقدّم عليها"
            description="متابعة حالة العروض المقدمة"
            href="/supplier/offers"
            iconBgColor="bg-green-100"
            iconTextColor="text-green-600"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />

          <QuickActionCard
            title="الملف الشخصي"
            description="تحديث بيانات الشركة"
            href="/company-profile"
            iconBgColor="bg-purple-100"
            iconTextColor="text-purple-600"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-12 gap-8 mb-8">
          {/* Left Side - Services List */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 text-right">الخدمات الأكثر طلباً</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-700">الخدمات السياحية</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-700">الذكاء الاصطناعي</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-gray-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-700">الأمن السيبراني</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Performance Chart */}
          <div className="col-span-12 lg:col-span-6">
            <PerformanceChart
              title="أسعار السوق المرجعية"
              subtitle="استعراض أداء السوق خلال الأشهر السابقة"
              data={[
                { label: 'يناير', value: 120 },
                { label: 'فبراير', value: 135 },
                { label: 'مارس', value: 148 },
                { label: 'أبريل', value: 162 },
                { label: 'مايو', value: 175 },
                { label: 'يونيو', value: 188 },
                { label: 'يوليو', value: 195 },
                { label: 'أغسطس', value: 192 },
              ]}
              height={200}
            />
          </div>

          {/* Right Side - Statistics Cards */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm text-right">
              <h3 className="text-xs text-gray-600 mb-1">توقعات الذكاء الاصطناعي</h3>
              <div className="text-2xl font-bold text-tawreed-green mb-1">خطأ في التحميل</div>
              <p className="text-xs text-gray-500">بناء على نموذج إحصائي عالي الدقة</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm text-right">
              <h3 className="text-xs text-gray-600 mb-1">الطلبات المتوقعة هذا الأسبوع</h3>
              <div className="text-2xl font-bold text-tawreed-green mb-1">
                25 <span className="text-sm font-normal text-gray-600">طلب</span>
              </div>
              <p className="text-xs text-gray-500">زيادة بنسبة 12% عن الأسبوع الماضي</p>
            </div>
          </div>
        </div>

        {/* Matching Opportunities Section - Hidden but kept for future use */}
        {/*
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-right mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">تحديث مباشر</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">الفرص المتطابقة مع تخصصك</h2>
              </div>
              
              <p className="text-gray-600 text-sm mb-6">بناء على ملفك التعريفي وتخصصاتك، وجدنا</p>
              
              <div className="text-3xl font-bold text-tawreed-green mb-6">خطأ في تحميل الفرص</div>
            </div>

            <TenderCard
              tender={{
                id: "1",
                title: "خطأ في تحميل العنوان",
                company: "مؤسسة أعمار المنشآت",
                category: "مقاولات عامة المباني",
                subDomains: ["الإنشاء", "الإنشاءات العامة", "الهندسة"],
                location: "خطأ في تحميل الموقع",
                offerDeadline: "2025-08-04",
                inquiryDeadline: "2025-08-04",
                remainingDays: 15,
                remainingInquiryDays: 10,
                budget: "1000 ريال",
                referenceNumber: "2507380100454",
                publishDate: "2025-8-1",
                status: "active",
                description: "خطأ في تحميل الوصف"
              }}
              userType="supplier"
              showActions={true}
              className="max-w-md"
            />
          </div>
        </div>
        */}

        {/* Recommended Tenders Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6 text-right">المناقصات الموصى بها</h3>

            {loadingRecommended ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">جاري تحميل المناقصات الموصى بها...</p>
              </div>
            ) : recommended && recommended.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommended.map((tender) => (
                  <TenderCard
                    key={tender.id}
                    tender={tender}
                    userType="supplier"
                    showActions={true}
                    className="max-w-sm"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">لم يتم العثور على مناقصات مطابقة لتخصصك في الوقت الحالي.</div>
            )}
          </div>
        </div>

        {/* General Recommendations Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-tawreed-green rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">نصائح لتحسين فرصك في الفوز</h3>
            </div>
            <p className="text-gray-600 text-sm">اتبع هذه التوصيات لزيادة معدل نجاحك في المناقصات</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-900">اقرأ بعناية</h4>
                  <p className="text-xs text-blue-600">دراسة شاملة</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-right leading-relaxed">
                ادرس جميع متطلبات المناقصة بعناية فائقة وتأكد من فهم المواصفات الفنية والمالية قبل تقديم العرض
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-900">لا تؤجل</h4>
                  <p className="text-xs text-green-600">إدارة الوقت</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-right leading-relaxed">
                قدم عرضك قبل انتهاء الموعد المحدد بوقت كافٍ. العروض المتأخرة لا يتم قبولها تحت أي ظرف من الظروف
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-900">املأ كل شيء</h4>
                  <p className="text-xs text-orange-600">الوثائق الكاملة</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-right leading-relaxed">
                تأكد من رفع جميع الوثائق المطلوبة وأن تكون صالحة ومحدثة. الوثائق الناقصة تؤدي لرفض العرض فوراً
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-900">اسأل إذا لم تفهم</h4>
                  <p className="text-xs text-purple-600">الاستفسارات</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-right leading-relaxed">
                لا تتردد في طرح الأسئلة عبر نظام الاستفسارات. الوضوح في البداية يوفر عليك الوقت والجهد لاحقاً
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-900">تحقق مرتين</h4>
                  <p className="text-xs text-red-600">دقة البيانات</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-right leading-relaxed">
                راجع جميع المعلومات المدخلة قبل الإرسال. المعلومات الخاطئة أو المفقودة قد تؤثر سلباً على تقييمك
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-gray-900">كن متاحاً</h4>
                  <p className="text-xs text-teal-600">التواصل المستمر</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-right leading-relaxed">
                حافظ على التواصل المهني واستجب للاستفسارات والمتطلبات الإضافية بسرعة ووضوح
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-tawreed-green border-dashed">
            <div className="flex items-center gap-4 text-right">
              <div className="w-12 h-12 bg-tawreed-green rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-tawreed-green mb-2">نصيحة ذهبية</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  ابدأ بالمناقصات الصغيرة لبناء سمعتك وزيادة معدل نجاحك، ثم انتقل تدريجياً للمشاريع الأكبر. 
                  السمعة الجيدة في المنصة تزيد من فرصك في الفوز بالمناقصات المستقبلية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}