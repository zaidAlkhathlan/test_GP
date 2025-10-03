import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';

export default function TenderOffers() {
  const { id } = useParams();
  const navigate = useNavigate();
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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8" dir="rtl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">بناء ورشة سيارات</h2>
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
              <p className="text-sm text-gray-500 mb-1">2025-08-04</p>
              <p className="font-semibold">تاريخ الانتهاء</p>
            </div>
            
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-1">1,000,000 ريال</p>
              <p className="font-semibold">ميزانية المناقصة</p>
            </div>
            
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-1">8</p>
              <p className="font-semibold">إجمالي العروض</p>
            </div>
          </div>
        </div>

        {/* Offers Ranking Section */}
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
                </div>

                {/* Files and Actions */}
                <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      ملف عادي
                    </button>
                    
                    <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      ملف تجاري
                    </button>
                    
                    <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      ملف الضريبة
                    </button>
                    
                    <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      ملف اضافي
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">عرض وتحميل المفات</span>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Award Button */}
                <div className="p-4 bg-white">
                  <button
                    className="w-full bg-tawreed-green text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    onClick={() => navigate(`/tender/${id}/award/${offer.id}`, { state: { supplier: offer.supplier } })}
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
