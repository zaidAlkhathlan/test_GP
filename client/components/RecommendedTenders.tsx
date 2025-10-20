import React from 'react';

interface RecommendedTender {
  title: string;
  organization: string;
  category: string;
  location: string;
}

interface RecommendedTendersProps {
  tenders: RecommendedTender[];
  className?: string;
}

export default function RecommendedTenders({ tenders, className = '' }: RecommendedTendersProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-6 text-right">المناقصات الموصى بها</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tenders.map((tender, index) => (
          <div key={index} className="border rounded-lg p-4 text-right hover:shadow-md transition-shadow cursor-pointer">
            <div className="mb-3">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{tender.title}</h4>
              <p className="text-xs text-tawreed-green">{tender.organization}</p>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-600">
                <span className="font-medium">التخصص:</span> {tender.category}
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">المنطقة:</span> {tender.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}