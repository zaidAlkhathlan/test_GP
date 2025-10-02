import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import TenderCard from "../components/TenderCard";
import { fetchTenders } from "../utils/tenderUtils";
import { Tender } from "@shared/api";

export default function BuyerHome() {
  const [currentBuyer, setCurrentBuyer] = useState<any>(null);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const buyerData = localStorage.getItem("currentBuyer");
    if (buyerData) setCurrentBuyer(JSON.parse(buyerData));
    else navigate("/buyer/signin");
  }, [navigate]);

  // Fetch tenders from API - only for current buyer
  useEffect(() => {
    async function loadTenders() {
      try {
        setLoading(true);
        // Pass buyer ID to fetch only their tenders
        const fetchedTenders = await fetchTenders(currentBuyer.id);
        setTenders(fetchedTenders);
      } catch (error) {
        console.error('Error loading tenders:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (currentBuyer) {
      loadTenders();
    }
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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Header userType="buyer" />
      <div className="max-w-[1400px] mx-auto px-8 py-6">

        {/* Page title + CTA */}
        <div className="text-right mb-6">
          <h1 className="text-2xl font-bold text-tawreed-text-dark">
            منصة <span className="text-tawreed-green">توريد</span> الذكية للمشتريات
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            منصة المشتريات المدعومة بالذكاء الاصطناعي لتبسيط عمليات الشراء وتحسين الكفاءة
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <button className="bg-tawreed-green text-white px-6 py-2 rounded-full shadow">
            استكشف المناقصات الذكية
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link to="/tenders/new" className="bg-tawreed-green text-white px-3 py-1 rounded-md inline-flex items-center">
                نشر مناقصة جديدة
              </Link>
            </div>
            <div className="text-right">
              <h3 className="text-base font-semibold">الإحصائيات الحية</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* card 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-right flex items-center gap-4">
              <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#16a34a" strokeWidth="1.2" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">عروض مقدمة</div>
                <div className="text-2xl font-bold text-tawreed-green">1,719,931</div>
                <div className="text-xs text-green-500">12.5% ↑</div>
              </div>
            </div>
            {/* card 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-right flex items-center gap-4">
              <div className="w-14 h-14 bg-yellow-50 rounded-lg flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M3 17l3-3 4 4 8-8 3 3" stroke="#c59f10" strokeWidth="1.2" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">مناقصات تم ترسيطها</div>
                <div className="text-2xl font-bold text-tawreed-green">405,926</div>
                <div className="text-xs text-green-500">8.3% ↑</div>
              </div>
            </div>
            {/* card 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-right flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 20v-1c0-2.21 1.79-4 4-4h4c2.21 0 4 1.79 4 4v1" stroke="#1e40af" strokeWidth="1.2" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">مناقصات نشطة</div>
                <div className="text-2xl font-bold text-tawreed-green">4,020</div>
                <div className="text-xs text-green-500">15.2% ↑</div>
              </div>
            </div>
            {/* card 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-right flex items-center gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M9 12a4 4 0 1 1 6 0" stroke="#15803d" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="#15803d" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">موردين نشطين</div>
                <div className="text-2xl font-bold text-tawreed-green">892</div>
                <div className="text-xs text-green-500">5.7% ↑</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tender card section */}
        <div className="flex justify-start mb-8">
          <div className="w-full max-w-lg">
            {loading ? (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : tenders.length > 0 ? (
              <TenderCard
                tender={tenders[0]}
                userType="buyer"
                onViewOffers={(tenderId) => navigate(`/tender/${tenderId}/offers`)}
                className=""
              />
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="text-gray-500">لا توجد مناقصات متاحة حالياً</div>
                <Link 
                  to="/tenders/new" 
                  className="mt-4 inline-block bg-tawreed-green text-white px-4 py-2 rounded"
                >
                  إنشاء مناقصة جديدة
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10">
          <div className="bg-green-50 rounded-lg p-8">
            <div className="max-w-[1100px] mx-auto flex items-center justify-between">
              <div className="text-right">
                <h4 className="text-lg font-semibold">ابدأ مشروعك القادم</h4>
                <p className="text-sm text-gray-600">استخدم منصة توريد لإنشاء مناقصة جديدة والعثور على أفضل الموردين</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-white border rounded">استعراض الموردين</button>
                <Link to="/tenders/new" className="px-4 py-2 bg-tawreed-green text-white rounded inline-block text-center">
                  انشاء مناقصة جديدة
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
