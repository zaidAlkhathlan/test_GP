import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';

interface Proposal {
  id: number;
  reference_number: number;
  proposal_price: number;
  created_at: string;
  company_name: string;
  project_description: string;
  extra_description: string;
  tender_id: number;
  supplier_id: number;
  supplier_company_name: string;
  supplier_email: string;
  supplier_account_name: string;
  supplier_commercial_record: string;
  supplier_phone: string;
  supplier_account_phone: string;
  supplier_city: string;
  supplier_domain_name: string;
  licenses: string[];
  certificates: string[];
}

export default function TenderOffers() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modalSupplier, setModalSupplier] = useState<any | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenderInfo, setTenderInfo] = useState<any>(null);
  const [fileModalProposal, setFileModalProposal] = useState<any | null>(null);

  // Debug effect to track tenderInfo state changes
  useEffect(() => {
    console.log('TenderInfo state changed:', tenderInfo);
  }, [tenderInfo]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch proposals for the tender
        const proposalsResponse = await fetch(`/api/tenders/${id}/proposals`);
        if (proposalsResponse.ok) {
          const proposalsData = await proposalsResponse.json();
          console.log('Proposals API response:', proposalsData);
          
          if (proposalsData.success && proposalsData.data) {
            setProposals(proposalsData.data);
          } else {
            console.warn('No proposals data in response:', proposalsData);
            setProposals([]);
          }
        } else {
          console.error('Failed to fetch proposals:', proposalsResponse.status);
          setProposals([]);
        }

        // Fetch tender details
        const tenderResponse = await fetch(`/api/tenders/${id}`);
        if (tenderResponse.ok) {
          const tenderData = await tenderResponse.json();
          console.log('Tender API response:', tenderData);
          setTenderInfo(tenderData);
        } else {
          console.error('Failed to fetch tender data:', tenderResponse.status);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setProposals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Transform proposal data to match the UI expectations
  const formatProposalForUI = (proposal: Proposal, index: number) => {
    // Format the price properly
    const formattedPrice = proposal.proposal_price 
      ? `${Number(proposal.proposal_price).toLocaleString('ar-SA')} ريال`
      : 'غير محدد';

    // Format the date properly
    const formattedDate = proposal.created_at 
      ? new Date(proposal.created_at).toLocaleDateString('ar-SA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      : 'غير محدد';

    return {
      id: proposal.id.toString(),
      company: proposal.supplier_company_name || proposal.company_name || 'اسم الشركة غير متوفر',
      amount: formattedPrice,
      date: formattedDate,
      status: 'قيد المراجعة', // Default status - you can enhance this based on your business logic
      summary: [
        // Smart summary will be populated by external API
      ],
      supplier: {
        name: proposal.supplier_company_name || proposal.company_name || 'اسم الشركة غير متوفر',
        commercialRecord: proposal.supplier_commercial_record || 'غير متوفر',
        phone: proposal.supplier_phone || proposal.supplier_account_phone || 'غير متوفر',
        city: proposal.supplier_city || 'غير متوفر',
        industry: proposal.supplier_domain_name || 'غير محدد',
        licenses: Array.isArray(proposal.licenses) ? proposal.licenses : [],
        certs: Array.isArray(proposal.certificates) ? proposal.certificates : [],
        contact: { 
          name: proposal.supplier_account_name || 'غير متوفر', 
          email: proposal.supplier_email || 'غير متوفر', 
          mobile: proposal.supplier_account_phone?.toString() || proposal.supplier_phone || 'غير متوفر'
        },
        registeredOnPlatformYears: 'جديد', // Default value - you can calculate this based on supplier creation date
        additionalNotes: proposal.extra_description ? [proposal.extra_description] : [] // Additional notes from proposal
      }
    };
  };

  // Convert proposals to the expected format
  const offers = proposals.map(formatProposalForUI);

  const openSupplierModal = (supplier: any) => setModalSupplier(supplier);
  const closeSupplierModal = () => setModalSupplier(null);
  
  const openFileModal = (proposal: any) => setFileModalProposal(proposal);
  const closeFileModal = () => setFileModalProposal(null);
  
  const downloadFile = async (proposalId: string, fileType: string) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}/files/${fileType}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${fileType}_${proposalId}`; // Extension will be determined by server
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('فشل في تحميل الملف - قد يكون الملف غير متوفر');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('حدث خطأ أثناء تحميل الملف');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="buyer" />
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8" dir="rtl">
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900">تقييم العروض المقدمة</h1>
          </div>
          <div>
            <Link to={id ? `/tender/${id}` : '/buyer'} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
              تقييم نهائي
            </Link>
          </div>
        </div>

        {/* Tender Info Cards */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8" dir="rtl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">{tenderInfo?.tender?.title || 'خطأ في تحميل العنوان'}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">جاري التقييم</p>
                <p className="font-semibold text-green-600">حالة المناقصة</p>
              </div>
              
              <div className="bg-white border rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  {tenderInfo?.tender?.submit_deadline ? new Date(tenderInfo.tender.submit_deadline).toLocaleDateString('ar-SA') : 'خطأ في التحميل'}
                </p>
                <p className="font-semibold">تاريخ الانتهاء</p>
              </div>
              
              <div className="bg-white border rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">
                  {tenderInfo?.tender?.expected_budget ? 
                    `${Number(tenderInfo.tender.expected_budget).toLocaleString('ar-SA')} ريال` : 
                    'غير محدد'}
                </p>
                <p className="font-semibold">ميزانية المناقصة</p>
              </div>
              
              <div className="bg-white border rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-1">{offers.length}</p>
                <p className="font-semibold">إجمالي العروض</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center" dir="rtl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tawreed-green mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل العروض المقدمة...</p>
          </div>
        )}

        {/* No Proposals State */}
        {!loading && offers.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center" dir="rtl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد عروض مقدمة</h3>
            <p className="text-gray-600 mb-4">لم يتم تقديم أي عروض لهذه المناقصة حتى الآن</p>
            <Link 
              to={`/tender/${id}`}
              className="inline-flex items-center px-4 py-2 bg-tawreed-green text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              العودة إلى تفاصيل المناقصة
            </Link>
          </div>
        )}

        {/* Offers Ranking Section */}
        {!loading && offers.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6" dir="rtl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>ترتيب حسب العرض الأفضل</span>
            </h3>
            
            <div className="space-y-6">
              {offers.map((offer, index) => (
              <div key={offer.id} className="border border-gray-200 rounded-lg overflow-hidden">
                
                {/* Company Header */}
                <div className="bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-700 font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{offer.company}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>تاريخ التقديم: {offer.date}</span>
                          <span>إجمالي العرض: <span className="font-bold text-green-600">{offer.amount}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => openSupplierModal(offer.supplier)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        تفاصيل المورد
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          offer.status === 'قيد المراجعة' ? 'bg-yellow-100 text-yellow-800' :
                          offer.status === 'معتمد' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {offer.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Analysis Section */}
                <div className="p-6 bg-blue-50 border-t">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h5 className="font-semibold text-blue-900">ملخص العرض الذكي</h5>
                  </div>
                  
                  {offer.summary.length > 0 ? (
                    <div className="space-y-3">
                      {offer.summary.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm mb-2">الملخص الذكي غير متوفر</p>
                      <p className="text-gray-400 text-xs">سيتم عرض التحليل الذكي عند ربط الـ API الخارجي</p>
                    </div>
                  )}
                </div>

                {/* Additional Notes Section */}
                <div className="p-6 bg-gray-50 border-t">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h5 className="font-semibold text-purple-900">الملاحظات الإضافية</h5>
                  </div>
                  
                  <div className="space-y-3">
                    {offer.supplier.additionalNotes && offer.supplier.additionalNotes.length > 0 ? (
                      offer.supplier.additionalNotes.map((note, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-4 border border-purple-100">
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-gray-700">{note}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm">لا توجد ملاحظات إضافية</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Files and Actions */}
                <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">الملفات المرفقة:</span>
                    <span className="text-sm text-gray-500">الملف الفني، الملف المالي، ملفات إضافية</span>
                  </div>

                  <button 
                    onClick={() => openFileModal(offer)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    عرض وتحميل الملفات
                  </button>
                </div>

                {/* Award Button */}
                <div className="p-4 bg-white">
                  <button
                    className="w-full bg-tawreed-green text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    onClick={() => navigate(`/tender/${id}/award/${offer.id}`, { state: { supplier: offer.supplier, proposalId: offer.id } })}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    اعتماد المورد الفائز
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* File Download Modal */}
        {fileModalProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={closeFileModal}></div>
            <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden" dir="rtl">
              
              {/* Modal Header */}
              <div className="bg-gray-50 p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">ملفات العرض</h3>
                    <p className="text-gray-600 mt-1">{fileModalProposal.company}</p>
                  </div>
                  <button 
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors" 
                    onClick={closeFileModal}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Technical File */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold">الملف الفني</h4>
                        <p className="text-sm text-gray-500">المواصفات والوثائق التقنية</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => downloadFile(fileModalProposal.id, 'technical_file')}
                      className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      تحميل
                    </button>
                  </div>

                  {/* Financial File */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold">الملف المالي</h4>
                        <p className="text-sm text-gray-500">العروض المالية والتكاليف</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => downloadFile(fileModalProposal.id, 'financial_file')}
                      className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      تحميل
                    </button>
                  </div>

                  {/* Company File */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold">ملف الشركة</h4>
                        <p className="text-sm text-gray-500">وثائق الشركة والتراخيص</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => downloadFile(fileModalProposal.id, 'company_file')}
                      className="w-full px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      تحميل
                    </button>
                  </div>

                  {/* Extra File */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold">ملفات إضافية</h4>
                        <p className="text-sm text-gray-500">مستندات أخرى مرفقة</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => downloadFile(fileModalProposal.id, 'extra_file')}
                      className="w-full px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      تحميل
                    </button>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>جميع الملفات محمية ومشفرة</span>
                    </div>
                    <span>العرض رقم: {fileModalProposal.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Supplier modal */}
        {modalSupplier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={closeSupplierModal}></div>
            <div className="relative bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden" dir="rtl">
              
              {/* Modal Header */}
              <div className="bg-gray-50 p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{modalSupplier.name}</h3>
                    <p className="text-gray-600 mt-1">{modalSupplier.name}</p>
                  </div>
                  <button 
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors" 
                    onClick={closeSupplierModal}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="max-h-[70vh] overflow-y-auto">
                
                {/* Commercial Information Section */}
                <div className="p-6 border-b">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg">المعلومات التجارية</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">السجل التجاري</p>
                        <p className="font-medium text-gray-900">{modalSupplier.commercialRecord}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">المدينة</p>
                        <p className="font-medium text-gray-900">{modalSupplier.city}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">رقم الهاتف التجاري</p>
                        <p className="font-medium text-gray-900">{modalSupplier.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">النشاط الرئيسي</p>
                        <p className="font-medium text-gray-900">{modalSupplier.industry}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Licenses and Certifications */}
                <div className="p-6 border-b">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg">التراخيص والشهادات</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-3">التراخيص</p>
                      <div className="flex gap-2 flex-wrap">
                        {modalSupplier.licenses.map((license: string) => (
                          <span key={license} className="px-3 py-2 bg-green-50 text-green-800 rounded-lg text-sm font-medium">
                            {license}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-3">الشهادات</p>
                      <div className="flex gap-2 flex-wrap">
                        {modalSupplier.certs.map((cert: string) => (
                          <span key={cert} className="px-3 py-2 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-lg">بيانات المسؤول</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">اسم المسؤول</p>
                      <p className="font-medium text-gray-900">{modalSupplier.contact.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">رقم الجوال</p>
                      <p className="font-medium text-gray-900">{modalSupplier.contact.mobile}</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 mb-1">البريد الإلكتروني</p>
                      <p className="font-medium text-gray-900">{modalSupplier.contact.email}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>تاريخ التسجيل في المنصة:</span>
                    </div>
                    <span className="font-medium text-gray-900">{modalSupplier.registeredOnPlatformYears}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
