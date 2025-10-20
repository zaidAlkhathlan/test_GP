import React, { useState } from 'react';
import { Search, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import LocationSelector from './LocationSelector';
import { Domain, SubDomain, DomainsResponse, SubDomainsResponse } from '@shared/api';
import { useEffect } from 'react';

interface TenderFilterProps {
  onFilterChange?: (filters: FilterState) => void;
  showStatusFilter?: boolean;
}

interface FilterState {
  searchText: string;
  // Selected status ids from the status table (e.g., 1=OPEN,2=AWARDING,3=FINISHED)
  status: number[];
  budgetRange: [number, number];
  dateRange: {
    from: string;
    to: string;
  };
  region: number | null;
  city: number | null;
  primaryDomain: string;
  subDomain: string;
}

const saudiRegions = {
  riyadh: {
    name: 'منطقة الرياض',
    cities: ['الرياض', 'الخرج', 'الدوادمي', 'الأفلاج', 'وادي الدواسر', 'الزلفي', 'شقراء', 'حوطة بني تميم', 'عفيف', 'السليل']
  },
  makkah: {
    name: 'منطقة مكة المكرمة',
    cities: ['مكة المكرمة', 'جدة', 'الطائف', 'المدينة المنورة', 'ينبع', 'رابغ', 'الكامل', 'خليص', 'الجموم', 'بحرة']
  },
  eastern: {
    name: 'المنطقة الشرقية',
    cities: ['الدمام', 'الخبر', 'الظهران', 'الأحساء', 'الجبيل', 'القطيف', 'حفر الباطن', 'رأس تنورة', 'بقيق', 'الخفجي']
  },
  asir: {
    name: 'منطقة عسير',
    cities: ['أبها', 'خميس مشيط', 'بيشة', 'النماص', 'سراة عبيدة', 'رجال ألمع', 'محايل عسير', 'ظهران الجنوب', 'تثليث', 'طريب']
  },
  qassim: {
    name: 'منطقة القصيم',
    cities: ['بريدة', 'عنيزة', 'الرس', 'المذنب', 'البكيرية', 'عيون الجواء', 'البدائع', 'الشماسية', 'عقلة الصقور', 'دخنة']
  },
  hail: {
    name: 'منطقة حائل',
    cities: ['حائل', 'بقعاء', 'الغزالة', 'الشنان', 'السليمي', 'سميراء', 'الحائط', 'موقق', 'الشملي', 'أم القلبان']
  },
  northern: {
    name: 'منطقة الحدود الشمالية',
    cities: ['عرعر', 'رفحاء', 'طريف', 'العويقيلة', 'الحديثة', 'رأس الخافجي', 'أم قصر', 'بدنة', 'جلجل', 'نويدرة']
  },
  jazan: {
    name: 'منطقة جازان',
    cities: ['جازان', 'صبيا', 'أبو عريش', 'صامطة', 'بيش', 'فرسان', 'العارضة', 'الدرب', 'الحرث', 'الداير']
  },
  najran: {
    name: 'منطقة نجران',
    cities: ['نجران', 'شرورة', 'حبونا', 'ثار', 'بدر الجنوب', 'يدمة', 'الخرخير', 'الوديعة', 'الأخدود', 'الحصينية']
  },
  bahah: {
    name: 'منطقة الباحة',
    cities: ['الباحة', 'بلجرشي', 'المندق', 'العقيق', 'قلوة', 'المخواة', 'غامد الزناد', 'بني حسن', 'الحجرة', 'القرى']
  },
  tabuk: {
    name: 'منطقة تبوك',
    cities: ['تبوك', 'الوجه', 'ضباء', 'تيماء', 'أملج', 'حقل', 'البدع', 'أبو راكة', 'الخريبة', 'مقنا']
  },
  jawf: {
    name: 'منطقة الجوف',
    cities: ['سكاكا', 'القريات', 'دومة الجندل', 'طبرجل', 'الحديثة', 'صوير', 'منوة', 'الطوير', 'العيساوية', 'زلوم']
  }
};

export default function TenderFilter({ onFilterChange, showStatusFilter = true }: TenderFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    status: [],
    budgetRange: [0, 10000000],
    dateRange: {
      from: '',
      to: '',
    },
    region: null,
    city: null,
    primaryDomain: '',
    subDomain: '',
  });

  const [domains, setDomains] = React.useState<Domain[]>([]);
  const [subDomains, setSubDomains] = React.useState<SubDomain[]>([]);
  const [filteredSubDomains, setFilteredSubDomains] = React.useState<SubDomain[]>([]);

  // Fetch domains and sub-domains (reuse CreateTender patterns)
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await fetch('/api/domains');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: DomainsResponse = await res.json();
        setDomains(data.domains);
      } catch (e) {
        console.error('Error fetching domains', e);
      }
    };

    const fetchSubDomains = async () => {
      try {
        const res = await fetch('/api/sub-domains');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: SubDomainsResponse = await res.json();
        setSubDomains(data.subDomains);
      } catch (e) {
        console.error('Error fetching sub-domains', e);
      }
    };

    fetchDomains();
    fetchSubDomains();
  }, []);

  // Fetch statuses (status reference table)
  const [statuses, setStatuses] = React.useState<{ id: number; name: string }[]>([]);
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await fetch('/api/status');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // Expecting an array like [{ id: 1, name: 'OPEN' }, ...]
        setStatuses(data);
      } catch (e) {
        console.warn('Failed to fetch statuses, falling back to defaults', e);
        setStatuses([
          { id: 1, name: 'OPEN' },
          { id: 2, name: 'AWARDING' },
          { id: 3, name: 'FINISHED' }
        ]);
      }
    };
    fetchStatuses();
  }, []);

  // Filter sub-domains when primary domain changes
  useEffect(() => {
    if (filters.primaryDomain) {
      const fd = subDomains.filter(sd => String(sd.domain_id) === String(filters.primaryDomain));
      setFilteredSubDomains(fd);
    } else {
      setFilteredSubDomains([]);
    }
  }, [filters.primaryDomain, subDomains]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    console.log('Filter changed:', key, '=', value); // Debug log
    console.log('New filters:', newFilters); // Debug log
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleStatusToggle = (statusId: number, checked: boolean) => {
    const newStatus = checked ? [...filters.status, statusId] : filters.status.filter(s => s !== statusId);
    handleFilterChange('status', newStatus);
  };

  const handleBudgetChange = (value: number[]) => {
    handleFilterChange('budgetRange', [value[0], value[1]]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-100" dir="rtl">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 text-right mb-6">مناقصاتي</h3>
        
        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 text-right mb-2">
            البحث النصي
          </label>
          <div className="relative">
            <Input
              placeholder="ابحث في العناوين والأوصاف..."
              value={filters.searchText}
              onChange={(e) => handleFilterChange('searchText', e.target.value)}
              className="pl-10 text-right"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Status */}
        {showStatusFilter && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 text-right mb-3">
              حالة المناقصة
            </label>
            <div className="space-y-3" dir="rtl">
              {statuses.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.status.includes(s.id)}
                    onCheckedChange={(checked) => handleStatusToggle(s.id, !!checked)}
                  />
                  <label className="text-sm text-gray-600 cursor-pointer" onClick={() => handleStatusToggle(s.id, !filters.status.includes(s.id))}>
                    {s.name === 'OPEN' ? 'نشطة' : s.name === 'AWARDING' ? 'قيد التقييم' : s.name === 'FINISHED' ? 'مكتملة' : s.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expected Budget Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 text-right mb-3">
            الميزانية المتوقعة
          </label>
          <div className="px-2">
            <Slider
              value={filters.budgetRange}
              onValueChange={handleBudgetChange}
              max={10000000}
              min={0}
              step={50000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>{formatCurrency(filters.budgetRange[1])}</span>
              <span>{formatCurrency(filters.budgetRange[0])}</span>
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 text-right mb-3">
            فترة الانتهاء
          </label>
          <div className="space-y-3">
            <div className="relative">
              <Input
                type="date"
                value={filters.dateRange.from}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, from: e.target.value })}
                className="text-right"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <div className="relative">
              <Input
                type="date"
                value={filters.dateRange.to}
                onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, to: e.target.value })}
                className="text-right"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Region + City (DB-backed) */}
        <div className="mb-6">
          <LocationSelector
            regionId={filters.region || undefined}
            cityId={filters.city || undefined}
            onRegionChange={(regionId) => {
              console.log('LocationSelector onRegionChange ->', regionId);
              setFilters((prev) => {
                const updated = { ...prev, region: regionId || null, city: null };
                onFilterChange?.(updated);
                console.log('TenderFilter updated filters after region:', updated);
                return updated;
              });
            }}
            onCityChange={(cityId) => {
              console.log('LocationSelector onCityChange ->', cityId);
              setFilters((prev) => {
                const updated = { ...prev, city: cityId || null };
                onFilterChange?.(updated);
                console.log('TenderFilter updated filters after city:', updated);
                return updated;
              });
            }}
            showRegion={true}
            showCity={true}
          />
        </div>

        {/* Primary Domain */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 text-right mb-2">
            النشاط الرئيسي
          </label>
          <div className="relative">
            <select
              value={filters.primaryDomain}
              onChange={(e) => handleFilterChange('primaryDomain', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-right bg-white appearance-none"
            >
              <option value="">اختر النشاط الرئيسي</option>
              {domains.map(d => (
                <option key={d.ID} value={String(d.ID)}>{d.Name}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Sub Domain */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 text-right mb-2">
            النشاط الفرعي
          </label>
          <div className="relative">
            <select
              value={filters.subDomain}
              onChange={(e) => handleFilterChange('subDomain', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-right bg-white appearance-none"
              disabled={!filters.primaryDomain}
            >
              <option value="">اختر النشاط الفرعي</option>
              {filteredSubDomains.map(sd => (
                <option key={sd.ID} value={String(sd.ID)}>{sd.Name}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Reset Button */}
        <Button 
          variant="outline" 
          className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
            onClick={() => {
            const resetFilters = {
              searchText: '',
              status: [],
              budgetRange: [0, 10000000] as [number, number],
              dateRange: { from: '', to: '' },
              region: null,
              city: null,
              primaryDomain: '',
              subDomain: '',
            };
            setFilters(resetFilters);
            onFilterChange?.(resetFilters);
          }}
        >
          إعادة تعيين الفلاتر
        </Button>
      </div>
    </div>
  );
}