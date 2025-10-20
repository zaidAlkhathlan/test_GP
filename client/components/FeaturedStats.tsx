import React from 'react';

interface FeaturedStatsProps {
  title: string;
  subtitle: string;
  stats: Array<{
    value: number;
    label: string;
  }>;
  className?: string;
}

export default function FeaturedStats({ title, subtitle, stats, className = '' }: FeaturedStatsProps) {
  return (
    <div className={`bg-green-50 rounded-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold text-tawreed-green mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}