import React, { useState } from 'react';
import { Search, MapPin, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface TenderFilterProps {
  onFilterChange?: (filters: FilterState) => void;
  showStatusFilter?: boolean;
}

interface FilterState {
  searchText: string;
  status: {
    active: boolean;
    nearDeadline: boolean;
  };
  budgetRange: [number, number];
  dateRange: {
    from: string;
    to: string;
  };
  region: string;
  city: string;
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
    status: {
      active: false,
      nearDeadline: false,
    },
    budgetRange: [0, 10000000],
    dateRange: {
      from: '',
      to: '',
    },
    region: '',
    city: '',
    primaryDomain: '',
    subDomain: '',
  });

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleStatusChange = (statusKey: string, checked: boolean) => {
    const newStatus = { ...filters.status, [statusKey]: checked };
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
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={filters.status.active}
                  onCheckedChange={(checked) => handleStatusChange('active', !!checked)}
                />
                <label className="text-sm text-gray-600 cursor-pointer" onClick={() => handleStatusChange('active', !filters.status.active)}>نشطة</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={filters.status.nearDeadline}
                  onCheckedChange={(checked) => handleStatusChange('nearDeadline', !!checked)}
                />
                <label className="text-sm text-gray-600 cursor-pointer" onClick={() => handleStatusChange('nearDeadline', !filters.status.nearDeadline)}>قريب الانتهاء</label>
              </div>
            </div>
          </div>
        )}

        {/* Budget Range */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 text-right mb-3">
            نطاق القيمة (ريال)
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

        {/* Region */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 text-right mb-2">
            المنطقة
          </label>
          <div className="relative">
            <select
              value={filters.region}
              onChange={(e) => {
                const newRegion = e.target.value;
                console.log('Region selected:', newRegion); // Debug log
                handleFilterChange('region', newRegion);
                handleFilterChange('city', ''); // Reset city when region changes
              }}
              className="w-full p-2 border border-gray-300 rounded-lg text-right bg-white appearance-none pr-10"
            >
              <option value="">اختر المنطقة</option>
              {Object.entries(saudiRegions).map(([key, region]) => (
                <option key={key} value={key}>{region.name}</option>
              ))}
            </select>
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* City */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 text-right mb-2">
            المدينة
          </label>
          <div className="relative">
            <select
              value={filters.city}
              onChange={(e) => {
                console.log('City selected:', e.target.value); // Debug log
                handleFilterChange('city', e.target.value);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg text-right bg-white appearance-none pr-10"
              disabled={!filters.region}
            >
              <option value="">اختر المدينة</option>
              {filters.region && saudiRegions[filters.region as keyof typeof saudiRegions]?.cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
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
              <option value="tech">التكنولوجيا</option>
              <option value="construction">البناء والتشييد</option>
              <option value="education">التعليم والتدريب</option>
              <option value="health">الصحة</option>
              <option value="transport">النقل والمواصلات</option>
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
              <option value="">اختر النشاط الرئيسي</option>
              {filters.primaryDomain === 'tech' && (
                <>
                  <option value="software">تطوير البرمجيات</option>
                  <option value="mobile">تطوير التطبيقات</option>
                  <option value="security">الأمن السيبراني</option>
                </>
              )}
              {filters.primaryDomain === 'construction' && (
                <>
                  <option value="buildings">المباني</option>
                  <option value="roads">الطرق</option>
                  <option value="infrastructure">البنية التحتية</option>
                </>
              )}
              {filters.primaryDomain === 'education' && (
                <>
                  <option value="training">التدريب المهني</option>
                  <option value="academic">التعليم الأكاديمي</option>
                  <option value="elearning">التعليم الإلكتروني</option>
                </>
              )}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Reset Button */}
        <Button 
          variant="outline" 
          className="w-full text-gray-600 border-gray-300 hover:bg-gray-50"
          onClick={() => setFilters({
            searchText: '',
            status: { active: false, nearDeadline: false },
            budgetRange: [0, 10000000],
            dateRange: { from: '', to: '' },
            region: '',
            city: '',
            primaryDomain: '',
            subDomain: '',
          })}
        >
          إعادة تعيين الفلاتر
        </Button>
      </div>
    </div>
  );
}