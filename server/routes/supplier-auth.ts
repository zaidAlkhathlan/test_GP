import { RequestHandler } from "express";
import { prisma } from "../db";

const supplierInclude = {
  city: {
    include: {
      region: true,
    },
  },
  domain: true,
};

export interface SupplierLoginRequest {
  account_email: string;
  account_password: string;
}

export const loginSupplier: RequestHandler = async (req, res) => {
  const { account_email, account_password }: SupplierLoginRequest = req.body;

  if (!account_email || !account_password) {
    return res.status(400).json({
      success: false,
      message: "البريد الإلكتروني وكلمة المرور مطلوبان",
    });
  }

  try {
    const supplier = await prisma.supplier.findUnique({
      where: { accountEmail: account_email },
      include: supplierInclude,
    });

    if (!supplier || supplier.accountPassword !== account_password) {
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    const response = {
      id: supplier.id,
      company_name: supplier.companyName,
      account_name: supplier.accountName,
      account_email: supplier.accountEmail,
      city_id: supplier.cityId,
      city_name: supplier.city?.name ?? "خطأ في تحميل المدينة",
      region_name: supplier.city?.region?.name ?? "خطأ في تحميل المنطقة",
      commercial_registration_number: supplier.commercialRegistrationNumber,
      commercial_phone_number: supplier.commercialPhoneNumber,
      account_phone: supplier.accountPhone,
      logo: supplier.logo,
      industry: supplier.industry,
      domain: supplier.domain?.name ?? "خطأ في تحميل النشاط",
      created_at: supplier.createdAt?.toISOString?.() ?? supplier.createdAt,
    };

    res.json({
      success: true,
      supplier: response,
    });
  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في الخادم",
    });
  }
};
