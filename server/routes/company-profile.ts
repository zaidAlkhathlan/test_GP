import { RequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../db";

export const getBuyerLicenses: RequestHandler = async (req, res) => {
  const buyerId = Number(req.params.id);

  try {
    const licenses = await prisma.buyerLicense.findMany({
      where: { buyerId },
      include: { license: true },
    });

    res.json(
      licenses.map((entry) => ({
        id: entry.licenseId,
        name: entry.license?.name ?? entry.license?.nameEn ?? entry.license?.nameAr ?? null,
        name_ar: entry.license?.nameAr ?? entry.license?.name ?? entry.license?.nameEn ?? null,
        name_en: entry.license?.nameEn ?? entry.license?.name ?? entry.license?.nameAr ?? null,
        description_ar: entry.license?.descriptionAr ?? null,
        description_en: entry.license?.descriptionEn ?? null,
        category: entry.license?.category ?? null,
        code: entry.license?.code ?? entry.license?.name ?? undefined,
      }))
    );
  } catch (error) {
    console.error("❌ Error fetching buyer licenses:", error);
    res.status(500).json({ error: "Failed to fetch buyer licenses" });
  }
};

export const getBuyerCertificates: RequestHandler = async (req, res) => {
  const buyerId = Number(req.params.id);

  try {
    const certificates = await prisma.buyerCertificate.findMany({
      where: { buyerId },
      include: { certificate: true },
    });

    res.json(
      certificates.map((entry) => ({
        id: entry.certificateId,
        name: entry.certificate?.name ?? null,
      }))
    );
  } catch (error) {
    console.error("❌ Error fetching buyer certificates:", error);
    res.status(500).json({ error: "Failed to fetch buyer certificates" });
  }
};

export const getSupplierLicenses: RequestHandler = async (req, res) => {
  const supplierId = Number(req.params.id);

  try {
    const licenses = await prisma.supplierLicense.findMany({
      where: { supplierId },
      include: { license: true },
    });

    res.json(
      licenses.map((entry) => ({
        id: entry.licenseId,
        name: entry.license?.name ?? entry.license?.nameEn ?? entry.license?.nameAr ?? null,
        name_ar: entry.license?.nameAr ?? entry.license?.name ?? entry.license?.nameEn ?? null,
        name_en: entry.license?.nameEn ?? entry.license?.name ?? entry.license?.nameAr ?? null,
        description_ar: entry.license?.descriptionAr ?? null,
        description_en: entry.license?.descriptionEn ?? null,
        category: entry.license?.category ?? null,
        code: entry.license?.code ?? entry.license?.name ?? undefined,
      }))
    );
  } catch (error) {
    console.error("❌ Error fetching supplier licenses:", error);
    res.status(500).json({ error: "Failed to fetch supplier licenses" });
  }
};

export const getSupplierCertificates: RequestHandler = async (req, res) => {
  const supplierId = Number(req.params.id);

  try {
    const certificates = await prisma.supplierCertificate.findMany({
      where: { supplierId },
      include: { certificate: true },
    });

    res.json(
      certificates.map((entry) => ({
        id: entry.certificateId,
        name: entry.certificate?.name ?? null,
      }))
    );
  } catch (error) {
    console.error("❌ Error fetching supplier certificates:", error);
    res.status(500).json({ error: "Failed to fetch supplier certificates" });
  }
};

export const addBuyerLicense: RequestHandler = async (req, res) => {
  const buyerId = Number(req.params.id);
  const { licenseId } = req.body as { licenseId: number };

  if (!licenseId) {
    return res.status(400).json({ error: "License ID is required" });
  }

  try {
    await prisma.buyerLicense.create({
      data: {
        buyerId,
        licenseId,
      },
    });

    res.json({ success: true, message: "License added successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({ error: "License already added to this buyer" });
    }

    console.error("❌ Error adding buyer license:", error);
    res.status(500).json({ error: "Failed to add license" });
  }
};

export const removeBuyerLicense: RequestHandler = async (req, res) => {
  const buyerId = Number(req.params.id);
  const licenseId = Number(req.params.licenseId);

  try {
    await prisma.buyerLicense.delete({
      where: {
        buyerId_licenseId: {
          buyerId,
          licenseId,
        },
      },
    });

    res.json({ success: true, message: "License removed successfully" });
  } catch (error) {
    console.error("❌ Error removing buyer license:", error);
    res.status(500).json({ error: "Failed to remove license" });
  }
};

export const addBuyerCertificate: RequestHandler = async (req, res) => {
  const buyerId = Number(req.params.id);
  const { certificateId } = req.body as { certificateId: number };

  if (!certificateId) {
    return res.status(400).json({ error: "Certificate ID is required" });
  }

  try {
    await prisma.buyerCertificate.create({
      data: {
        buyerId,
        certificateId,
      },
    });

    res.json({ success: true, message: "Certificate added successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({ error: "Certificate already added to this buyer" });
    }

    console.error("❌ Error adding buyer certificate:", error);
    res.status(500).json({ error: "Failed to add certificate" });
  }
};

export const removeBuyerCertificate: RequestHandler = async (req, res) => {
  const buyerId = Number(req.params.id);
  const certificateId = Number(req.params.certificateId);

  try {
    await prisma.buyerCertificate.delete({
      where: {
        buyerId_certificateId: {
          buyerId,
          certificateId,
        },
      },
    });

    res.json({ success: true, message: "Certificate removed successfully" });
  } catch (error) {
    console.error("❌ Error removing buyer certificate:", error);
    res.status(500).json({ error: "Failed to remove certificate" });
  }
};

export const addSupplierLicense: RequestHandler = async (req, res) => {
  const supplierId = Number(req.params.id);
  const { licenseId } = req.body as { licenseId: number };

  if (!licenseId) {
    return res.status(400).json({ error: "License ID is required" });
  }

  try {
    await prisma.supplierLicense.create({
      data: {
        supplierId,
        licenseId,
      },
    });

    res.json({ success: true, message: "License added successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({ error: "License already added to this supplier" });
    }

    console.error("❌ Error adding supplier license:", error);
    res.status(500).json({ error: "Failed to add license" });
  }
};

export const removeSupplierLicense: RequestHandler = async (req, res) => {
  const supplierId = Number(req.params.id);
  const licenseId = Number(req.params.licenseId);

  try {
    await prisma.supplierLicense.delete({
      where: {
        supplierId_licenseId: {
          supplierId,
          licenseId,
        },
      },
    });

    res.json({ success: true, message: "License removed successfully" });
  } catch (error) {
    console.error("❌ Error removing supplier license:", error);
    res.status(500).json({ error: "Failed to remove license" });
  }
};

export const addSupplierCertificate: RequestHandler = async (req, res) => {
  const supplierId = Number(req.params.id);
  const { certificateId } = req.body as { certificateId: number };

  if (!certificateId) {
    return res.status(400).json({ error: "Certificate ID is required" });
  }

  try {
    await prisma.supplierCertificate.create({
      data: {
        supplierId,
        certificateId,
      },
    });

    res.json({ success: true, message: "Certificate added successfully" });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({ error: "Certificate already added to this supplier" });
    }

    console.error("❌ Error adding supplier certificate:", error);
    res.status(500).json({ error: "Failed to add certificate" });
  }
};

export const removeSupplierCertificate: RequestHandler = async (req, res) => {
  const supplierId = Number(req.params.id);
  const certificateId = Number(req.params.certificateId);

  try {
    await prisma.supplierCertificate.delete({
      where: {
        supplierId_certificateId: {
          supplierId,
          certificateId,
        },
      },
    });

    res.json({ success: true, message: "Certificate removed successfully" });
  } catch (error) {
    console.error("❌ Error removing supplier certificate:", error);
    res.status(500).json({ error: "Failed to remove certificate" });
  }
};

export const getAllAvailableLicenses: RequestHandler = async (_req, res) => {
  try {
    const licenses = await prisma.license.findMany({ orderBy: { name: "asc" } });

    res.json(
      licenses.map((license) => ({
        id: license.id,
        name: license.name ?? license.nameEn ?? license.nameAr ?? String(license.id),
        name_ar: license.nameAr ?? license.name ?? license.nameEn ?? null,
        name_en: license.nameEn ?? license.name ?? license.nameAr ?? null,
        category: license.category ?? null,
        code: license.code ?? license.name ?? undefined,
      }))
    );
  } catch (error) {
    console.error("❌ Error fetching licenses:", error);
    res.status(500).json({ error: "Failed to fetch licenses" });
  }
};

export const getAllAvailableCertificates: RequestHandler = async (_req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({ orderBy: { name: "asc" } });

    res.json(
      certificates.map((certificate) => ({
        id: certificate.id,
        name: certificate.name,
      }))
    );
  } catch (error) {
    console.error("❌ Error fetching certificates:", error);
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
};
