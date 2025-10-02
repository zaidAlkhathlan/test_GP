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

        <div dir="rtl">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
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
            ) : tenders.length > 0 ? (
              // Real tender data
              tenders.map((tender) => (
                <div key={tender.id} className="w-full h-full flex">
                  <TenderCard 
                    tender={tender}
                    userType="buyer"
                    onViewOffers={handleViewOffers}
                  />
                </div>
              ))
            ) : (
              // No tenders found
              <div className="col-span-full">
                <div className="w-full max-w-lg mx-auto">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
