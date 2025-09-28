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
    city: string;
    industry: string;
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

  db.get("SELECT * FROM Buyer WHERE account_email = ?", [account_email], (err: Error | null, row: any) => {
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
    if (row.account_password !== account_password) {
      console.log("❌ Password mismatch");
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      });
    }

    console.log("✅ Password match - login successful");

    // Return buyer info without password
    const buyerInfo = {
      id: row.id,
      company_name: row.company_name,
      account_name: row.account_name,
      account_email: row.account_email,
      city: row.city,
      industry: row.industry
    };

    res.json({
      success: true,
      buyer: buyerInfo
    });
  });
};