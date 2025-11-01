import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TenderCard from '../components/TenderCard';
import TenderFilter from '../components/TenderFilter';
import { fetchTenders, normalizeDateInput } from '../utils/tenderUtils';
import { Tender } from '@shared/api';

export default function AvailableTenders() {
  const navigate = useNavigate();
  const [currentSupplier, setCurrentSupplier] = useState<any>(null);
  const [allTenders, setAllTenders] = useState<Tender[]>([]);
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
      if (!currentSupplier) return;
      
      try {
        setLoading(true);
        // Fetch all tenders for suppliers to browse
        const tendersData = await fetchTenders();
        // Keep all fetched tenders in memory (full list)
        setAllTenders(tendersData);
        setTenders(tendersData);
        // Only show active tenders by default for suppliers
        const activeTenders = tendersData.filter(tender => 
          (tender as any).status_id === 1 || tender.status === 'active'
        );
        setFilteredTenders(activeTenders);
      } catch (error) {
        console.error('Error fetching tenders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTenders();
  }, [currentSupplier]);

  const handleApplyForTender = (tenderId: string) => {
    // Navigate to tender application/details page
    navigate(`/tender/${tenderId}/apply`);
  };

  const handleFilterChange = async (filters: any) => {
    console.log('AvailableTenders.handleFilterChange called with filters:', filters);
    let base: Tender[] = [...allTenders];

    // If a date range and/or budget range is provided, fetch from server
    const from = normalizeDateInput(filters?.dateRange?.from);
    const to = normalizeDateInput(filters?.dateRange?.to);
    const DEFAULT_BUDGET_MAX = 10000000;
    const hasBudget = Array.isArray(filters?.budgetRange)
      && (filters.budgetRange[0] > 0 || filters.budgetRange[1] < DEFAULT_BUDGET_MAX);

    let appliedServerBudgetFilter = false;
    if (from || to || hasBudget) {
      try {
        const opts: any = {};
        if (from) opts.submitFrom = from;
        if (to) opts.submitTo = to;
        if (hasBudget) {
          opts.expectedMin = Number(filters.budgetRange[0]) || 0;
          // Only send max if user reduced it below default
          if (filters.budgetRange[1] < DEFAULT_BUDGET_MAX) {
            opts.expectedMax = Number(filters.budgetRange[1]);
          }
          appliedServerBudgetFilter = true;
        }
        const serverFiltered = await fetchTenders(null, opts); // No specific buyer for suppliers
        // Only show active tenders for suppliers
        base = serverFiltered.filter(tender => 
          (tender as any).status_id === 1 || tender.status === 'active'
        );
      } catch (e) {
        console.warn('Failed to fetch server-filtered tenders by date/budget range', e);
        appliedServerBudgetFilter = false;
      }
    }

    let filtered = [...base];

    // Search text filter
    if (filters.searchText) {
      filtered = filtered.filter(tender => 
        tender.title.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        tender.description?.toLowerCase().includes(filters.searchText.toLowerCase())
      );
    }

    // Status filter - filters.status is an array of selected status IDs
    if (Array.isArray(filters.status) && filters.status.length > 0) {
      const now = new Date();
      const matchesStatus = (sId: number, t: Tender) => {
        const sid = (t as any).status_id || null;

        // If we have numeric id on tender, use it primarily
        if (sid) {
          if (sId === 1) {
            // OPEN: only include if deadline not passed (not expired)
            return Number(sid) === 1 && (t.remainingDays ?? 0) > 0;
          }

          if (sId === 2) {
            // AWARDING: include tenders already AWARDING, and also those still OPEN but expired
            if (Number(sid) === 2) return true;
            if (Number(sid) === 1) {
              return (t.remainingDays ?? 0) <= 0; // expired but still marked OPEN in DB
            }
            return false;
          }

          if (sId === 3) {
            // FINISHED: match only finished
            return Number(sid) === 3;
          }

          return false;
        }

        // Fallback textual matching when no numeric id present
        const name = (t as any).status_name || t.status || '';
        if (!name) return false;

        if (sId === 1) return String(name).toUpperCase().includes('OPEN') || String(name).includes('نشط');
        if (sId === 2) return String(name).toUpperCase().includes('AWARD') || String(name).includes('ترس') || String(name).toLowerCase().includes('قريب');
        if (sId === 3) return String(name).toUpperCase().includes('FINISH') || String(name).includes('قفل') || String(name).includes('مكتمل');
        return false;
      };

      filtered = filtered.filter((tender) => {
        return filters.status.some((sId: number) => matchesStatus(Number(sId), tender));
      });
    }

    // Budget filter (skip if already applied on server)
    if (!appliedServerBudgetFilter) {
      if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < DEFAULT_BUDGET_MAX) {
        filtered = filtered.filter(tender => {
          const budget = parseFloat(tender.budget?.replace(/[^\d]/g, '') || '0');
          return budget >= filters.budgetRange[0] && budget <= filters.budgetRange[1];
        });
      }
    }

    // Location filter (region and city) - prefer numeric ids when available
    if (filters.region || filters.city) {
      filtered = filtered.filter(tender => {
        // If both tender and filter provide numeric ids, compare them
        if (filters.city && (tender as any).cityId) {
          return Number((tender as any).cityId) === Number(filters.city);
        }

        if (filters.region && (tender as any).regionId) {
          if (!filters.city) return Number((tender as any).regionId) === Number(filters.region);
        }

        // Fallback: match by location name
        const location = tender.location?.toLowerCase() || '';
        if (filters.city) {
          return location.includes(String(filters.city).toLowerCase());
        }
        return true;
      });
    }

    // Domain filters
    if (filters.primaryDomain) {
      // If tender has numeric domain id, compare by id
      filtered = filtered.filter((tender) => {
        const tDomainId = (tender as any).domain_id || (tender as any).domainId;
        if (tDomainId) {
          return String(tDomainId) === String(filters.primaryDomain);
        }

        // Fallback: check category/name
        return tender.category?.toLowerCase().includes(String(filters.primaryDomain).toLowerCase());
      });
    }

    if (filters.subDomain) {
      // Prefer numeric subDomainIds exposed by transformTenderForDisplay
      filtered = filtered.filter((tender) => {
        const tSubIds: number[] | undefined = (tender as any).subDomainIds;
        if (Array.isArray(tSubIds) && tSubIds.length > 0) {
          return tSubIds.some(id => String(id) === String(filters.subDomain));
        }

        // Fallback: check raw sub-domain objects if available
        const raw = (tender as any).rawSubDomains || (tender as any).sub_domains || (tender as any).subDomains || [];
        if (Array.isArray(raw) && raw.length > 0) {
          return raw.some((sd: any) => String(sd.ID || sd.id) === String(filters.subDomain) || String(sd.Name || sd.name).toLowerCase().includes(String(filters.subDomain).toLowerCase()));
        }

        // Final fallback: compare against the simple subDomains names array
        const subNames = (tender as any).subDomains || [];
        return Array.isArray(subNames) && subNames.some((s: string) => s.toLowerCase().includes(String(filters.subDomain).toLowerCase()));
      });
    }

    setFilteredTenders(filtered);
    console.log('AvailableTenders: filtered count ->', filtered.length);
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
                <p className="text-gray-600 mb-6">
                  {tenders.length === 0 ? 'لا توجد مناقصات متاحة حالياً' : 'لا توجد نتائج مطابقة للفلاتر المحددة'}
                </p>
                {tenders.length > 0 && (
                  <button 
                    onClick={() => {
                      const resetFilters = {
                        searchText: '',
                        status: [],
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
                )}
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