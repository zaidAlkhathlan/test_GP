import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import TenderCard from '../components/TenderCard';
import { Tender } from '@shared/api';

// AI Prediction Component
interface AIPredictionDashboardProps {
  appliedTenders: AppliedTender[];
}

const AIPredictionDashboard: React.FC<AIPredictionDashboardProps> = ({ appliedTenders }) => {
  const rejectedCount = appliedTenders.filter(t => t.submissionStatus === 'rejected').length;
  const underReviewCount = appliedTenders.filter(t => t.submissionStatus === 'pending' || t.submissionStatus === 'under_review').length;
  const acceptedCount = appliedTenders.filter(t => t.submissionStatus === 'accepted').length;
  const totalCount = appliedTenders.length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">توقعات الذكاء الاصطناعي</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Success Rate Prediction */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-green-800">نسبة النجاح المتوقعة</h4>
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">92.1%</span>
            </div>
          </div>
          <p className="text-xs text-green-700">بناءً على تاريخ عروضك السابقة</p>
          <div className="mt-3 bg-green-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '92.1%' }}></div>
          </div>
        </div>

        {/* Applications Count */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-blue-800">المناقصات المقدم عليها</h4>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">25</span>
            </div>
          </div>
          <p className="text-xs text-blue-700">خلال الأسبوع الحالي</p>
          <div className="text-sm font-semibold text-blue-600 mt-2">↗️ +12% من الأسبوع الماضي</div>
        </div>

        {/* Market Prices */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-purple-800">أسعار السوق المتوقعة</h4>
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/>
              </svg>
            </div>
          </div>
          <p className="text-xs text-purple-700">اتجاه الأسعار الحالي</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-20 h-12 bg-purple-200 rounded relative">
              <svg className="w-full h-full" viewBox="0 0 80 48" preserveAspectRatio="none">
                <path d="M0,40 L20,35 L40,28 L60,20 L80,15" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                <path d="M0,40 L20,35 L40,28 L60,20 L80,15 L80,48 L0,48 Z" fill="rgba(139, 92, 246, 0.1)"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-purple-600">↗️ صاعد</span>
          </div>
        </div>

        {/* Competition Analysis */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-orange-800">تحليل المنافسة</h4>
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">متوسط</span>
            </div>
          </div>
          <p className="text-xs text-orange-700">مستوى المنافسة في مجالك</p>
          <div className="flex items-center gap-1 mt-2">
            {[1,2,3,4,5].map((i) => (
              <div 
                key={i} 
                className={`h-2 w-3 rounded-sm ${i <= 3 ? 'bg-orange-500' : 'bg-orange-200'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
            </svg>
          </div>
          <div>
            <p className="font-medium text-indigo-900">نصائح من الذكاء الاصطناعي</p>
            <p className="text-sm text-indigo-700 mt-1">
              بناءً على تحليل السوق، ننصح بزيادة تنافسية عروضك بنسبة 5-8% للحصول على فرص أفضل في المناقصات القادمة.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Summary Cards */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        {/* Rejected Offers */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-red-600 mb-1">{rejectedCount}</p>
          <p className="text-sm text-gray-600">عروض مرفوضة</p>
        </div>

        {/* Under Review */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mb-1">{underReviewCount}</p>
          <p className="text-sm text-gray-600">قيد المراجعة</p>
        </div>

        {/* Accepted Offers */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-green-600 mb-1">{acceptedCount}</p>
          <p className="text-sm text-gray-600">عروض مقبولة</p>
        </div>

        {/* Total Offers */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-blue-600 mb-1">{totalCount}</p>
          <p className="text-sm text-gray-600">إجمالي العروض</p>
        </div>
      </div>
    </div>
  );
};

// Applied Tender Card Component using existing TenderCard design
interface AppliedTender extends Tender {
  submissionStatus: 'pending' | 'accepted' | 'rejected' | 'under_review';
  offerAmount?: string;
  submissionDate?: string;
}

const AppliedTenderCard: React.FC<{ tender: AppliedTender }> = ({ tender }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'under_review': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'accepted': return 'مقبول';
      case 'rejected': return 'مرفوض';
      case 'under_review': return 'قيد المراجعة';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm p-8 min-h-[420px]" dir="rtl">
      {/* Title & Company */}
      <div className="mb-6 text-right">
        <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{tender.title}</h3>
        <p className="text-base text-gray-600">{tender.company}</p>
      </div>

      {/* Category tags */}
      <div className="mb-4 text-right">
        <div className="inline-flex gap-2 flex-wrap">
          {tender.category && (
            <span className="px-3 py-1 rounded bg-[#28A745] text-white text-xs font-medium">{tender.category}</span>
          )}
          {tender.subDomains && tender.subDomains.map((subDomain, index) => (
            <span key={index} className="px-3 py-1 rounded bg-gray-600 text-white text-xs">
              {subDomain}
            </span>
          ))}
        </div>
      </div>

      {/* Location */}
      {tender.location && (
        <div className="mb-4 text-right">
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{tender.location}</span>
          </div>
        </div>
      )}

      {/* Progress and Date Info */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-right">
              <span className="text-sm text-gray-600 block">موعد انتهاء تقديم العروض</span>
              <span className="text-sm font-medium">{tender.offerDeadline}</span>
            </div>
          </div>
          <ProgressRing percentage={Math.min(100, (tender.remainingDays / 30) * 100)} days={tender.remainingDays} />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-[#28A745]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-right">
              <span className="text-sm text-gray-600 block">موعد انتهاء الاستفسارات</span>
              <span className="text-sm font-medium">{tender.inquiryDeadline}</span>
            </div>
          </div>
          <ProgressRing percentage={Math.min(100, (tender.remainingInquiryDays / 30) * 100)} days={tender.remainingInquiryDays} />
        </div>
      </div>

      {/* Submission Info */}
      {tender.submissionDate && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-blue-800 font-medium">تاريخ التقديم: </span>
              <span className="text-sm text-blue-700">{tender.submissionDate}</span>
            </div>
            {tender.offerAmount && (
              <div>
                <span className="text-sm text-blue-800 font-medium">قيمة العرض: </span>
                <span className="text-sm font-bold text-blue-900">{tender.offerAmount} ريال</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mb-4 justify-end">
        <Link to={`/tender/${tender.id}`}>
          <button className="h-8 px-4 rounded text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50">
            التفاصيل
          </button>
        </Link>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(tender.submissionStatus)}`}></div>
          <button className={`h-8 px-4 rounded text-sm text-white ${getStatusColor(tender.submissionStatus)}`}>
            حالة التقديم: {getStatusText(tender.submissionStatus)}
          </button>
        </div>
      </div>

      {/* Budget */}
      <div className="mb-6 text-right">
        <span className="text-base text-gray-600 block mb-1">الميزانية المتوقعة:</span>
        <div className="text-2xl font-bold text-gray-900">{tender.budget || '100,000 ريال'}</div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
        <span>تاريخ النشر: {tender.publishDate}</span>
        <span>الرقم المرجعي {tender.referenceNumber}</span>
      </div>
    </div>
  );
};

function ProgressRing({ percentage, days }: { percentage: number; days: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  const getColor = (days: number) => {
    if (days <= 3) return "#EF4444";
    if (days <= 7) return "#F59E0B";
    return "#10B981";
  };

  const color = getColor(days);

  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={radius} stroke="#E5E7EB" strokeWidth="3" fill="none" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold" style={{ color }}>{days}</span>
        <span className="text-[10px] font-medium text-gray-600">يوم</span>
      </div>
    </div>
  );
}

export default function AppliedTenders() {
  const [appliedTenders, setAppliedTenders] = useState<AppliedTender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if supplier is logged in
    const supplierSession = localStorage.getItem('supplierSession') || localStorage.getItem('currentSupplier');
    if (!supplierSession) {
      // Redirect to login if not authenticated
      window.location.href = '/supplier/signin';
      return;
    }

    // Fetch applied tenders (mock data for now - will be replaced with API call)
    fetchAppliedTenders();
  }, []);

  const fetchAppliedTenders = async () => {
    setLoading(true);
    try {
      // Get supplier data from localStorage
      const supplierData = localStorage.getItem('supplier') || localStorage.getItem('supplierSession') || localStorage.getItem('currentSupplier');
      if (!supplierData) {
        console.error('No supplier data found');
        return;
      }

      const supplier = JSON.parse(supplierData);
      const supplierId = supplier.ID || supplier.id;

      if (!supplierId) {
        console.error('No supplier ID found');
        return;
      }

      // Fetch proposals from backend API (updated from offers)
      const response = await fetch(`/api/suppliers/${supplierId}/proposals`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Transform backend data to AppliedTender format
        const transformedData: AppliedTender[] = result.data.map((offer: any) => {
          // Calculate remaining days
          const now = new Date();
          const offerDeadline = new Date(offer.submit_deadline);
          const remainingDays = Math.ceil((offerDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          // Map offer status to submission status
          const submissionStatus = offer.status === 'submitted' ? 'under_review' :
                                  offer.status === 'accepted' ? 'accepted' :
                                  offer.status === 'rejected' ? 'rejected' :
                                  'pending';

          return {
            id: offer.tender_id?.toString() || offer.id?.toString() || '',
            title: offer.tender_title || 'غير محدد',
            company: offer.buyer_company || 'غير محدد',
            category: 'غير محدد', // Could be derived from domain
            location: 'غير محدد',
            budget: offer.expected_budget ? `${offer.expected_budget.toLocaleString()} ريال` : 'غير محدد',
            publishDate: offer.created_at ? new Date(offer.created_at).toISOString().split('T')[0] : '',
            offerDeadline: offer.submit_deadline || '',
            inquiryDeadline: offer.quires_deadline || '',
            remainingDays: remainingDays,
            remainingInquiryDays: remainingDays - 3, // Assuming inquiry deadline is 3 days before offer deadline
            status: remainingDays > 0 ? 'active' : 'expired',
            referenceNumber: offer.reference_number ? `#${offer.reference_number}` : '#N/A',
            subDomains: [], // Could be populated from tender data
            submissionStatus: submissionStatus,
            offerAmount: offer.offer_value ? offer.offer_value.toLocaleString() : '0',
            submissionDate: offer.submitted_at ? new Date(offer.submitted_at).toISOString().split('T')[0] : ''
          };
        });

        setAppliedTenders(transformedData);
      } else {
        // No offers found - show empty state
        setAppliedTenders([]);
      }
    } catch (error) {
      console.error('Error fetching applied tenders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header userType="supplier" />
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-4 gap-6">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[1,2,3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="supplier" />
      
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8" dir="rtl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">المناقصات المقدم عليها</h1>
          <p className="text-gray-600">تتبع حالة العروض التي قدمتها والنتائج المتوقعة</p>
        </div>

        {/* AI Prediction Dashboard */}
        <AIPredictionDashboard appliedTenders={appliedTenders} />

        {/* Applied Tenders List */}
        <div className="bg-white rounded-lg shadow-sm p-8" dir="rtl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">عروضي المقدمة</h2>
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">جميع الحالات</option>
                <option value="pending">في الانتظار</option>
                <option value="under_review">قيد المراجعة</option>
                <option value="accepted">مقبولة</option>
                <option value="rejected">مرفوضة</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">آخر شهر</option>
                <option value="week">آخر أسبوع</option>
                <option value="month">آخر شهر</option>
                <option value="quarter">آخر 3 أشهر</option>
                <option value="year">آخر سنة</option>
              </select>
            </div>
          </div>

          {appliedTenders.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {appliedTenders.map((tender) => (
                <AppliedTenderCard
                  key={tender.id}
                  tender={tender}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مناقصات مقدم عليها</h3>
              <p className="text-gray-600 mb-6">لم تقم بتقديم أي عروض بعد. ابدأ بتصفح المناقصات المتاحة.</p>
              <Link 
                to="/supplier/home"
                className="inline-flex items-center gap-2 px-6 py-3 bg-tawreed-green text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                تصفح المناقصات المتاحة
              </Link>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}