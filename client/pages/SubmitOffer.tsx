import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';

interface FileUpload {
  id: string;
  name: string;
  file: File | null;
  required: boolean;
}

export default function SubmitOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tenderTitle, setTenderTitle] = useState('');
  
  // Form state
  const [offerValue, setOfferValue] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // File uploads state
  const [files, setFiles] = useState<FileUpload[]>([
    { id: 'technical', name: 'ملف العرض الفني (إجباري)', file: null, required: true },
    { id: 'financial', name: 'ملف العرض المالي (إجباري)', file: null, required: true },
    { id: 'company', name: 'ملف الشركة الاعتبارية', file: null, required: false },
    { id: 'additional', name: 'ملفات أخرى اختيارية', file: null, required: false },
  ]);

  useEffect(() => {
    // Check if supplier is logged in
    const supplierSession = localStorage.getItem('supplierSession') || localStorage.getItem('currentSupplier');
    if (!supplierSession) {
      navigate('/supplier/signin');
      return;
    }

    // Fetch tender title (mock data for now)
    setTenderTitle('بناء ورشة سيارات');
  }, [navigate]);

  const handleFileChange = (fileId: string, file: File | null) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, file } : f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required files
    const requiredFiles = files.filter(f => f.required);
    const missingFiles = requiredFiles.filter(f => !f.file);
    
    if (missingFiles.length > 0) {
      alert(`يرجى رفع الملفات المطلوبة: ${missingFiles.map(f => f.name).join(', ')}`);
      return;
    }

    if (!offerValue) {
      alert('يرجى إدخال قيمة العرض');
      return;
    }

    setLoading(true);
    
    try {
      // Here you would submit the form data to your backend
      console.log('Submitting offer:', { offerValue, additionalNotes, files });
      
      // Mock submission delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('تم تقديم العرض بنجاح!');
      navigate('/supplier/offers');
      
    } catch (error) {
      console.error('Error submitting offer:', error);
      alert('حدث خطأ أثناء تقديم العرض. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header userType="supplier" />
      
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to={`/tender/${id}`} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">تقديم عرض للمناقصة</h1>
              <p className="text-gray-600">رقم المناقصة: {id}</p>
            </div>
          </div>
          
          {tenderTitle && (
            <div className="bg-white rounded-lg p-4 border-r-4 border-tawreed-green">
              <h2 className="font-semibold text-gray-900">{tenderTitle}</h2>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Right Side - Offer Details */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">تفاصيل العرض</h3>
                
                <div className="space-y-6">
                  {/* Offer Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      قيمة العرض *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={offerValue}
                        onChange={(e) => setOfferValue(e.target.value)}
                        placeholder="أدخل قيمة العرض"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tawreed-green focus:border-transparent"
                        required
                      />
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ريال
                      </span>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ملاحظات إضافية
                    </label>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="أي ملاحظات أو تفاصيل إضافية..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tawreed-green focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => navigate(`/tender/${id}`)}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-tawreed-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'جاري التقديم...' : 'تقديم العرض'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Side - Required Documents */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">المستندات المطلوبة</h3>
                
                <div className="space-y-6">
                  {files.map((fileItem) => (
                    <div key={fileItem.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          {fileItem.name}
                          {fileItem.required && <span className="text-red-500 mr-1">*</span>}
                        </h4>
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                      </div>
                      
                      {fileItem.file ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm text-green-800">{fileItem.file.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileChange(fileItem.id, null)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              إزالة
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-tawreed-green transition-colors">
                          <input
                            type="file"
                            id={fileItem.id}
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleFileChange(fileItem.id, file);
                            }}
                          />
                          <label
                            htmlFor={fileItem.id}
                            className="cursor-pointer flex flex-col items-center gap-2"
                          >
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-sm text-gray-600">انقر لرفع الملف</span>
                            <span className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG</span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Notice */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">تنبيه هام:</p>
              <p>يُرجى التأكد من رفع جميع الوثائق المطلوبة والتحقق من صحة البيانات قبل التقديم. لن يتم قبول العروض الناقصة أو المتأخرة.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}