// Utility functions for tender data transformation and fetching
import { Tender, TenderEntity } from "@shared/api";

// Normalize various date input formats to 'YYYY-MM-DD'
export function normalizeDateInput(input?: string | null): string | undefined {
  if (!input) return undefined;
  const v = String(input).trim();
  if (!v) return undefined;

  // If already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;

  // Handle 'yy-dd-mm' (e.g., '25-19-10' => '2025-10-19')
  if (/^\d{2}-\d{2}-\d{2}$/.test(v)) {
    const [yy, dd, mm] = v.split('-');
    const yyyy = Number(yy) <= 69 ? `20${yy}` : `19${yy}`; // pivot for 2-digit years
    return `${yyyy}-${mm}-${dd}`;
  }

  // Handle 'dd-mm-yyyy'
  if (/^\d{2}-\d{2}-\d{4}$/.test(v)) {
    const [dd, mm, yyyy] = v.split('-');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Handle 'yyyy-dd-mm' (swap day and month)
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [yyyy, a, b] = v.split('-');
    // assume correct order if month in 01-12 already
    const month = Number(a);
    if (month >= 1 && month <= 12) return v;
    return `${yyyy}-${b}-${a}`;
  }

  // Fallback: try Date parsing and format
  const d = new Date(v);
  if (!isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  return undefined;
}

// Transform database tender entity to frontend tender interface
export function transformTenderForDisplay(dbTender: any, companyName?: string): Tender {
  // Calculate remaining days (mock calculation for demo)
  const submitDeadline = new Date(dbTender.submit_deadline || '2025-12-31');
  const queriesDeadline = new Date(dbTender.quires_deadline || '2025-11-30');
  const now = new Date();
  
  const remainingDays = Math.max(0, Math.ceil((submitDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const remainingInquiryDays = Math.max(0, Math.ceil((queriesDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  // Format dates to Arabic format
  const formatArabicDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}م`;
  };

  // Determine status based on remaining days
  let status: 'active' | 'expired' | 'awarded' | 'draft' = 'active';
  if (remainingDays <= 0) status = 'expired';

  // Extract sub-domain names
  const subDomains = dbTender.sub_domains 
    ? dbTender.sub_domains.map((sd: any) => sd.Name) 
    : [];

  return {
    id: String(dbTender.id),
    title: dbTender.title,
    company: companyName || dbTender.tender_coordinator || 'شركة غير محددة',
    category: dbTender.domain_name || 'فئة غير محددة',
    location: dbTender.city_name || 'غير محدد',
    region: dbTender.region_name || 'غير محدد',
    cityId: dbTender.city_table_id || dbTender.city_id || null,
    regionId: dbTender.region_id || null,
    budget: dbTender.expected_budget ? `${parseFloat(dbTender.expected_budget).toLocaleString('ar-SA')} ريال` : 'غير محدد',
    publishDate: formatArabicDate(dbTender.created_at),
    offerDeadline: formatArabicDate(dbTender.submit_deadline),
    inquiryDeadline: formatArabicDate(dbTender.quires_deadline),
    remainingDays,
    remainingInquiryDays,
    status,
    // Database status information
    status_id: dbTender.status_id,
    status_name: dbTender.status_name,
    description: dbTender.project_description,
    referenceNumber: String(dbTender.reference_number || dbTender.id),
  // raw deadline for client-side filters (ISO string)
  submit_deadline: dbTender.submit_deadline,
    subDomains,
    // expose numeric domain id and sub-domain ids so client-side filtering can match by id
    domainId: dbTender.domain_id || dbTender.domainId || null,
    subDomainIds: dbTender.sub_domains ? dbTender.sub_domains.map((sd: any) => sd.ID || sd.id) : [],
    rawSubDomains: dbTender.sub_domains || []
  };
}

// Fetch tenders from API (optionally filtered by buyer_id)
export async function fetchTenders(
  buyerId?: string | number,
  options?: { submitFrom?: string; submitTo?: string; expectedMin?: number; expectedMax?: number }
): Promise<Tender[]> {
  try {
    let url = '/api/tenders';
    const params: string[] = [];
    if (buyerId !== undefined && buyerId !== null) {
      params.push(`buyer_id=${encodeURIComponent(String(buyerId))}`);
    }

    const from = normalizeDateInput(options?.submitFrom);
    const to = normalizeDateInput(options?.submitTo);
  if (from) params.push(`submit_from=${encodeURIComponent(from)}`);
  if (to) params.push(`submit_to=${encodeURIComponent(to)}`);

  if (options?.expectedMin !== undefined) params.push(`expected_min=${encodeURIComponent(String(options.expectedMin))}`);
  if (options?.expectedMax !== undefined) params.push(`expected_max=${encodeURIComponent(String(options.expectedMax))}`);

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform database tenders to display format
    return data.tenders.map((dbTender: any) => transformTenderForDisplay(dbTender));
  } catch (error) {
    console.error('Error fetching tenders:', error);
    return [];
  }
}

// Fetch single tender by ID
export async function fetchTenderById(id: string): Promise<Tender | null> {
  try {
    const response = await fetch(`/api/tenders/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return transformTenderForDisplay(data.tender);
  } catch (error) {
    console.error('Error fetching tender:', error);
    return null;
  }
}

// Fetch tenders by domain
export async function fetchTendersByDomain(domainId: number): Promise<Tender[]> {
  try {
    const response = await fetch(`/api/domains/${domainId}/tenders`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.tenders.map((dbTender: any) => transformTenderForDisplay(dbTender));
  } catch (error) {
    console.error('Error fetching tenders by domain:', error);
    return [];
  }
}