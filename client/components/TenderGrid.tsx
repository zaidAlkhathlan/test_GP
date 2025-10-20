import React from 'react';

interface TenderItem {
  title: string;
  description: string;
  category?: string;
  status?: 'active' | 'ending' | 'new';
}

interface TenderGridProps {
  tenders: TenderItem[];
  className?: string;
}

export default function TenderGrid({ tenders, className = '' }: TenderGridProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'ending': return 'bg-red-100 text-red-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {tenders.map((tender, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
          <div className="text-right">
            {tender.status && (
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(tender.status)}`}>
                {tender.status === 'active' ? 'نشطة' : tender.status === 'ending' ? 'تنتهي قريباً' : 'جديدة'}
              </span>
            )}
            <h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
              {tender.title}
            </h4>
            <p className="text-gray-600 text-xs leading-relaxed mb-3">
              {tender.description}
            </p>
            {tender.category && (
              <div className="text-xs text-tawreed-green font-medium">
                {tender.category}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}