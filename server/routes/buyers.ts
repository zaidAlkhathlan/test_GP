import { RequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { Buyer as BuyerPayload } from "@shared/api";

const buyerInclude = {
  city: {
    include: {
      region: true,
    },
  },
  domain: true,
};

const mapBuyerResponse = (buyer: Awaited<ReturnType<typeof prisma.buyer.findUnique>>) => {
  if (!buyer) {
    return null;
  }

  return {
    ID: buyer.id,
    company_name: buyer.companyName,
    Commercial_registration_number: buyer.commercialRegistrationNumber,
    Commercial_Phone_number: buyer.commercialPhoneNumber,
    domains_id: buyer.domainId,
    domain_name: buyer.domain?.name ?? null,
    city_id: buyer.cityId,
    city_name: buyer.city?.name ?? null,
    region_name: buyer.city?.region?.name ?? null,
    Account_name: buyer.accountName,
    Account_email: buyer.accountEmail,
    Account_phone: buyer.accountPhone,
    Logo: buyer.logo,
    industry: buyer.industry,
    description: buyer.description,
    created_at: buyer.createdAt?.toISOString?.() ?? buyer.createdAt,
    updated_at: buyer.updatedAt?.toISOString?.() ?? buyer.updatedAt,
  };
};

export const createBuyer: RequestHandler = async (req, res) => {
  try {
    const payload: BuyerPayload = req.body;

    const buyer = await prisma.buyer.create({
      data: {
        commercialRegistrationNumber: payload.commercial_registration_number,
        commercialPhoneNumber: payload.commercial_phone_number,
        domainId: payload.domains_id || 1,
        companyName: payload.company_name,
        cityId: payload.city_id || 1,
        logo: payload.logo ?? null,
        accountName: payload.account_name,
        accountEmail: payload.account_email,
        accountPhone: payload.account_phone,
        accountPassword: payload.account_password,
      },
      include: buyerInclude,
    });

    const response = mapBuyerResponse(buyer);
    if (response) {
      delete (response as any).Account_password;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error("❌ Database insert error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(400).json({ error: "Duplicate entry" });
    }

    res.status(500).json({ error: "Failed to create buyer" });
  }
};

export const updateBuyer: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (!numericId) {
    return res.status(400).json({ error: "Invalid buyer ID" });
  }

  const updateData = req.body as Partial<BuyerPayload>;

  const fieldMap: Record<string, keyof Prisma.BuyerUpdateInput> = {
    commercial_registration_number: "commercialRegistrationNumber",
    commercial_phone_number: "commercialPhoneNumber",
    domains_id: "domainId",
    company_name: "companyName",
    city_id: "cityId",
    logo: "logo",
    account_name: "accountName",
    account_email: "accountEmail",
    account_phone: "accountPhone",
    industry: "industry",
    description: "description",
  };

  const data: Prisma.BuyerUpdateInput = {};

  for (const [key, value] of Object.entries(updateData)) {
    const prismaField = fieldMap[key];
    if (prismaField) {
      (data as Record<string, unknown>)[prismaField] = value;
    }
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  data.updatedAt = new Date();

  try {
    const updatedBuyer = await prisma.buyer.update({
      where: { id: numericId },
      data,
      include: buyerInclude,
    });

    const response = mapBuyerResponse(updatedBuyer);
    if (!response) {
      return res.status(404).json({ error: "Buyer not found" });
    }

    delete (response as any).Account_password;
    res.json(response);
  } catch (error) {
    console.error("❌ Database update error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(400).json({ error: "Duplicate entry" });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "Buyer not found" });
    }

    res.status(500).json({ error: "Failed to update buyer" });
  }
};

export const getBuyerById: RequestHandler = async (req, res) => {
  const numericId = Number(req.params.id);

  if (!numericId) {
    return res.status(400).json({ error: "Invalid buyer ID" });
  }

  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id: numericId },
      include: buyerInclude,
    });

    if (!buyer) {
      return res.status(404).json({ error: "Buyer not found" });
    }

    const response = mapBuyerResponse(buyer);
    if (response) {
      delete (response as any).Account_password;
    }

    res.json(response);
  } catch (error) {
    console.error("❌ Error fetching buyer:", error);
    res.status(500).json({ error: "Failed to fetch buyer" });
  }
};
