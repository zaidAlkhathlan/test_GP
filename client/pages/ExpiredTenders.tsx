import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TenderFilter from '../components/TenderFilter';
import { fetchTenders } from '../utils/tenderUtils';
import { Tender } from '@shared/api';

export default function ExpiredTenders() {
  const navigate = useNavigate();
  const [currentBuyer, setCurrentBuyer] = useState<any>(null);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  const handleViewOffers = (tenderId: string) => {
    navigate(`/tender/${tenderId}/offers`);
  };

  const handleFilterChange = (filters: any) => {
    let filtered = [...tenders];

    // Search text filter
    if (filters.searchText) {
      filtered = filtered.filter(tender => 
        tender.title.toLowerCase().includes(filters.searchText.toLowerCase()) ||
        tender.description?.toLowerCase().includes(filters.searchText.toLowerCase())
      );
    }

    // Status filter for expired tenders (renaming for context: active = منتهية, nearDeadline = ملغاة)
    if (filters.status.active || filters.status.nearDeadline) {
      filtered = filtered.filter(tender => {
        if (filters.status.active && tender.status === 'expired') return true;
        if (filters.status.nearDeadline && tender.status === 'draft') return true; // Using draft as cancelled equivalent
        return false;
      });
    }

    // Budget filter
    if (filters.budgetRange[0] > 0 || filters.budgetRange[1] < 10000000) {
      filtered = filtered.filter(tender => {
        const budget = parseFloat(tender.budget?.replace(/[^\d]/g, '') || '0');
        return budget >= filters.budgetRange[0] && budget <= filters.budgetRange[1];
      });
    }

    // Location filter (region and city)
    if (filters.region || filters.city) {
      filtered = filtered.filter(tender => {
        const location = tender.location?.toLowerCase() || '';
        if (filters.city) {
          return location.includes(filters.city.toLowerCase());
        }
        return true;
      });
    }

    // Domain filters
    if (filters.primaryDomain) {
      filtered = filtered.filter(tender =>
        tender.category?.toLowerCase().includes(filters.primaryDomain.toLowerCase())
      );
    }

    setFilteredTenders(filtered);
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

  // Fetch buyer's expired tenders
  useEffect(() => {
    async function loadExpiredTenders() {
      if (!currentBuyer) return;
      
      try {
        setLoading(true);
        // Fetch only this buyer's tenders
        const fetchedTenders = await fetchTenders(currentBuyer.id);
        // Filter to show only expired tenders
        const expiredTenders = fetchedTenders.filter(tender => tender.status === 'expired');
        setTenders(expiredTenders);
        setFilteredTenders(expiredTenders);
      } catch (error) {
        console.error('Error loading expired tenders:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadExpiredTenders();
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

  const sampleTenders = Array.from({ length: 3 }).map((_, i) => ({
    id: `e${i + 1}`,
    title: i === 2 ? 'إنشاء بوابة أمنية على طريق السلامة بخشم النجار' : 'بناء ورشة سيارات',
    org: 'مؤسسة نماء للمشتريات',
    endDate: '2025-08-04',
    offers: 8,
    visits: 12,
    daysLeft: 0,
    budget: '1000 ريال'
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userType="buyer" />
      <div className="max-w-[1200px] mx-auto px-6 py-10">

        <div className="flex items-start gap-6" dir="rtl">
          <main className="flex-1">
            <div className="text-right mb-6">
              <h1 className="text-2xl font-bold">المناقصات المنتهية</h1>
              <p className="text-sm text-gray-500">قائمة بالمناقصات التي انتهت مواعيد تقديم العروض</p>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div>
                <select className="border rounded px-3 py-2">
                  <option>ترتيب حسب</option>
                  <option>تاريخ الانتهاء</option>
                </select>
              </div>
              <div>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">تصدير القائمة</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="w-full h-full">
                    <div className="bg-white rounded-xl p-6 shadow-sm h-full">
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
                  <div key={tender.id} className="bg-white rounded shadow p-6" dir="rtl">
                    <div className="flex items-start justify-between">
                      <div className="text-right">
                        <h3 className="text-lg font-semibold">{tender.title}</h3>
                        <p className="text-sm text-gray-500">{tender.company}</p>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          {tender.category && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{tender.category}</span>
                          )}
                          {tender.subDomains?.slice(0, 1).map((subDomain, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{subDomain}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-gray-50 p-3 rounded">
                      <div className="flex items-center gap-4 justify-between">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">تاريخ الانتهاء: {tender.offerDeadline}</div>
                          <div className="text-xs text-gray-400">الرقم المرجعي: {tender.referenceNumber}</div>
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-red-600">منتهية</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-right">
                        <p className="text-sm">قيمة العطاء</p>
                        <p className="font-bold">{tender.budget || 'غير محدد'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to={`/tender/${tender.id}`} className="px-3 py-1 bg-white border rounded">التفاصيل</Link>
                        <button 
                          onClick={() => handleViewOffers(tender.id)}
                          className="px-3 py-1 bg-gray-500 text-white rounded inline-flex items-center gap-2"
                        >
                          العروض المقدمة
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 mt-3">تاريخ النشر: {tender.publishDate}</div>
                  </div>
                ))
              ) : (
                // No tenders found
                <div className="col-span-full">
                  <div className="bg-white rounded-xl p-8 shadow-sm text-center max-w-lg mx-auto">
                    <div className="text-gray-500 mb-4">
                      {tenders.length === 0 ? 'لا توجد لديك مناقصات منتهية حالياً' : 'لا توجد نتائج مطابقة للفلاتر المحددة'}
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
            <TenderFilter onFilterChange={handleFilterChange} showStatusFilter={false} />
          </aside>
        </div>
      </div>
    </div>
  );
}
