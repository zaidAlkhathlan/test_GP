import { RequestHandler } from "express";
import { prisma } from "../db";

export interface License {
  id: number;
  code: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  created_at: string;
}

// Get all licenses
export const getLicenses: RequestHandler = async (_req, res) => {
  try {
    const licenses = await prisma.license.findMany({
      orderBy: { name: "asc" },
    });

    const transformedLicenses = licenses.map((license) => ({
      id: license.id,
      code: license.code ?? license.name ?? license.nameEn ?? String(license.id),
      name_ar: license.nameAr ?? license.name ?? license.nameEn ?? "",
      name_en: license.nameEn ?? license.name ?? license.nameAr ?? "",
      category: license.category ?? "general",
      description_ar: license.descriptionAr ?? null,
      description_en: license.descriptionEn ?? null,
    }));

    res.json(transformedLicenses);
  } catch (error) {
    console.error("Error fetching licenses:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
};

// Get license by code
export const getLicenseByCode: RequestHandler = async (req, res) => {
  const { code } = req.params;

  try {
    const numericId = Number(code);
    const license = await prisma.license.findFirst({
      where: {
        OR: [
          { code: code },
          { name: code },
          { nameEn: code },
          { nameAr: code },
          ...(Number.isInteger(numericId) && !Number.isNaN(numericId)
            ? [{ id: numericId }]
            : []),
        ],
      },
    });

    if (!license) {
      return res.status(404).json({ error: "الرخصة غير موجودة" });
    }

    const transformedLicense = {
      id: license.id,
      code: license.code ?? license.name ?? license.nameEn ?? String(license.id),
      name_ar: license.nameAr ?? license.name ?? license.nameEn ?? "",
      name_en: license.nameEn ?? license.name ?? license.nameAr ?? "",
      category: license.category ?? "general",
      description_ar: license.descriptionAr ?? null,
      description_en: license.descriptionEn ?? null,
    };

    res.json(transformedLicense);
  } catch (error) {
    console.error("Error fetching license:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
};