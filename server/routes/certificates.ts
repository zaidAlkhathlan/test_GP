import { RequestHandler } from "express";
import { prisma } from "../db";

export interface Certificate {
  id: number;
  code: string;
  name_ar: string;
  name_en: string;
  category?: string;
}

export const getAllCertificates: RequestHandler = async (_req, res) => {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: { name: "asc" },
    });

    const transformedCertificates: Certificate[] = certificates.map((certificate) => ({
      id: certificate.id,
      code: certificate.name,
      name_ar: certificate.name,
      name_en: certificate.name,
      category: "general",
    }));

    res.json(transformedCertificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ error: "Failed to fetch certificates" });
  }
};

export const getCertificateByCode: RequestHandler = async (req, res) => {
  const { code } = req.params;

  try {
    const numericId = Number(code);
    const certificate = await prisma.certificate.findFirst({
      where: {
        OR: [
          { name: code },
          ...(Number.isInteger(numericId) && !Number.isNaN(numericId)
            ? [{ id: numericId }]
            : []),
        ],
      },
    });

    if (!certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    const transformedCertificate: Certificate = {
      id: certificate.id,
      code: certificate.name,
      name_ar: certificate.name,
      name_en: certificate.name,
      category: "general",
    };

    res.json(transformedCertificate);
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).json({ error: "Failed to fetch certificate" });
  }
};
