import React from 'react';
import { Link } from 'react-router-dom';

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  iconBgColor?: string;
  iconTextColor?: string;
}

export default function QuickActionCard({ 
  title, 
  description, 
  icon, 
  href, 
  onClick,
  className = '',
  iconBgColor = 'bg-blue-100',
  iconTextColor = 'text-blue-600'
}: QuickActionProps) {
  const content = (
    <div className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center`}>
            <div className={`w-6 h-6 ${iconTextColor}`}>
              {icon}
            </div>
          </div>
        </div>
        <div className="mr-4 text-right flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return content;
}