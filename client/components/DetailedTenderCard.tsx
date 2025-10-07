import React from 'react';

interface DetailedTenderCardProps {
  title: string;
  organization: string;
  categories: string[];
  submissionDate: string;
  consultationDate: string;
  budget: string;
  location: string;
  referenceNumber: string;
  publishDate: string;
  className?: string;
}

export default function DetailedTenderCard({
  title,
  organization,
  categories,
  submissionDate,
  consultationDate,
  budget,
  location,
  referenceNumber,
  publishDate,
  className = ''
}: DetailedTenderCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="text-right">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600">تحديث مباشر</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">الفرص المتطابقة مع تخصصك</h2>
        </div>
        
        <p className="text-gray-600 text-sm mb-6">بناء على ملفك التعريفي وتخصصاتك، وجدنا</p>
        
        <div className="text-3xl font-bold text-tawreed-green mb-6">1 فرصة مناسبة لك</div>

        {/* Tender Card */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
                التفاصيل
              </button>
              <button className="px-3 py-1 bg-tawreed-green text-white rounded-full text-xs">
                تقديم عرض
              </button>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-tawreed-green">{organization}</p>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-end mb-4">
            {categories.map((category, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {category}
              </span>
            ))}
          </div>

          {/* Timeline */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-600">{submissionDate}</span>
              </div>
              <span className="text-xs text-gray-500">موعد تقديم العروض</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span className="text-xs text-gray-600">{consultationDate}</span>
              </div>
              <span className="text-xs text-gray-500">موعد اجراء الاستشارات</span>
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-gray-900">{budget}</span>
            <span className="text-sm text-gray-600">قيمة وثائق المناقصة</span>
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
            <span>استكشاف المزيد من العروض</span>
            <div className="flex gap-4">
              <span>تاريخ النشر: {publishDate}</span>
              <span>الرقم المرجعي: {referenceNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}