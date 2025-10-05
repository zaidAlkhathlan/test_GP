// Utility functions for tender data transformation and fetching
import { Tender, TenderEntity } from "@shared/api";

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
    location: dbTender.city,
    budget: dbTender.expected_budget ? `${parseFloat(dbTender.expected_budget).toLocaleString('ar-SA')} ريال` : 'غير محدد',
    publishDate: formatArabicDate(dbTender.created_at),
    offerDeadline: formatArabicDate(dbTender.submit_deadline),
    inquiryDeadline: formatArabicDate(dbTender.quires_deadline),
    remainingDays,
    remainingInquiryDays,
    status,
    description: dbTender.project_description,
    referenceNumber: String(dbTender.reference_number || dbTender.id),
    subDomains
  };
}

// Fetch tenders from API (optionally filtered by buyer_id)
export async function fetchTenders(buyerId?: string | number): Promise<Tender[]> {
  try {
    let url = '/api/tenders';
    if (buyerId) {
      url += `?buyer_id=${buyerId}`;
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