import { cn } from "@/lib/utils";

export type TenderStatusType = 'OPEN' | 'AWARDING' | 'FINISHED';

interface TenderStatusTagProps {
  status: TenderStatusType;
  className?: string;
}

export default function TenderStatusTag({ status, className }: TenderStatusTagProps) {
  const getStatusConfig = (status: TenderStatusType) => {
    switch (status) {
      case 'OPEN':
        return {
          label: 'مفتوح',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
        };
      case 'AWARDING':
        return {
          label: 'قيد التقييم',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
        };
      case 'FINISHED':
        return {
          label: 'مكتمل',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
        };
      default:
        return {
          label: 'غير محدد',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-200',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      {config.label}
    </span>
  );
}

// Helper function to map database status names to component status types
export function mapDatabaseStatus(statusName: string | null | undefined): TenderStatusType {
  if (!statusName) return 'OPEN';
  
  switch (statusName.toUpperCase()) {
    case 'OPEN':
      return 'OPEN';
    case 'AWARDING':
      return 'AWARDING';
    case 'FINISHED':
      return 'FINISHED';
    default:
      return 'OPEN';
  }
}