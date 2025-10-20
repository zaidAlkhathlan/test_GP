import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TenderCard from '../components/TenderCard';
import TenderFilter from '../components/TenderFilter';
import { fetchTenders } from '../utils/tenderUtils';
import { Tender } from '@shared/api';

export default function AvailableTenders() {
  const navigate = useNavigate();
  const [currentSupplier, setCurrentSupplier] = useState<any>(null);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  // Check supplier authentication
  useEffect(() => {
    const supplierSession = localStorage.getItem('currentSupplier');
    if (supplierSession) {
      try {
        const supplierData = JSON.parse(supplierSession);
        setCurrentSupplier(supplierData);
      } catch (error) {
        console.error('Error parsing supplier session:', error);
        navigate('/supplier/signin');
      }
    } else {
      navigate('/supplier/signin');
    }
  }, [navigate]);

  // Fetch tenders data
  useEffect(() => {
    const loadTenders = async () => {
      try {
        setLoading(true);
        const tendersData = await fetchTenders();
        // Only show active tenders for suppliers
        const activeTenders = tendersData.filter(tender => tender.status === 'active');
        setTenders(activeTenders);
        setFilteredTenders(activeTenders);
      } catch (error) {
        console.error('Error fetching tenders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentSupplier) {
      loadTenders();
    }
  }, [currentSupplier]);

  const handleApplyForTender = (tenderId: string) => {
    // Navigate to tender application/details page
    navigate(`/tender/${tenderId}/apply`);
  };

  const handleFilterChange = (filters: any) => {
    console.log('Filter change received:', filters); // Debug log
    let filtered = [...tenders];

    // Search text filter
    if (filters.searchText && filters.searchText.trim()) {
      const searchText = filters.searchText.toLowerCase().trim();
      filtered = filtered.filter(tender => 
        tender.title.toLowerCase().includes(searchText) ||
        tender.description?.toLowerCase().includes(searchText) ||
        tender.company.toLowerCase().includes(searchText)
      );
    }

    // Status filter - for suppliers, we might want to show different statuses
    if (filters.status && (filters.status.active || filters.status.nearDeadline)) {
      filtered = filtered.filter(tender => {
        if (filters.status.active && tender.status === 'active') return true;
        if (filters.status.nearDeadline && tender.remainingDays <= 7) return true;
        return false;
      });
    }

    // Budget filter
    if (filters.budgetRange && (filters.budgetRange[0] > 0 || filters.budgetRange[1] < 10000000)) {
      filtered = filtered.filter(tender => {
        const budgetStr = tender.budget?.toString() || '0';
        const budget = parseFloat(budgetStr.replace(/[^\d]/g, '')) || 0;
        return budget >= filters.budgetRange[0] && budget <= filters.budgetRange[1];
      });
    }

    // Date range filter
    if (filters.dateRange && (filters.dateRange.from || filters.dateRange.to)) {
      filtered = filtered.filter(tender => {
        if (!tender.offerDeadline) return true;
        
        const tenderDate = new Date(tender.offerDeadline);
        const fromDate = filters.dateRange.from ? new Date(filters.dateRange.from) : null;
        const toDate = filters.dateRange.to ? new Date(filters.dateRange.to) : null;
        
        if (fromDate && tenderDate < fromDate) return false;
        if (toDate && tenderDate > toDate) return false;
        return true;
      });
    }

    // Location filter (region and city)
    if (filters.region || filters.city) {
      filtered = filtered.filter(tender => {
        const location = tender.location?.toLowerCase() || '';
        
        if (filters.city && filters.city.trim()) {
          return location.includes(filters.city.toLowerCase());
        }
        
        if (filters.region && filters.region.trim()) {
          // Map region keys to location strings that might appear in tender data
          const regionMappings: { [key: string]: string[] } = {
            'riyadh': ['رياض', 'الرياض', 'riyadh'],
            'makkah': ['مكة', 'جدة', 'makkah', 'jeddah'],
            'eastern': ['دمام', 'خبر', 'eastern', 'dammam', 'khobar'],
            'asir': ['أبها', 'asir', 'abha'],
            'qassim': ['بريدة', 'qassim', 'buraidah'],
            'hail': ['حائل', 'hail'],
            'northern': ['عرعر', 'northern', 'arar'],
            'jazan': ['جازان', 'jazan'],
            'najran': ['نجران', 'najran'],
            'bahah': ['باحة', 'bahah'],
            'tabuk': ['تبوك', 'tabuk'],
            'jawf': ['جوف', 'jawf']
          };
          
          const regionKeywords = regionMappings[filters.region] || [filters.region];
          return regionKeywords.some(keyword => location.includes(keyword.toLowerCase()));
        }
        
        return true;
      });
    }

    // Domain filter (primary and sub domain)
    if (filters.primaryDomain || filters.subDomain) {
      filtered = filtered.filter(tender => {
        // Check if tender has domain information
        const tenderDomains = tender.subDomains || [];
        const tenderCategory = tender.category?.toLowerCase() || '';
        
        if (filters.subDomain) {
          return tenderDomains.some(domain => 
            domain.toLowerCase().includes(filters.subDomain.toLowerCase())
          ) || tenderCategory.includes(filters.subDomain.toLowerCase());
        }
        
        if (filters.primaryDomain) {
          // Map primary domains to categories/keywords
          const domainMappings: { [key: string]: string[] } = {
            'tech': ['تقنية', 'برمجيات', 'تكنولوجيا', 'tech', 'software', 'it'],
            'construction': ['بناء', 'تشييد', 'مقاولات', 'construction', 'building'],
            'education': ['تعليم', 'تدريب', 'education', 'training'],
            'health': ['صحة', 'طبي', 'health', 'medical'],
            'transport': ['نقل', 'مواصلات', 'transport', 'logistics']
          };
          
          const domainKeywords = domainMappings[filters.primaryDomain] || [filters.primaryDomain];
          return domainKeywords.some(keyword => 
            tenderCategory.includes(keyword.toLowerCase()) ||
            tenderDomains.some(domain => domain.toLowerCase().includes(keyword.toLowerCase()))
          );
        }
        
        return true;
      });
    }

    console.log('Filtered tenders:', filtered.length, 'of', tenders.length); // Debug log
    setFilteredTenders(filtered);
  };

  if (!currentSupplier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header userType="supplier" />
      
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">البحث المتقدم في المناقصات</h1>
              <p className="text-gray-600">ابحث وصفي المناقصات المتاحة التي تناسب تخصصك</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">نتائج البحث</div>
                <div className="text-lg font-bold text-tawreed-green">
                  {loading ? '...' : `${filteredTenders.length} مناقصة`}
                </div>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 space-x-reverse">
              <li>
                <Link to="/supplier" className="text-gray-500 hover:text-gray-700">الرئيسية</Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-400 mx-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-900 font-medium">المناقصات المتاحة</span>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Filter */}
          <div className="w-80 flex-shrink-0">
            <TenderFilter 
              onFilterChange={handleFilterChange}
              showStatusFilter={true}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-[420px] animate-pulse">
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredTenders.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مناقصات متطابقة</h3>
                <p className="text-gray-600 mb-6">جرب تعديل معايير البحث للعثور على مناقصات مناسبة</p>
                <button 
                  onClick={() => {
                    const resetFilters = {
                      searchText: '',
                      status: { active: false, nearDeadline: false },
                      budgetRange: [0, 10000000] as [number, number],
                      dateRange: { from: '', to: '' },
                      region: '',
                      city: '',
                      primaryDomain: '',
                      subDomain: '',
                    };
                    handleFilterChange(resetFilters);
                  }}
                  className="px-4 py-2 bg-tawreed-green text-white rounded-lg hover:bg-green-600"
                >
                  إعادة تعيين المرشحات
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredTenders.map((tender) => (
                  <TenderCard
                    key={tender.id}
                    tender={tender}
                    showActions={true}
                    userType="supplier"
                    onViewOffers={handleApplyForTender}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {!loading && filteredTenders.length > 0 && (
              <div className="text-center mt-12">
                <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  تحميل المزيد من المناقصات
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}