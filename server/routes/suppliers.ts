import { RequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../db";

const supplierInclude = {
  city: {
    include: {
      region: true,
    },
  },
  domain: true,
  supplierSubDomains: {
    include: {
      subDomain: true,
    },
  },
  supplierLicenses: {
    include: {
      license: true,
    },
  },
  supplierCertificates: {
    include: {
      certificate: true,
    },
  },
};

const normalizeIds = (value: unknown): number[] => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "number") {
          return item;
        }
        if (typeof item === "string") {
          return Number(item);
        }
        if (typeof item === "object" && item !== null) {
          const maybeId = (item as { id?: number | string }).id;
          if (typeof maybeId === "number") {
            return maybeId;
          }
          if (typeof maybeId === "string") {
            return Number(maybeId);
          }
        }
        return NaN;
      })
      .filter((id) => Number.isFinite(id) && id > 0) as number[];
  }

  if (typeof value === "string" || typeof value === "number") {
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric > 0 ? [numeric] : [];
  }

  return [];
};

const mapSupplierResponse = (supplier: Awaited<ReturnType<typeof prisma.supplier.findUnique>>) => {
  if (!supplier) {
    return null;
  }

  return {
    supplier: {
      ID: supplier.id,
      company_name: supplier.companyName,
      Commercial_registration_number: supplier.commercialRegistrationNumber,
      Commercial_Phone_number: supplier.commercialPhoneNumber,
      domains_id: supplier.domainId,
      domain_name: supplier.domain?.name ?? null,
      city_id: supplier.cityId,
      city_name: supplier.city?.name ?? null,
      region_name: supplier.city?.region?.name ?? null,
      Account_name: supplier.accountName,
      Account_email: supplier.accountEmail,
      Account_phone: supplier.accountPhone,
      Logo: supplier.logo,
      industry: supplier.industry,
      description: supplier.description,
      created_at: supplier.createdAt?.toISOString?.() ?? supplier.createdAt,
      updated_at: supplier.updatedAt?.toISOString?.() ?? supplier.updatedAt,
    },
    subDomains:
      supplier.supplierSubDomains?.map((entry) => ({
        sub_domains_id: entry.subDomainId,
        Name: entry.name ?? entry.subDomain?.name ?? null,
      })) ?? [],
    licenses:
      supplier.supplierLicenses?.map((entry) => ({
        id: entry.licenseId,
        Name: entry.license?.name ?? entry.license?.nameEn ?? entry.license?.nameAr ?? null,
      })) ?? [],
    certificates:
      supplier.supplierCertificates?.map((entry) => ({
        id: entry.certificateId,
        Name: entry.certificate?.name ?? null,
      })) ?? [],
  };
};

