import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Header from '../components/Header';

export default function TenderDetails() {
  const { id } = useParams();
  const [tenderData, setTenderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tender details from backend
  useEffect(() => {
    if (!id) return;

    const fetchTenderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tenders/${id}`);
        
        if (!response.ok) {
          throw new Error('Tender not found');
        }
        
        const data = await response.json();
        console.log('Tender data:', data); // Debug log
        console.log('Sub-domains:', data.subDomains); // Debug log
        console.log('Licenses:', data.licenses); // Debug log
        console.log('Certificates:', data.certificates); // Debug log
        console.log('Tender domain name:', data.tender?.domain_name); // Debug log
        setTenderData(data);
      } catch (err) {
        console.error('Error fetching tender details:', err);
        setError(err instanceof Error ? err.message : 'خطأ في تحميل بيانات المناقصة');
      } finally {
        setLoading(false);
      }
    };

    fetchTenderDetails();
  }, [id]);

  // Helper function to calculate remaining days
  const getRemainingDays = (deadline: string) => {
    if (!deadline) return 0;
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('/').reverse().join('/');
  };

  // Function to create progress circle
  const ProgressCircle = ({ days, color }: { days: number; color: string }) => (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${color}`}>
      {days}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userType="buyer" />
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="bg-white rounded-lg shadow-sm p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tenderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userType="buyer" />
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">المناقصة غير موجودة</h3>
            <p className="text-gray-600 mb-6">{error || 'لم يتم العثور على المناقصة المطلوبة'}</p>
            <Link to="/tenders/active" className="px-4 py-2 bg-tawreed-green text-white rounded-lg hover:bg-green-600">
              العودة للمناقصات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { tender, licenses = [], certificates = [], subDomains = [] } = tenderData;
  const remainingOfferDays = getRemainingDays(tender.submit_deadline);
  const remainingInquiryDays = getRemainingDays(tender.quires_deadline);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="buyer" />
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8" dir="rtl">
          <div className="flex items-center justify-between mb-8">
            <div className="text-right">
              <h2 className="text-2xl font-semibold text-green-700 mb-2">{tender.title || 'بناء ورشة سيارات'}</h2>
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
                  <span className="text-gray-500">الرقم المرجعي</span>
                  <span className="text-gray-900 font-medium">#{tender.reference_number || '250739010054'}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-500">تاريخ النشر</span>
                  <span className="text-gray-900 font-medium">{formatDate(tender.created_at)}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-500">المدينة</span>
                  <span className="text-gray-900 font-medium">{tender.city || 'الرياض'}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-500">مدة التنفيذ</span>
                  <span className="text-gray-900 font-medium">{tender.contract_time || 'غير محدد'}</span>
                </div>
                
                <div className="flex justify-between items-center py-4 border-b border-gray-100">
                  <span className="text-gray-500">النشاط الرئيسي</span>
                  <div className="text-right">
                    {tender.domain_name ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        {tender.domain_name}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">غير محدد</span>
                    )}
                  </div>
                </div>
                
                {subDomains && subDomains.length > 0 && (
                  <div className="flex justify-between items-start py-4">
                    <span className="text-gray-500">الأنشطة الفرعية</span>
                    <div className="text-right space-y-2">
                      <div className="flex flex-wrap gap-2 justify-end">
                        {subDomains.map((subDomain: any, index: number) => (
                          <span key={subDomain.ID} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            {subDomain.Name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
                    <ProgressCircle 
                      days={remainingOfferDays} 
                      color={remainingOfferDays > 7 ? "bg-green-500" : remainingOfferDays > 3 ? "bg-orange-500" : "bg-red-500"} 
                    />
                    <div className="text-right">
                      <p className="text-gray-900 font-medium">موعد انتهاء تقديم العروض</p>
                      <p className="text-sm text-gray-500">{formatDate(tender.submit_deadline)}</p>
                    </div>
                  </div>
                </div>

                {/* Inquiry Deadline */}
                <div className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <ProgressCircle 
                      days={remainingInquiryDays} 
                      color={remainingInquiryDays > 7 ? "bg-green-500" : remainingInquiryDays > 3 ? "bg-orange-500" : "bg-red-500"} 
                    />
                    <div className="text-right">
                      <p className="text-gray-900 font-medium">موعد انتهاء الاستفسارات</p>
                      <p className="text-sm text-gray-500">{formatDate(tender.quires_deadline)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities - Only show if activities exist */}
        {tender.activities && tender.activities.length > 0 && (
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
              {tender.activities.map((activity: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                    activity.type === 'offer' ? 'bg-green-500' : 
                    activity.type === 'inquiry' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.company && `${activity.company} - `}
                      {new Date(activity.timestamp).toLocaleString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Content - Stats and Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-right" dir="rtl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">📅</div>
              <div>
                <p className="text-sm text-gray-500">الأيام المتبقية</p>
                <p className={`text-xl font-bold ${remainingOfferDays > 7 ? 'text-tawreed-green' : remainingOfferDays > 3 ? 'text-orange-500' : 'text-red-500'}`}>
                  {remainingOfferDays}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-right" dir="rtl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center text-2xl">📄</div>
              <div>
                <p className="text-sm text-gray-500">العروض المقدمة</p>
                <p className="text-xl font-bold">{tender.stats?.offersCount || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 text-right" dir="rtl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">❓</div>
              <div>
                <p className="text-sm text-gray-500">عدد الاستفسارات</p>
                <Link to={id ? `/tender/${id}/quires` : '#'} className="text-xl font-bold text-tawreed-green hover:underline">
                  {tender.stats?.inquiriesCount || 0}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Only show description if it exists */}
            {(tender.description || tender.project_description) && (
              <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
                <h4 className="font-semibold text-lg mb-4">وصف المناقصة</h4>
                <p className="text-gray-600 leading-relaxed">
                  {tender.description || tender.project_description}
                </p>
              </div>
            )}

            {/* Show evaluation criteria if it exists */}
            {tender.evaluation_criteria && (
              <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-lg">معايير التقييم</h4>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {tender.evaluation_criteria}
                </p>
              </div>
            )}

            {/* Show used technologies if it exists */}
            {tender.used_technologies && (
              <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-lg">التقنيات المستخدمة</h4>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {tender.used_technologies}
                </p>
              </div>
            )}

            {/* Only show technical requirements if they exist */}
            {tender.technicalRequirements && tender.technicalRequirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
                <h4 className="font-semibold text-lg mb-4">المتطلبات الفنية</h4>
                <ul className="space-y-3 text-gray-600">
                  {tender.technicalRequirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Only show financial requirements if they exist */}
            {tender.financialRequirements && (
              <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
                <h4 className="font-semibold text-lg mb-4">المتطلبات المالية</h4>
                <p className="text-gray-600">
                  {tender.financialRequirements}
                </p>
              </div>
            )}

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
              
              {licenses && licenses.length > 0 ? (
                <div className="space-y-4">
                  {licenses.map((license: any, index: number) => (
                    <div key={license.ID || index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-900 font-medium">{license.Name}</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            مطلوب
                          </span>
                        </div>
                      
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
                  </svg>
                  <p>لا توجد تراخيص محددة مطلوبة لهذه المناقصة</p>
                  <p className="text-xs mt-1">يُرجى الرجوع إلى الوثائق التفصيلية</p>
                </div>
              )}
            </div>

            {/* Required Certificates */}
            <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                    <path d="M12,12L10,10V13H8V15H10V18L12,16L14,18V15H16V13H14V10L12,12Z" fill="#8B5CF6" />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg">الشهادات المطلوبة</h4>
              </div>
              
              {certificates && certificates.length > 0 ? (
                <div className="space-y-4">
                  {certificates.map((certificate: any, index: number) => (
                    <div key={certificate.ID || index} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M13,21L15.5,18.5L18,21V12H13V21M4,3H18A2,2 0 0,1 20,5V19A2,2 0 0,1 18,21H13V19H18V5H4V19H11V21H4A2,2 0 0,1 2,19V5A2,2 0 0,1 4,3M6,7H16V9H6V7M6,11H16V13H6V11M6,15H11V17H6V15Z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-gray-900 font-medium">{certificate.Name}</span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            مطلوب
                          </span>
                        </div>
                        
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2L3 7v4c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-7-5z" clipRule="evenodd" />
                  </svg>
                  <p>لا توجد شهادات محددة مطلوبة لهذه المناقصة</p>
                  <p className="text-xs mt-1">يُرجى الرجوع إلى الوثائق التفصيلية</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
              <h5 className="font-semibold text-lg mb-4">ملفات المناقصة</h5>
              {tender.documents && tender.documents.length > 0 ? (
                <div className="space-y-3">
                  {tender.documents.map((document: any, index: number) => (
                    document.name && (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50">
                        <div className="flex-1">
                          <span className="text-sm text-gray-900 font-medium block">{document.name}</span>
                          {document.size && <span className="text-xs text-gray-500">{document.size}</span>}
                        </div>
                        <a 
                          href={document.url} 
                          download={document.name}
                          className="px-3 py-1.5 bg-tawreed-green text-white text-sm rounded hover:bg-green-600 transition-colors"
                        >
                          تحميل
                        </a>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <p>لا توجد ملفات مرفقة</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
              <h5 className="font-semibold text-lg mb-4">معلومات الاتصال</h5>
              <div className="space-y-3 text-sm">
                {tender.tender_coordinator && (
                  <div>
                    <span className="text-gray-500">منسق المناقصة:</span>
                    <p className="text-gray-900">{tender.tender_coordinator}</p>
                  </div>
                )}
                {(tender.contactInfo?.email || tender.coordinator_email) && (
                  <div>
                    <span className="text-gray-500">البريد الإلكتروني:</span>
                    <p className="text-gray-900">{tender.contactInfo?.email || tender.coordinator_email}</p>
                  </div>
                )}
                {(tender.contactInfo?.phone || tender.coordinator_phone) && (
                  <div>
                    <span className="text-gray-500">رقم الهاتف:</span>
                    <p className="text-gray-900">{tender.contactInfo?.phone || tender.coordinator_phone}</p>
                  </div>
                )}
                {tender.contactInfo?.address && (
                  <div>
                    <span className="text-gray-500">العنوان:</span>
                    <p className="text-gray-900">{tender.contactInfo.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
