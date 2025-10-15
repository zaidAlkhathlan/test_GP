import React, { useState, useEffect } from 'react';
import RegionSelector from './RegionSelector';
import CitySelector from './CitySelector';

interface LocationSelectorProps {
  regionId?: number;
  cityId?: number;
  onRegionChange: (regionId: number) => void;
  onCityChange: (cityId: number) => void;
  showRegion?: boolean;
  showCity?: boolean;
  regionPlaceholder?: string;
  cityPlaceholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export default function LocationSelector({ 
  regionId, 
  cityId, 
  onRegionChange, 
  onCityChange,
  showRegion = true,
  showCity = true,
  regionPlaceholder = "اختر المنطقة",
  cityPlaceholder = "اختر المدينة",
  className = "",
  disabled = false,
  required = false
}: LocationSelectorProps) {

  const handleRegionChange = (newRegionId: number) => {
    onRegionChange(newRegionId);
    // Reset city when region changes
    if (cityId) {
      onCityChange(0);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {showRegion && (
        <div>
          <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
            المنطقة {required && <span className="text-red-500">*</span>}
          </label>
          <RegionSelector
            value={regionId}
            onChange={handleRegionChange}
            placeholder={regionPlaceholder}
            disabled={disabled}
          />
        </div>
      )}

      {showCity && (
        <div>
          <label className="block text-sm font-medium text-tawreed-text-dark mb-2 text-right font-arabic">
            المدينة {required && <span className="text-red-500">*</span>}
          </label>
          <CitySelector
            regionId={regionId}
            value={cityId}
            onChange={onCityChange}
            placeholder={cityPlaceholder}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}