export const createSupplier: RequestHandler = async (req, res) => {
  const {
    commercial_registration_number,
    commercial_phone_number,
    domains_id,
    city_id,
    logo,
    account_name,
    account_email,
    account_phone,
    company_name,
    account_password,
    sub_domains = [],
    licenses = [],
    certificates = [],
    industry,
    description,
  } = req.body;

  if (
    !commercial_registration_number ||
    !commercial_phone_number ||
    !domains_id ||
    !city_id ||
    !account_name ||
    !account_email ||
    !account_phone ||
    !company_name ||
    !account_password
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const subDomainIds = normalizeIds(sub_domains);
  const licenseIds = normalizeIds(licenses);
  const certificateIds = normalizeIds(certificates);

  try {
    const supplier = await prisma.$transaction(async (tx) => {
      const createdSupplier = await tx.supplier.create({
        data: {
          commercialRegistrationNumber: commercial_registration_number,
          commercialPhoneNumber: commercial_phone_number,
          domainId: Number(domains_id),
          cityId: Number(city_id),
          logo: logo ?? null,
          accountName: account_name,
          accountEmail: account_email,
          accountPhone: account_phone,
          companyName: company_name,
          accountPassword: account_password,
          industry: industry ?? null,
          description: description ?? null,
          licensesJson: JSON.stringify(licenseIds),
          certificatesJson: JSON.stringify(certificateIds),
        },
      });

      if (subDomainIds.length > 0) {
        const subDomains = await tx.subDomain.findMany({
          where: { id: { in: subDomainIds } },
          select: { id: true, name: true },
        });

        if (subDomains.length > 0) {
          await tx.supplierSubDomain.createMany({
            data: subDomains.map((subDomain) => ({
              supplierId: createdSupplier.id,
              subDomainId: subDomain.id,
              name: subDomain.name,
            })),
            skipDuplicates: true,
          });
        }
      }

      if (licenseIds.length > 0) {
        await tx.supplierLicense.createMany({
          data: licenseIds.map((licenseId) => ({
            supplierId: createdSupplier.id,
            licenseId,
          })),
          skipDuplicates: true,
        });
      }

      if (certificateIds.length > 0) {
        await tx.supplierCertificate.createMany({
          data: certificateIds.map((certificateId) => ({
            supplierId: createdSupplier.id,
            certificateId,
          })),
          skipDuplicates: true,
        });
      }

      return createdSupplier;
    });

    res.status(201).json({
      success: true,
      supplier: {
        id: supplier.id,
        account_name,
        company_name,
        account_email,
      },
    });
  } catch (error) {
    console.error("Error creating supplier:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(400).json({ error: "Duplicate entry" });
    }

    res.status(500).json({ error: "Failed to create supplier" });
  }
};

export const getSuppliers: RequestHandler = async (_req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: supplierInclude,
      orderBy: { createdAt: "desc" },
    });

    const mapped = suppliers
      .map((supplier) => mapSupplierResponse(supplier)?.supplier)
      .filter(Boolean);

    res.json({ suppliers: mapped });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "Failed to fetch suppliers" });
  }
};

export const getSupplierById: RequestHandler = async (req, res) => {
  const supplierId = Number(req.params.id);

  if (!supplierId) {
    return res.status(400).json({ error: "Invalid supplier ID" });
  }

  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
      include: supplierInclude,
    });

    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json(mapSupplierResponse(supplier));
  } catch (error) {
    console.error("Error fetching supplier:", error);
    res.status(500).json({ error: "Failed to fetch supplier" });
  }
};

export const updateSupplier: RequestHandler = async (req, res) => {
  const supplierId = Number(req.params.id);

  if (!supplierId) {
    return res.status(400).json({ error: "Invalid supplier ID" });
  }

  const updateData = req.body as Record<string, unknown>;

  const fieldMap: Record<string, keyof Prisma.SupplierUpdateInput> = {
    commercial_registration_number: "commercialRegistrationNumber",
    commercial_phone_number: "commercialPhoneNumber",
    domains_id: "domainId",
    city_id: "cityId",
    logo: "logo",
    account_name: "accountName",
    account_email: "accountEmail",
    account_phone: "accountPhone",
    company_name: "companyName",
    industry: "industry",
    description: "description",
  };

  const data: Prisma.SupplierUpdateInput = {};

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
    const supplier = await prisma.supplier.update({
      where: { id: supplierId },
      data,
      include: supplierInclude,
    });

    const response = mapSupplierResponse(supplier);
    if (!response) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.json(response.supplier);
  } catch (error) {
    console.error("❌ Database update error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(400).json({ error: "Duplicate entry" });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(500).json({ error: "Failed to update supplier" });
  }
};

export const deleteSupplier: RequestHandler = async (req, res) => {
  const supplierId = Number(req.params.id);

  if (!supplierId) {
    return res.status(400).json({ error: "Invalid supplier ID" });
  }

  try {
    await prisma.supplier.delete({ where: { id: supplierId } });
    res.json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Error deleting supplier:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(500).json({ error: "Failed to delete supplier" });
  }
};
