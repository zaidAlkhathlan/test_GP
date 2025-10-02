import { Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tender } from "@shared/api";
import clsx from "clsx";

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
  const submissionProgress = Math.min(100, (tender.remainingDays / 30) * 100);
  const inquiryProgress = Math.min(100, (tender.remainingInquiryDays / 30) * 100);

  return (
    <div className={clsx("w-full h-full rounded-2xl border border-[#E0E0E0] bg-white shadow-sm p-6 flex flex-col", className)} dir="rtl">
      {/* Title & Company */}
      <div className="mb-4 text-right">
        <h3 className="text-[22px] font-bold text-[#16A249] mb-2">{tender.title}</h3>
        <p className="text-base text-[#555]">{tender.company}</p>
      </div>

      {/* Category and Sub-domain tags */}
      <div className="flex gap-2 mb-6 flex-wrap justify-end">
        {tender.category && (
          <span className="px-5 py-1.5 rounded-lg bg-[#28A745] text-white text-sm">{tender.category}</span>
        )}
        {tender.subDomains && tender.subDomains.map((subDomain, index) => (
          <span key={index} className="px-3 py-1.5 rounded-lg bg-[#5C650E] text-white text-xs">
            {subDomain}
          </span>
        ))}
      </div>

      {/* Info box */}
      <div className="rounded-xl bg-[#F7FDF8] p-6 mb-6">
        {/* Row 1 */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 mb-4" dir="ltr">
          <ProgressRing percentage={submissionProgress} days={tender.remainingDays} />

          <div className="flex items-center gap-2 text-xs text-[#333] flex-wrap justify-end" dir="rtl">
            <span className="text-sm">م</span>
            <span className="tabular-nums">{tender.offerDeadline}</span>
            <span className="whitespace-nowrap">موعد انتهاء تقديم العروض</span>
            <Calendar className="w-4 h-4 text-[#28A745]" />
          </div>

          <div className="flex items-center gap-2 text-xs text-[#333]" dir="rtl">
            <Hash className="w-4 h-4 text-[#28A745]" />
            {tender.location && (
              <span className="truncate max-w-[28ch]">{tender.location}</span>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4" dir="ltr">
          <ProgressRing percentage={inquiryProgress} days={tender.remainingInquiryDays} />

          <div className="flex items-center gap-2 text-xs text-[#333] flex-wrap justify-end" dir="rtl">
            <span className="text-sm">م</span>
            <span className="tabular-nums">{tender.inquiryDeadline}</span>
            <span className="whitespace-nowrap">موعد انتهاء الاستفسارات</span>
            <Calendar className="w-4 h-4 text-[#28A745]" />
          </div>

          <div /> {/* empty to align grid */}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-3 mb-6 justify-end">
          <Link to={`/tender/${tender.id}`}>
            <Button
              variant="outline"
              className="h-10 px-6 rounded-lg border border-[#28A745] text-[#28A745] bg-white hover:bg-[#28A745]/5"
            >
              التفاصيل
            </Button>
          </Link>
          <Button
            className="h-10 px-6 rounded-lg bg-[#28A745] text-white hover:bg-[#28A745]/90"
            onClick={() => (userType === "buyer" && onViewOffers ? onViewOffers(tender.id) : null)}
          >
            العروض المقدمة
          </Button>
        </div>
      )}

      {/* Budget */}
      {tender.budget && (
        <div className="mb-6 text-right">
          <span className="text-sm text-[#555] ml-2">الميزانية المتوقعة:</span>
          <span className="text-xl font-bold text-[#212121]">{tender.budget}</span>
        </div>
      )}

      {/* Spacer to push footer down */}
      <div className="flex-grow"></div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-[#707070]">
        <span>تاريخ النشر: {tender.publishDate}</span>
        <span>الرقم المرجعي #{tender.referenceNumber}</span>
      </div>
    </div>
  );
}

function ProgressRing({ percentage, days }: { percentage: number; days: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-10 h-10 shrink-0">
      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={radius} stroke="#E0E0E0" strokeWidth="4" fill="none" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="#28A745"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-tight">
        <span className="text-xs font-bold text-[#333]">{days}</span>
        <span className="text-[9px] font-bold text-[#333]">ايام</span>
      </div>
    </div>
  );
}
