import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TenderCard from '../components/TenderCard';
import TenderFilter from '../components/TenderFilter';
import { fetchTenders } from '../utils/tenderUtils';
import { Tender } from '@shared/api';

export default function ActiveTenders() {
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

    // Status filter
    if (filters.status.active || filters.status.nearDeadline) {
      filtered = filtered.filter(tender => {
        if (filters.status.active && tender.status === 'active') return true;
        if (filters.status.nearDeadline && tender.remainingDays <= 7) return true;
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

  // Fetch buyer's active tenders
  useEffect(() => {
    async function loadActiveTenders() {
      if (!currentBuyer) return;
      
      try {
        setLoading(true);
        // Fetch only this buyer's tenders
        const fetchedTenders = await fetchTenders(currentBuyer.id);
        // Filter to show only active (non-expired) tenders
        const activeTenders = fetchedTenders.filter(tender => tender.status === 'active');
        setTenders(activeTenders);
        setFilteredTenders(activeTenders);
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
