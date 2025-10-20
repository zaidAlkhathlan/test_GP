import { Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Tender } from "@shared/api";
import clsx from "clsx";
import TenderStatusTag, { mapDatabaseStatus } from "@/components/ui/TenderStatusTag";

interface TenderCardProps {
  tender: Tender;
  showActions?: boolean;
  userType?: "buyer" | "supplier";
  onViewOffers?: (tenderId: string) => void;
  className?: string;
}

export default function TenderCard({
  tender,
  showActions = true,
  userType = "supplier",
  onViewOffers,
  className = "",
}: TenderCardProps) {
  const navigate = useNavigate();
  const submissionProgress = Math.min(100, (tender.remainingDays / 30) * 100);
  const inquiryProgress = Math.min(100, (tender.remainingInquiryDays / 30) * 100);

  // Check if tender is finished (status_id = 3)
  const isTenderFinished = tender.status_id === 3;

  return (
    <div className={clsx(
      "w-full rounded-xl border bg-white shadow-sm p-8 min-h-[420px]",
      isTenderFinished 
        ? "border-green-200 bg-green-50/30" 
        : "border-gray-200",
      className
    )} dir="rtl">
      {/* Title & Company */}
      <div className="mb-6 text-right">
        <div className="flex items-start justify-between mb-2">
         
          <h3 className="text-xl font-bold text-gray-900 leading-tight flex-1">{tender.title}</h3>

           <TenderStatusTag 
            status={mapDatabaseStatus(tender.status_name)} 
            className="mr-2 mt-1" 
          />
        </div>
        <p className="text-base text-gray-600">{tender.company}</p>
        
        {/* Location: Region and City - Always show for all tenders */}
        {(tender.region || tender.location) && (
          <div className="mt-2 flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">
              {tender.region && tender.location && tender.region !== tender.location 
                ? `${tender.region} - ${tender.location}`
                : tender.region || tender.location
              }
            </span>
          </div>
        )}
      </div>

      {/* Category tags */}
      <div className="mb-4 text-right">
        <div className="inline-flex gap-2 flex-wrap">
          {tender.category && (
            <span className="px-3 py-1 rounded bg-[#28A745] text-white text-xs font-medium">{tender.category}</span>
          )}
          {tender.subDomains && tender.subDomains.map((subDomain, index) => (
            <span key={index} className="px-3 py-1 rounded bg-gray-600 text-white text-xs">
              {subDomain}
            </span>
          ))}
        </div>
      </div>

      {/* Progress and Date Info - Hidden for finished tenders */}
      {!isTenderFinished && (
        <div className="mb-6">
          {/* Progress circles and dates */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#28A745]" />
              <div className="text-right">
                <span className="text-sm text-gray-600 block">موعد انتهاء تقديم العروض</span>
                <span className="text-sm font-medium">{tender.offerDeadline}</span>
              </div>
            </div>
            <ProgressRing percentage={submissionProgress} days={tender.remainingDays} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#28A745]" />
              <div className="text-right">
                <span className="text-sm text-gray-600 block">موعد انتهاء الاستفسارات</span>
                <span className="text-sm font-medium">{tender.inquiryDeadline}</span>
              </div>
            </div>
            <ProgressRing percentage={inquiryProgress} days={tender.remainingInquiryDays} />
          </div>
        </div>
      )}

      {/* Awarded Status Info - Show only for finished tenders */}
      {isTenderFinished && (
        <div className="mb-6">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-green-800 block">تم اعتماد المورد الفائز</span>
              <span className="text-xs text-green-600">المناقصة مكتملة</span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 mb-4 justify-end">
          <Link to={`/tender/${tender.id}`}>
            <Button
              variant="outline"
              className="h-8 px-4 rounded text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            >
              التفاصيل
            </Button>
          </Link>
          {userType === "buyer" ? (
            isTenderFinished ? (
              <Button
                className="h-8 px-4 rounded text-sm bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                onClick={() => navigate(`/awarded-supplier/${tender.id}`)}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                المورد الفائز
              </Button>
            ) : (
              <Button
                className="h-8 px-4 rounded text-sm bg-[#28A745] text-white hover:bg-[#28A745]/90"
                onClick={() => onViewOffers && onViewOffers(tender.id)}
              >
                العروض المقدمة
              </Button>
            )
          ) : (
            <Link to={`/tender/${tender.id}/submit-offer`}>
              <Button
                className="h-8 px-4 rounded text-sm bg-[#28A745] text-white hover:bg-[#28A745]/90"
              >
                تقديم عرض
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Budget */}
      <div className="mb-6 text-right">
        <span className="text-base text-gray-600 block mb-1">الميزانية المتوقعة:</span>
        <div className="text-2xl font-bold text-gray-900">{tender.budget || 'خطأ في تحميل الميزانية'}</div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
        {isTenderFinished ? (
          <>
            <span>حالة المناقصة: مكتملة</span>
            <span>الرقم المرجعي {tender.referenceNumber}</span>
          </>
        ) : (
          <>
            <span>تاريخ النشر: {tender.publishDate}</span>
            <span>الرقم المرجعي {tender.referenceNumber}</span>
          </>
        )}
      </div>
    </div>
  );
}

function ProgressRing({ percentage, days }: { percentage: number; days: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  // Color based on days remaining
  const getColor = (days: number) => {
    if (days <= 3) return "#EF4444"; // Red
    if (days <= 7) return "#F59E0B"; // Orange
    return "#10B981"; // Green
  };

  const color = getColor(days);

  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={radius} stroke="#E5E7EB" strokeWidth="3" fill="none" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold" style={{ color }}>{days}</span>
        <span className="text-[10px] font-medium text-gray-600">يوم</span>
      </div>
    </div>
  );
}
