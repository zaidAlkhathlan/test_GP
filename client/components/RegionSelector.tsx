import React, { useState, useEffect } from 'react';

interface Region {
  id: number;
  name: string;
}

interface RegionSelectorProps {
  value?: number;
  onChange: (regionId: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function RegionSelector({ 
  value, 
  onChange, 
  placeholder = "اختر المنطقة", 
  className = "",
  disabled = false 
}: RegionSelectorProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/regions');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setRegions(data);
      } catch (error) {
        console.error('Error fetching regions:', error);
        setError('فشل في تحميل المناطق');
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  if (loading) {
    return (
      <select 
        className={`w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg font-arabic text-sm ${className}`}
        disabled
        dir="rtl"
      >
        <option>جاري التحميل...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select 
        className={`w-full px-3 py-2.5 text-right border border-red-300 rounded-lg font-arabic text-sm ${className}`}
        disabled
        dir="rtl"
      >
        <option>{error}</option>
      </select>
    );
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-tawreed-green focus:border-transparent font-arabic text-sm ${className}`}
      disabled={disabled}
      dir="rtl"
    >
      <option value="">{placeholder}</option>
      {regions.map((region) => (
        <option key={region.id} value={region.id}>
          {region.name}
        </option>
      ))}
    </select>
  );
}