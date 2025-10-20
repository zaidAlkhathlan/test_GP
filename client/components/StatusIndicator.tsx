import React from 'react';

interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'pending';
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusIndicator({ status, size = 'sm' }: StatusIndicatorProps) {
  const colors = {
    active: 'bg-green-500',
    inactive: 'bg-gray-400',
    pending: 'bg-yellow-500'
  };

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className={`${colors[status]} ${sizes[size]} rounded-full`}></div>
  );
}