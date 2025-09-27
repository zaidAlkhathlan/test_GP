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
