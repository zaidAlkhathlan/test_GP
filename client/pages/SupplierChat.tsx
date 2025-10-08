import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';

export default function SupplierChat() {
  const { id: tenderId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if supplier is logged in
    const supplierSession = localStorage.getItem('supplierSession') || localStorage.getItem('currentSupplier');
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

  const handleSubmitQuestion = async () => {
    if (!question.trim() || !supplier) return;

    setLoading(true);
    try {
      // Here you would send the question to your backend API
      console.log('Submitting question:', {
        tenderId,
        supplierId: supplier.id,
        question: question.trim()
      });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert('تم إرسال استفسارك بنجاح! ستصلك الإجابة قريباً وستظهر في صفحة الاستفسارات العامة');
      setQuestion('');
      
      // Redirect back to public inquiries page
      navigate(`/tender/${tenderId}/quires`);
      
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('حدث خطأ أثناء إرسال الاستفسار. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
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
      
      <div className="max-w-[800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900">استفسار خاص</h1>
              <p className="text-gray-600 mt-1">مناقصة رقم: {tenderId}</p>
              <p className="text-sm text-gray-500 mt-1">استفسارك سيظهر في الاستفسارات العامة بعد إرساله</p>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to={`/tender/${tenderId}/quires`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                الاستفسارات العامة
              </Link>
              <Link 
                to={`/tender/${tenderId}`}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                العودة للمناقصة
              </Link>
            </div>
          </div>
        </div>

        {/* Question Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-tawreed-green rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">اطرح استفسارك</h3>
                <p className="text-sm text-gray-600">سيتم نشر الاستفسار والإجابة في الاستفسارات العامة ليستفيد منها جميع الموردين</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Supplier Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">معلومات المرسل</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">اسم الشركة:</span>
                  <span className="mr-2 font-medium">{supplier.company_name}</span>
                </div>
                <div>
                  <span className="text-gray-600">البريد الإلكتروني:</span>
                  <span className="mr-2 font-medium">{supplier.account_email}</span>
                </div>
              </div>
            </div>

            {/* Question Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نص الاستفسار <span className="text-red-500">*</span>
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="اكتب استفسارك بالتفصيل هنا..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tawreed-green focus:border-transparent resize-none"
                rows={6}
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {question.length}/1000 حرف
                </span>
                <span className="text-xs text-gray-500">
                  كن واضحاً ومحدداً في سؤالك للحصول على إجابة دقيقة
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/tender/${tenderId}/quires`)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSubmitQuestion}
                disabled={!question.trim() || loading}
                className="flex-1 px-6 py-3 bg-tawreed-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال الاستفسار'}
              </button>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* How it works */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-blue-900">كيف يعمل؟</span>
            </div>
            <ul className="text-sm text-blue-800 space-y-1 mr-8">
              <li>• سيتم إرسال استفسارك للمشتري</li>
              <li>• ستظهر الإجابة في الاستفسارات العامة</li>
              <li>• يمكن لجميع الموردين رؤية الاستفسار والإجابة</li>
              <li>• ستحصل على إجابة خلال 24-48 ساعة</li>
            </ul>
          </div>

          {/* Tips */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="font-medium text-green-900">نصائح مفيدة</span>
            </div>
            <ul className="text-sm text-green-800 space-y-1 mr-8">
              <li>• اطرح أسئلة محددة وواضحة</li>
              <li>• راجع الاستفسارات العامة أولاً</li>
              <li>• تأكد من المواعيد النهائية للاستفسارات</li>
              <li>• استفسر قبل تقديم عرضك</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}