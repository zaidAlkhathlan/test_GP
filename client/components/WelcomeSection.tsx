import React from 'react';

interface WelcomeSectionProps {
  title: string;
  subtitle: string;
  userInfo?: {
    name?: string;
    company?: string;
    city?: string;
    domain?: string;
    email?: string;
    phone?: string;
    registrationNumber?: string;
  };
  className?: string;
}

export default function WelcomeSection({ 
  title, 
  subtitle, 
  userInfo,
  className = '' 
}: WelcomeSectionProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 mb-8 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      <p className="text-gray-600 mb-6">{subtitle}</p>
      
      {userInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          {userInfo.company && (
            <div className="flex justify-between items-center">
              <span className="font-medium">اسم الشركة:</span>
              <span>{userInfo.company}</span>
            </div>
          )}
          {userInfo.city && (
            <div className="flex justify-between items-center">
              <span className="font-medium">المدينة:</span>
              <span>{userInfo.city}</span>
            </div>
          )}
          {userInfo.domain && (
            <div className="flex justify-between items-center">
              <span className="font-medium">المجال:</span>
              <span>{userInfo.domain}</span>
            </div>
          )}
          {userInfo.registrationNumber && (
            <div className="flex justify-between items-center">
              <span className="font-medium">رقم التسجيل التجاري:</span>
              <span>{userInfo.registrationNumber}</span>
            </div>
          )}
          {userInfo.email && (
            <div className="flex justify-between items-center">
              <span className="font-medium">البريد الإلكتروني:</span>
              <span>{userInfo.email}</span>
            </div>
          )}
          {userInfo.phone && (
            <div className="flex justify-between items-center">
              <span className="font-medium">رقم الهاتف:</span>
              <span>{userInfo.phone}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}