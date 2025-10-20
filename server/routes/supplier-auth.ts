import { RequestHandler } from "express";
import { db } from "../db";

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
    industry: string;
  };
  message?: string;
}

export const createTestSupplier: RequestHandler = (req, res) => {
  console.log("🧪 Creating test supplier");
  
  const testSupplier = {
    commercial_registration_number: "1234567890",
    commercial_phone_number: "0501234567",
    industry: "تكنولوجيا المعلومات",
    city: "الرياض",
    logo: null,
    account_name: "أحمد محمد",
    account_email: "supplier@test.com",
    account_phone: "0501234567",
    company_name: "شركة التقنية المتقدمة",
    licenses: null,
    certificates: null,
    account_password: "123456"
  };

  const sql = `INSERT INTO Supplier (
    commercial_registration_number, 
    commercial_phone_number, 
    industry, 
    city, 
    logo, 
    account_name, 
    account_email, 
    account_phone, 
    company_name, 
    licenses, 
    certificates, 
    account_password
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    testSupplier.commercial_registration_number,
    testSupplier.commercial_phone_number,
    testSupplier.industry,
    testSupplier.city,
    testSupplier.logo,
    testSupplier.account_name,
    testSupplier.account_email,
    testSupplier.account_phone,
    testSupplier.company_name,
    testSupplier.licenses,
    testSupplier.certificates,
    testSupplier.account_password
  ];

  db.run(sql, values, function(err: Error | null) {
    if (err) {
      console.error("❌ Error creating test supplier:", err);
      return res.status(500).json({
        success: false,
        message: "خطأ في إنشاء المورد التجريبي"
      });
    }

    console.log("✅ Test supplier created with ID:", this.lastID);
    res.json({
      success: true,
      message: "تم إنشاء المورد التجريبي بنجاح",
      supplier: {
        id: this.lastID,
        ...testSupplier
      }
    });
  });
};

export const loginSupplier: RequestHandler = (req, res) => {
  console.log("🔐 loginSupplier endpoint called");
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
  
  const { account_email, account_password }: SupplierLoginRequest = req.body;

  if (!account_email || !account_password) {
    console.log("❌ Missing email or password");
    return res.status(400).json({
      success: false,
      message: "البريد الإلكتروني وكلمة المرور مطلوبان"
    });
  }

  console.log("🔍 Searching for supplier with email:", account_email);

  // Query supplier with city and region information
  db.get(`SELECT 
    s.*, 
    c.name as city_name, 
    r.name as region_name,
    d.Name as domain_name
  FROM Supplier s
  LEFT JOIN City c ON s.city_id = c.id
  LEFT JOIN Region r ON c.region_id = r.id
  LEFT JOIN domains d ON s.domains_id = d.ID
  WHERE s.Account_email = ?`, [account_email], (err: Error | null, row: any) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({
        success: false,
        message: "خطأ في الخادم"
      });
    }

    if (!row) {
      console.log("❌ No supplier found with email:", account_email);
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      });
    }

    console.log("✅ Found supplier:", row.company_name);

    // Check password (in production, you should hash passwords)
    if (row.Account_password !== account_password) {
      console.log("❌ Password mismatch");
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
      });
    }

    console.log("✅ Password match - login successful");

    // Return supplier info without password - using normalized location data
    const supplierInfo = {
      id: row.ID,
      company_name: row.company_name,
      account_name: row.Account_name,
      account_email: row.Account_email,
      city_id: row.city_id,
      city_name: row.city_name || 'خطأ في تحميل المدينة',
      region_name: row.region_name || 'خطأ في تحميل المنطقة',
      commercial_registration_number: row.Commercial_registration_number,
      commercial_phone_number: row.Commercial_Phone_number,
      account_phone: row.Account_phone,
      logo: row.Logo,
      industry: row.industry,
      domain: row.domain_name || 'خطأ في تحميل النشاط',
      created_at: row.created_at
    };

    res.json({
      success: true,
      supplier: supplierInfo
    });
  });
};