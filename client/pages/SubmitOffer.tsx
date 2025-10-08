import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { RequiredFile } from '@shared/api';

interface FileUpload {
  id: string;
  name: string;
  file: File | null;
  required: boolean;
  description?: string;
  maxSize?: number;
  allowedFormats?: string;
}

export default function SubmitOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingRequirements, setLoadingRequirements] = useState(true);
  const [tenderTitle, setTenderTitle] = useState('');
  
  // Form state
  const [offerValue, setOfferValue] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // File uploads state - will be populated dynamically from backend
  const [files, setFiles] = useState<FileUpload[]>([]);

  useEffect(() => {
    // Check if supplier is logged in
    const supplierSession = localStorage.getItem('supplierSession') || localStorage.getItem('currentSupplier');
    if (!supplierSession) {
      navigate('/supplier/signin');
      return;
    }

    // Fetch tender details and dynamic file requirements
    fetchTenderRequirements();
  }, [navigate, id]);

  const fetchTenderRequirements = async () => {
    if (!id) return;
    
    setLoadingRequirements(true);
    try {
      const response = await fetch(`/api/tenders/${id}`);
      if (response.ok) {
        const tenderData = await response.json();
        
        // Set tender title
        setTenderTitle(tenderData.title || 'مناقصة');
        
        // Transform backend required files to frontend format
        const dynamicFiles: FileUpload[] = [];
        
        if (tenderData.requiredFiles && tenderData.requiredFiles.length > 0) {
          // Use dynamic file requirements from backend
          dynamicFiles.push(...tenderData.requiredFiles.map((reqFile: RequiredFile) => ({
            id: reqFile.file_type,
            name: `${reqFile.file_name}${reqFile.is_required ? ' (إجباري)' : ' (اختياري)'}`,
            file: null,
            required: reqFile.is_required,
            description: reqFile.description,
            maxSize: reqFile.max_size_mb,
            allowedFormats: reqFile.allowed_formats
          })));
        } else {
          // Fallback to default file requirements if none specified by buyer
          dynamicFiles.push(
            { id: 'technical', name: 'ملف العرض الفني (إجباري)', file: null, required: true, description: 'الوثائق التقنية والمواصفات' },
            { id: 'financial', name: 'ملف العرض المالي (إجباري)', file: null, required: true, description: 'العرض المالي وتفاصيل التكلفة' },
            { id: 'legal', name: 'الوثائق القانونية (اختياري)', file: null, required: false, description: 'التراخيص والشهادات القانونية' },
            { id: 'experience', name: 'ملف الخبرة (اختياري)', file: null, required: false, description: 'أمثلة على الأعمال السابقة والمراجع' }
          );
        }
        
        setFiles(dynamicFiles);
      } else {
        console.error('Failed to fetch tender requirements');
        // Use fallback requirements
        setFiles([
          { id: 'technical', name: 'ملف العرض الفني (إجباري)', file: null, required: true, description: 'الوثائق التقنية والمواصفات' },
          { id: 'financial', name: 'ملف العرض المالي (إجباري)', file: null, required: true, description: 'العرض المالي وتفاصيل التكلفة' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching tender requirements:', error);
      // Use fallback requirements
      setFiles([
        { id: 'technical', name: 'ملف العرض الفني (إجباري)', file: null, required: true, description: 'الوثائق التقنية والمواصفات' },
        { id: 'financial', name: 'ملف العرض المالي (إجباري)', file: null, required: true, description: 'العرض المالي وتفاصيل التكلفة' }
      ]);
    } finally {
      setLoadingRequirements(false);
    }
  };

  const handleFileChange = (fileId: string, file: File | null) => {
    if (file) {
      const fileRequirement = files.find(f => f.id === fileId);
      
      // Check file size if specified
      if (fileRequirement?.maxSize && file.size > fileRequirement.maxSize * 1024 * 1024) {
        alert(`حجم الملف كبير جداً. الحد الأقصى هو ${fileRequirement.maxSize} ميجابايت`);
        return;
      }
      
      // Check file format if specified
      if (fileRequirement?.allowedFormats) {
        const allowedExtensions = fileRequirement.allowedFormats.split(',').map(ext => ext.trim().toLowerCase());
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
          alert(`نوع الملف غير مدعوم. الأنواع المسموحة: ${fileRequirement.allowedFormats}`);
          return;
        }
      }
    }
    
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

    // Get supplier data from localStorage
    const supplierData = localStorage.getItem('supplier');
    if (!supplierData) {
      alert('يرجى تسجيل الدخول أولاً');
      navigate('/supplier/signin');
      return;
    }

    const supplier = JSON.parse(supplierData);

    setLoading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('tender_id', id!);
      formData.append('supplier_id', supplier.ID.toString());
      formData.append('offer_value', offerValue);
      formData.append('additional_notes', additionalNotes);
      
      // Add files to FormData
      files.forEach((fileEntry) => {
        if (fileEntry.file) {
          // Use the file ID or name as the fieldname (backend will determine type)
          const fieldName = fileEntry.id.toLowerCase().includes('technical') ? 'technical_file' :
                           fileEntry.id.toLowerCase().includes('financial') ? 'financial_file' :
                           fileEntry.id.toLowerCase().includes('company') ? 'company_file' :
                           'additional_file';
          formData.append(fieldName, fileEntry.file);
        }
      });

      console.log('Submitting offer to API...');
      
      // Submit to backend API
      const response = await fetch(`/api/tenders/${id}/offers`, {
        method: 'POST',
        body: formData // Don't set Content-Type header, let browser set it with boundary
      });

      const result = await response.json();

      if (result.success) {
        alert('تم تقديم العرض بنجاح!');
        navigate('/supplier/offers');
      } else {
        throw new Error(result.message || 'فشل في تقديم العرض');
      }
      
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
                
                {loadingRequirements ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {files.map((fileItem) => (
                    <div key={fileItem.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {fileItem.name}
                            {fileItem.required && <span className="text-red-500 mr-1">*</span>}
                          </h4>
                          {fileItem.description && (
                            <p className="text-sm text-gray-600 mt-1">{fileItem.description}</p>
                          )}
                          {fileItem.maxSize && (
                            <p className="text-xs text-gray-500 mt-1">الحد الأقصى: {fileItem.maxSize} ميجابايت</p>
                          )}
                        </div>
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
                            accept={fileItem.allowedFormats || ".pdf,.doc,.docx,.jpg,.jpeg,.png"}
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
                            <span className="text-xs text-gray-500">
                              {fileItem.allowedFormats || "PDF, DOC, DOCX, JPG, PNG"}
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                  </div>
                )}
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