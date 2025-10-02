import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TenderCard from '../components/TenderCard';
import { fetchTenders } from '../utils/tenderUtils';
import { Tender } from '@shared/api';

export default function ActiveTenders() {
  const navigate = useNavigate();
  const [currentBuyer, setCurrentBuyer] = useState<any>(null);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  const handleViewOffers = (tenderId: string) => {
    navigate(`/tender/${tenderId}/offers`);
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
      <div className="max-w-[1200px] mx-auto px-6 py-10">

        <div className="flex items-start gap-6" dir="rtl">
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

            <div className="space-y-6">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="w-full max-w-lg">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : tenders.length > 0 ? (
                // Real tender data
                tenders.map((tender) => (
                  <div key={tender.id} className="w-full max-w-lg">
                    <TenderCard 
                      tender={tender}
                      userType="buyer"
                      onViewOffers={handleViewOffers}
                    />
                  </div>
                ))
              ) : (
                // No tenders found
                <div className="w-full max-w-lg">
                  <div className="bg-white rounded-xl p-8 shadow-sm text-center">
                    <div className="text-gray-500 mb-4">لا توجد لديك مناقصات نشطة حالياً</div>
                    <Link 
                      to="/tenders/new" 
                      className="inline-block bg-tawreed-green text-white px-6 py-2 rounded"
                    >
                      إنشاء مناقصة جديدة
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </main>

          <aside className="w-80">
            <div className="bg-white rounded p-4 shadow">
              <h4 className="text-right font-semibold">مناقصاتي</h4>
              <input placeholder="ابحث عن مناقصة" className="w-full border rounded px-3 py-2 mt-3" />

              <div className="mt-4">
                <p className="text-sm text-gray-500">حالة المناقصة</p>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2"><input type="checkbox" /> نشطة</label>
                  <label className="flex items-center gap-2"><input type="checkbox" /> قيد المراجعة</label>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
