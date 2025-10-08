/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Domain and sub-domain types
 */
export interface Domain {
  ID: number;
  Name: string;
}

export interface SubDomain {
  ID: number;
  domain_id: number;
  Name: string;
  domain_name?: string; // Optional, only present when joined with domain
}

export interface DomainsResponse {
  domains: Domain[];
}

export interface SubDomainsResponse {
  subDomains: SubDomain[];
}

export interface Buyer {
  id?: number;
  commercial_registration_number: string;
  commercial_phone_number: string;
  industry: string;
  company_name: string;
  city: string;
  logo?: string | null;
  account_name: string;
  account_email: string;
  account_phone: string;
  account_password: string;
  licenses?: string | null;
  certificates?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface LoginRequest {
  account_email: string;
  account_password: string;
}

export interface LoginResponse {
  success: boolean;
  buyer?: {
    id: number;
    company_name: string;
    account_name: string;
    account_email: string;
    city: string;
    industry: string;
  };
  message?: string;
}

export interface Supplier {
  id?: number;
  commercial_registration_number: string;
  commercial_phone_number: string;
  industry: string;
  created_at?: string;
  city: string;
  updated_at?: string | null;
  logo?: string | null;
  account_name: string;
  account_email: string;
  account_phone: string;
  company_name: string;
  licenses?: string | null;
  certificates?: string | null;
  account_password: string;
}

export interface SupplierLoginRequest {
  account_email: string;
  account_password: string;
}

export interface SupplierLoginResponse {
  success: boolean;
  supplier?: {
    id: number;
    company_name: string;
    account_name: string;
    account_email: string;
    city: string;
    commercial_registration_number: string;
    commercial_phone_number: string;
    account_phone: string;
    domain: string;
    created_at: string;
  };
  message?: string;
}

export interface Inquiry {
  id?: number;
  tender_id: string;
  supplier_id?: number; // supplier ID is stored but not shown to other suppliers
  question_text: string;
  created_at?: string;
  answer_text?: string | null;
  answer_at?: string | null;
  buyer_name?: string | null;
}

// Database entity for tender (matches DB schema)
export interface TenderEntity {
  id?: number;
  buyer_id: number;
  reference_number?: number;
  title: string;
  domain_id: number;
  project_description?: string;
  city?: string;
  created_at?: string;
  submit_deadline?: string;
  quires_deadline?: string;
  contract_time?: string;
  previous_work?: string;
  evaluation_criteria?: string;
  used_technologies?: string;
  tender_coordinator?: string;
  coordinator_email?: string;
  coordinator_phone?: string;
  file1?: Blob | null;
  file2?: Blob | null;
  // Related data
  domain_name?: string;
  buyer_name?: string;
  buyer_company?: string;
  sub_domains?: SubDomain[];
}

// Required file interface for dynamic file requirements
export interface RequiredFile {
  id?: number;
  tender_id: number;
  file_type: 'technical' | 'financial' | 'legal' | 'experience';
  file_name: string;
  description: string;
  is_required: boolean;
  max_size_mb?: number;
  allowed_formats?: string;
}

// Frontend display interface (existing - for TenderCard component)
export interface Tender {
  id: string;
  title: string;
  company: string;
  category?: string;
  location?: string;
  budget?: string;
  publishDate: string;
  offerDeadline: string;
  inquiryDeadline: string;
  remainingDays: number;
  remainingInquiryDays: number;
  status: 'active' | 'expired' | 'awarded' | 'draft';
  description?: string;
  referenceNumber?: string;
  // Sub-domains this tender covers
  subDomains?: string[];
  // Dynamic file requirements
  requiredFiles?: RequiredFile[];
}
