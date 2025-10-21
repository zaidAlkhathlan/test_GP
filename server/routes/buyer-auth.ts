import { RequestHandler } from "express";
import { prisma } from "../db";

const buyerInclude = {
  city: {
    include: {
      region: true,
    },
  },
  domain: true,
};

export interface LoginRequest {
  account_email: string;
  account_password: string;
}

export const loginBuyer: RequestHandler = async (req, res) => {
  const { account_email, account_password }: LoginRequest = req.body;

  if (!account_email || !account_password) {
    return res.status(400).json({
      success: false,
      message: "البريد الإلكتروني وكلمة المرور مطلوبان",
    });
  }

  try {
    const buyer = await prisma.buyer.findUnique({
      where: { accountEmail: account_email },
      include: buyerInclude,
    });

    if (!buyer || buyer.accountPassword !== account_password) {
      return res.status(401).json({
        success: false,
        message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      });
    }

    const response = {
      id: buyer.id,
      company_name: buyer.companyName,
      account_name: buyer.accountName,
      account_email: buyer.accountEmail,
      account_phone: buyer.accountPhone,
      commercial_registration_number: buyer.commercialRegistrationNumber,
      commercial_phone_number: buyer.commercialPhoneNumber,
      city_id: buyer.cityId,
      city_name: buyer.city?.name ?? "خطأ في تحميل المدينة",
      region_name: buyer.city?.region?.name ?? "خطأ في تحميل المنطقة",
      domains_id: buyer.domainId,
      domain_name: buyer.domain?.name ?? "خطأ في تحميل النشاط",
      logo: buyer.logo,
      industry: buyer.industry,
      created_at: buyer.createdAt?.toISOString?.() ?? buyer.createdAt,
    };

    res.json({
      success: true,
      buyer: response,
    });
  } catch (error) {
    console.error("❌ Database error:", error);
    res.status(500).json({
      success: false,
      message: "خطأ في الخادم",
    });
  }
};
