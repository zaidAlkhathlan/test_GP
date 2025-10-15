import { RequestHandler } from "express";
import { db } from "../db";

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
    city_id: number;
    city_name: string;
    region_name: string;
    domains_id: number;
    domain_name: string;
  };
  message?: string;
}

export const loginBuyer: RequestHandler = (req, res) => {
  console.log("🔐 loginBuyer endpoint called");
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
  
  const { account_email, account_password }: LoginRequest = req.body;

  if (!account_email || !account_password) {
    console.log("❌ Missing email or password");
    return res.status(400).json({
      success: false,
      message: "البريد الإلكتروني وكلمة المرور مطلوبان"
    });
  }

  console.log("🔍 Searching for buyer with email:", account_email);

  db.get(`SELECT 
    b.*, 
    c.name as city_name, 
    r.name as region_name,
    d.Name as domain_name
  FROM Buyer b
  LEFT JOIN City c ON b.city_id = c.id
  LEFT JOIN Region r ON c.region_id = r.id
  LEFT JOIN domains d ON b.domains_id = d.ID
  WHERE b.Account_email = ?`, [account_email], (err: Error | null, row: any) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({
        success: false,
        message: "خطأ في الخادم"
      });
    }

    if (!row) {
      console.log("❌ No buyer found with email:", account_email);
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      });
    }

    console.log("✅ Found buyer:", row.company_name);

    // Check password (in production, you should hash passwords)
    if (row.Account_password !== account_password) {
      console.log("❌ Password mismatch");
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      });
    }

    console.log("✅ Password match - login successful");

    // Return buyer info without password - using normalized location data
    const buyerInfo = {
      id: row.ID,
      company_name: row.company_name,
      account_name: row.Account_name,
      account_email: row.Account_email,
      account_phone: row.Account_phone,
      commercial_registration_number: row.Commercial_registration_number,
      commercial_phone_number: row.Commercial_Phone_number,
      city_id: row.city_id,
      city_name: row.city_name || 'خطأ في تحميل المدينة',
      region_name: row.region_name || 'خطأ في تحميل المنطقة',
      domains_id: row.domains_id,
      domain_name: row.domain_name || 'خطأ في تحميل النشاط',
      logo: row.Logo,
      industry: row.industry,
      created_at: row.created_at
    };

    res.json({
      success: true,
      buyer: buyerInfo
    });
  });
};