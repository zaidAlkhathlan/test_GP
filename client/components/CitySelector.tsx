import React, { useState, useEffect } from 'react';

interface City {
  id: number;
  name: string;
  region_id: number;
}

interface CitySelectorProps {
  regionId?: number;
  value?: number;
  onChange: (cityId: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CitySelector({ 
  regionId, 
  value, 
  onChange, 
  placeholder = "اختر المدينة", 
  className = "",
  disabled = false 
}: CitySelectorProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!regionId) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/regions/${regionId}/cities`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const citiesArray = Array.isArray(data) ? data : data?.cities;
        if (!Array.isArray(citiesArray)) {
          throw new Error('Invalid cities response shape');
        }
        setCities(citiesArray);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setError('فشل في تحميل المدن');
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [regionId]);

  // Reset selected city when region changes
  useEffect(() => {
    if (value && regionId) {
      // Check if current value is still valid for the new region
      const cityExists = cities.some(city => city.id === value);
      if (!cityExists && cities.length > 0) {
        onChange(0); // Reset selection
      }
    }
  }, [regionId, cities, value, onChange]);

  if (!regionId) {
    return (
      <select 
        className={`w-full px-3 py-2.5 text-right border border-tawreed-border-gray rounded-lg font-arabic text-sm opacity-50 ${className}`}
        disabled
        dir="rtl"
      >
        <option>اختر المنطقة أولاً</option>
      </select>
    );
  }

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
      disabled={disabled || cities.length === 0}
      dir="rtl"
    >
      <option value="">{placeholder}</option>
      {cities.map((city) => (
        <option key={city.id} value={city.id}>
          {city.name}
        </option>
      ))}
    </select>
  );
}