import React from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface PerformanceChartProps {
  title: string;
  subtitle?: string;
  data: ChartData[];
  height?: number;
  color?: string;
  className?: string;
}

export default function PerformanceChart({ 
  title, 
  subtitle, 
  data, 
  height = 200, 
  color = '#22c55e',
  className = '' 
}: PerformanceChartProps) {
  // Simple SVG chart implementation
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  // Generate SVG path for line chart
  const generatePath = () => {
    if (data.length < 2) return '';
    
    const width = 400;
    const chartHeight = height - 40;
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = chartHeight - ((point.value - minValue) / range) * chartHeight;
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  };

  return (
    <div className={`bg-white rounded-lg p-4 shadow-sm border ${className}`}>
      <div className="text-right mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-600 mt-1">{subtitle}</p>}
      </div>
      
      <div className="relative" style={{ height: `${height}px` }}>
        <svg 
          width="100%" 
          height={height}
          viewBox={`0 0 400 ${height}`}
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Chart area background */}
          <rect 
            x="0" 
            y="20" 
            width="400" 
            height={height - 40}
            fill="#f8fafc"
            rx="4"
          />
          
          {/* Line chart */}
          {data.length > 1 && (
            <>
              {/* Area under curve */}
              <path
                d={`${generatePath()} L 400,${height - 20} L 0,${height - 20} Z`}
                fill={color}
                fillOpacity="0.1"
              />
              
              {/* Line */}
              <path
                d={generatePath()}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              
              {/* Data points */}
              {data.map((point, index) => {
                const x = (index / (data.length - 1)) * 400;
                const y = (height - 40) - ((point.value - minValue) / range) * (height - 40) + 20;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={color}
                    className="hover:r-4 transition-all"
                  >
                    <title>{`${point.label}: ${point.value}`}</title>
                  </circle>
                );
              })}
            </>
          )}
          
          {/* Y-axis labels */}
          <text x="10" y="30" className="text-xs fill-gray-500" textAnchor="start">
            {maxValue.toLocaleString()}
          </text>
          <text x="10" y={height - 25} className="text-xs fill-gray-500" textAnchor="start">
            {minValue.toLocaleString()}
          </text>
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-2">
          {data.length > 0 && (
            <>
              <span className="text-xs text-gray-500">{data[0]?.label}</span>
              {data.length > 1 && (
                <span className="text-xs text-gray-500">{data[data.length - 1]?.label}</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}