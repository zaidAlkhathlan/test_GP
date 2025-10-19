import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TenderCard from '../components/TenderCard';
import TenderFilter from '../components/TenderFilter';
import { fetchTenders, normalizeDateInput } from '../utils/tenderUtils';
import { Tender } from '@shared/api';

export default function ActiveTenders() {
  const navigate = useNavigate();
  const [currentBuyer, setCurrentBuyer] = useState<any>(null);
  const [allBuyerTenders, setAllBuyerTenders] = useState<Tender[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  const handleViewOffers = (tenderId: string) => {
    navigate(`/tender/${tenderId}/offers`);
  };

  const handleFilterChange = async (filters: any) => {
    console.log('ActiveTenders.handleFilterChange called with filters:', filters);
    let base: Tender[] = [...allBuyerTenders];

    // If a date range and/or budget range is provided, fetch from server
    const from = normalizeDateInput(filters?.dateRange?.from);
    const to = normalizeDateInput(filters?.dateRange?.to);
    const DEFAULT_BUDGET_MAX = 10000000;
    const hasBudget = Array.isArray(filters?.budgetRange)
      && (filters.budgetRange[0] > 0 || filters.budgetRange[1] < DEFAULT_BUDGET_MAX);

    let appliedServerBudgetFilter = false;
    if ((from || to || hasBudget) && currentBuyer) {
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
        const serverFiltered = await fetchTenders(currentBuyer.id, opts);
        base = serverFiltered;
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
    console.log('ActiveTenders: filtered count ->', filtered.length);
  };

  // Check buyer authentication
  useEffect(() => {
    const buyerData = localStorage.getItem('currentBuyer');
    if (buyerData) {
      setCurrentBuyer(JSON.parse(buyerData));
    } else {
      navigate('/buyer/signin');
    }
  }, [navigate]);

  // Fetch buyer's tenders (load all statuses). UI will by default show OPEN tenders but filters can show AWARDING/FINISHED
  useEffect(() => {
    async function loadActiveTenders() {
      if (!currentBuyer) return;
      
      try {
        setLoading(true);
        // Fetch only this buyer's tenders
        const fetchedTenders = await fetchTenders(currentBuyer.id);
  // Keep all fetched tenders in memory (full list)
  setAllBuyerTenders(fetchedTenders);
  setTenders(fetchedTenders);
        // By default show only OPEN tenders to preserve existing 'active' UX
        const defaultVisible = fetchedTenders.filter((t) => (t as any).status_id === 1 || (t.status === 'active'));
        setFilteredTenders(defaultVisible);
      } catch (error) {
        console.error('Error loading active tenders:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadActiveTenders();
  }, [currentBuyer]);

  if (!currentBuyer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-lg">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="buyer" />
      <div className="max-w-[1400px] mx-auto px-6 py-10">

        <div className="flex items-start gap-8" dir="rtl">
          <main className="flex-1">
            <div className="text-right mb-6">
              <h1 className="text-2xl font-bold">مناقصاتي النشطة</h1>
              <p className="text-sm text-gray-500">عرض وإدارة مناقصاتي النشطة والحصول على العروض</p>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div>
                <select className="border rounded px-3 py-2">
                  <option>ترتيب حسب</option>
                  <option>تاريخ النشر</option>
                </select>
              </div>
              <div>
                <Link to="/tenders/new" className="bg-tawreed-green text-white px-4 py-2 rounded inline-block">نشر مناقصة جديدة</Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="w-full h-full">
                    <div className="bg-white rounded-xl p-8 shadow-sm h-full min-h-[400px]">
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredTenders.length > 0 ? (
                // Real tender data
                filteredTenders.map((tender) => (
                  <div key={tender.id} className="w-full">
                    <TenderCard 
                      tender={tender}
                      userType="buyer"
                      onViewOffers={handleViewOffers}
                      className="h-full"
                    />
                  </div>
                ))
              ) : (
                // No tenders found
                <div className="col-span-full">
                  <div className="bg-white rounded-xl p-8 shadow-sm text-center max-w-lg mx-auto">
                    <div className="text-gray-500 mb-4">
                      {tenders.length === 0 ? 'لا توجد لديك مناقصات نشطة حالياً' : 'لا توجد نتائج مطابقة للفلاتر المحددة'}
                    </div>
                    {tenders.length === 0 ? (
                      <Link 
                        to="/tenders/new" 
                        className="inline-block bg-tawreed-green text-white px-6 py-2 rounded"
                      >
                        إنشاء مناقصة جديدة
                      </Link>
                    ) : (
                      <p className="text-sm text-gray-400">جرب تغيير الفلاتر للعثور على المزيد من النتائج</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </main>

          <aside className="w-80">
            <TenderFilter onFilterChange={handleFilterChange} />
          </aside>
        </div>
      </div>
    </div>
  );
}
