import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  percentage?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  subtitle, 
  percentage, 
  trend = 'neutral', 
  icon,
  className = '' 
}: StatsCardProps) {
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-right flex-1">
          <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
          <div className="text-2xl font-bold text-tawreed-green">{value}</div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {percentage && (
            <div className={`text-xs mt-2 ${trendColors[trend]}`}>
              {trendIcons[trend]} {percentage}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 mr-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}