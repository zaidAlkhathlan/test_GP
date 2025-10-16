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
  domains_id: number;
  company_name: string;
  city_id: number;
  city_name?: string; // Optional, for display purposes
  region_name?: string; // Optional, for display purposes
  logo?: string | null;
  account_name: string;
  account_email: string;
  account_phone: string;
  account_password: string;
  created_at?: string;
  updated_at?: string;
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
  domains_id: number;
  created_at?: string;
  city_id: number;
  city_name?: string; // Optional, for display purposes
  region_name?: string; // Optional, for display purposes
  updated_at?: string;
  logo?: string | null;
  account_name: string;
  account_email: string;
  account_phone: string;
  company_name: string;
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
  city_id?: number;
  created_at?: string;
  submit_deadline?: string;
  quires_deadline?: string;
  contract_time?: string;
  previous_work?: string;
  evaluation_criteria?: string;
  used_technologies?: string;
  tender_coordinator?: string;
  status_id?: number;
  status_name?: string;
  finished_at?: string;
  coordinator_email?: string;
  coordinator_phone?: string;
  expected_budget?: number;
  file1?: Blob | null;
  file2?: Blob | null;
  // Related data
  domain_name?: string;
  buyer_name?: string;
  buyer_company?: string;
  city_name?: string;
  region_name?: string;
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
  region?: string;
  // Numeric ids for robust filtering
  cityId?: number | null;
  regionId?: number | null;
  budget?: string;
  publishDate: string;
  offerDeadline: string;
  inquiryDeadline: string;
  remainingDays: number;
  remainingInquiryDays: number;
  status: 'active' | 'expired' | 'awarded' | 'draft';
  // Database status information
  status_id?: number;
  status_name?: string;
  description?: string;
  referenceNumber?: string;
  // Sub-domains this tender covers
  subDomains?: string[];
  // Numeric domain id and sub-domain ids for filtering
  domainId?: number | null;
  subDomainIds?: Array<number>;
  // Raw sub-domain objects when available
  rawSubDomains?: SubDomain[];
  // Dynamic file requirements
  requiredFiles?: RequiredFile[];
}
