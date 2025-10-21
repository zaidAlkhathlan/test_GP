import { Request, RequestHandler } from "express";
import { prisma } from "../db";

interface MulterRequest extends Request {
  files?: { [fieldname: string]: Express.Multer.File[] };
}

const tenderBaseInclude = {
  domain: true,
  buyer: true,
  city: {
    include: {
      region: true,
    },
  },
  status: true,
  tenderSubDomains: {
    include: {
      subDomain: true,
    },
  },
};

const fullTenderInclude = {
  ...tenderBaseInclude,
  tenderLicenses: {
    include: { license: true },
  },
  tenderCertificates: {
    include: { certificate: true },
  },
  requiredFiles: true,
};

const mapTenderSummary = (tender: Awaited<ReturnType<typeof prisma.tender.findFirst>>) => {
  if (!tender) {
    return null;
  }

  return {
    id: tender.id,
    buyer_id: tender.buyerId,
    reference_number: tender.referenceNumber,
    title: tender.title,
    domain_id: tender.domainId,
    domain_name: tender.domain?.name ?? null,
    project_description: tender.projectDescription,
    city_id: tender.cityId,
    city_name: tender.city?.name ?? null,
    region_id: tender.city?.region?.id ?? null,
    region_name: tender.city?.region?.name ?? null,
    created_at: tender.createdAt?.toISOString?.() ?? tender.createdAt,
    submit_deadline: tender.submitDeadline?.toISOString?.() ?? tender.submitDeadline,
    quires_deadline: tender.quiresDeadline?.toISOString?.() ?? tender.quiresDeadline,
    contract_time: tender.contractTime,
    previous_work: tender.previousWork,
    evaluation_criteria: tender.evaluationCriteria,
    used_technologies: tender.usedTechnologies,
    tender_coordinator: tender.tenderCoordinator,
    coordinator_email: tender.coordinatorEmail,
    coordinator_phone: tender.coordinatorPhone,
    file1_name: tender.file1Name,
    file2_name: tender.file2Name,
    expected_budget: tender.expectedBudget,
    status_id: tender.statusId,
    status_name: tender.status?.name ?? null,
    buyer_name: tender.buyer?.accountName ?? null,
    buyer_company: tender.buyer?.companyName ?? null,
    sub_domains:
      tender.tenderSubDomains?.map((entry) => ({
        ID: entry.subDomainId,
        Name: entry.subDomain?.name ?? null,
      })) ?? [],
  };
};

export const getTenders: RequestHandler = async (req, res) => {
  const buyerId = req.query.buyer_id ? Number(req.query.buyer_id) : undefined;
  const submitFrom = req.query.submit_from as string | undefined;
  const submitTo = req.query.submit_to as string | undefined;
  const expectedMin = req.query.expected_min ? Number(req.query.expected_min) : undefined;
  const expectedMax = req.query.expected_max ? Number(req.query.expected_max) : undefined;

  const where: Parameters<typeof prisma.tender.findMany>[0]["where"] = {};

  if (buyerId) {
    where.buyerId = buyerId;
  }

  if (submitFrom || submitTo) {
    where.submitDeadline = {};
    if (submitFrom) {
      (where.submitDeadline as any).gte = new Date(`${submitFrom}T00:00:00`);
    }
    if (submitTo) {
      (where.submitDeadline as any).lte = new Date(`${submitTo}T23:59:59`);
    }
  }

  if (expectedMin !== undefined || expectedMax !== undefined) {
    where.expectedBudget = {};
    if (expectedMin !== undefined) {
      (where.expectedBudget as any).gte = expectedMin;
    }
    if (expectedMax !== undefined) {
      (where.expectedBudget as any).lte = expectedMax;
    }
  }

  try {
    const tenders = await prisma.tender.findMany({
      where,
      include: tenderBaseInclude,
      orderBy: { createdAt: "desc" },
    });

    const mapped = tenders.map(mapTenderSummary).filter(Boolean);

    res.json({ tenders: mapped });
  } catch (error) {
    console.error("Error fetching tenders:", error);
    res.status(500).json({ error: "Failed to fetch tenders" });
  }
};

export const getTenderById: RequestHandler = async (req, res) => {
  const tenderId = Number(req.params.id);

  try {
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      include: fullTenderInclude,
    });

    if (!tender) {
      return res.status(404).json({ error: "Tender not found" });
    }

    const mapped = mapTenderSummary(tender);
    const licenses = tender.tenderLicenses?.map((entry) => ({
      ID: entry.licenseId,
      Name:
        entry.license?.name ?? entry.license?.nameEn ?? entry.license?.nameAr ?? null,
    }));
    const certificates = tender.tenderCertificates?.map((entry) => ({
      ID: entry.certificateId,
      Name: entry.certificate?.name ?? null,
    }));

    res.json({
      tender: {
        ...mapped,
        description: tender.projectDescription ?? null,
        contactInfo: {
          email: tender.coordinatorEmail ?? null,
          phone: tender.coordinatorPhone ?? null,
          address: tender.city?.name ? `${tender.city.name}, المملكة العربية السعودية` : null,
        },
        documents: [
          tender.file1Name
            ? {
                name: tender.file1Name,
                url: `/api/tenders/${tender.id}/file1`,
                size: "متاح للتنزيل",
              }
            : null,
          tender.file2Name
            ? {
                name: tender.file2Name,
                url: `/api/tenders/${tender.id}/file2`,
                size: "متاح للتنزيل",
              }
            : null,
        ].filter(Boolean),
      },
      subDomains: mapped?.sub_domains ?? [],
      licenses: licenses ?? [],
      certificates: certificates ?? [],
      requiredFiles: tender.requiredFiles ?? [],
      requiredLicenses: licenses ?? [],
      requiredCertificates: certificates ?? [],
    });
  } catch (error) {
    console.error("Error fetching tender:", error);
    res.status(500).json({ error: "Failed to fetch tender" });
  }
};

export const createTender: RequestHandler = async (req, res) => {
  const {
    buyer_id,
    title,
    domain_id,
    sub_domain_ids,
    project_description,
    city_id,
    submit_deadline,
    quires_deadline,
    contract_time,
    previous_work,
    evaluation_criteria,
    used_technologies,
    tender_coordinator,
    coordinator_email,
    coordinator_phone,
    expected_budget,
    required_licenses,
    required_certificates,
    required_files,
  } = req.body;

  let parsedSubDomainIds: number[] = [];
  try {
    parsedSubDomainIds = Array.isArray(sub_domain_ids)
      ? sub_domain_ids.map((value: string | number) => Number(value))
      : sub_domain_ids
      ? JSON.parse(sub_domain_ids).map((id: string | number) => Number(id))
      : [];
  } catch (error) {
    return res.status(400).json({ error: "Invalid sub_domain_ids format" });
  }
  parsedSubDomainIds = parsedSubDomainIds.filter((id) => Number.isFinite(id));

  const parseStringArray = (value: unknown): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value.map((item) => String(item));
    try {
      return JSON.parse(String(value));
    } catch (error) {
      return [];
    }
  };

  const parsedRequiredLicenses = parseStringArray(required_licenses);
  const parsedRequiredCertificates = parseStringArray(required_certificates);

  let parsedRequiredFiles: any[] = [];
  if (required_files) {
    try {
      parsedRequiredFiles = Array.isArray(required_files)
        ? required_files
        : JSON.parse(required_files);
    } catch (error) {
      parsedRequiredFiles = [];
    }
  }

  const files = (req as MulterRequest).files;
  const file1Data = files?.file1?.[0]?.buffer ?? null;
  const file2Data = files?.file2?.[0]?.buffer ?? null;
  const file1Name = files?.file1?.[0]?.originalname ?? null;
  const file2Name = files?.file2?.[0]?.originalname ?? null;

  if (!buyer_id || !title || !domain_id || parsedSubDomainIds.length === 0) {
    return res.status(400).json({
      error: "Missing required fields: buyer_id, title, domain_id, sub_domain_ids",
    });
  }

  try {
    const { _max } = await prisma.tender.aggregate({
      _max: { referenceNumber: true },
    });
    const nextRefNumber = (_max.referenceNumber ?? 1000) + 1;

    const tender = await prisma.$transaction(async (tx) => {
      const createdTender = await tx.tender.create({
        data: {
          buyerId: Number(buyer_id),
          referenceNumber: nextRefNumber,
          title,
          domainId: Number(domain_id),
          projectDescription: project_description ?? null,
          cityId: city_id ? Number(city_id) : null,
          submitDeadline: submit_deadline ? new Date(submit_deadline) : null,
          quiresDeadline: quires_deadline ? new Date(quires_deadline) : null,
          contractTime: contract_time ?? null,
          previousWork: previous_work ?? null,
          evaluationCriteria: evaluation_criteria ?? null,
          usedTechnologies: used_technologies ?? null,
          tenderCoordinator: tender_coordinator ?? null,
          coordinatorEmail: coordinator_email ?? null,
          coordinatorPhone: coordinator_phone ?? null,
          file1: file1Data,
          file2: file2Data,
          file1Name,
          file2Name,
          expectedBudget: expected_budget ? Number(expected_budget) : null,
          statusId: 1,
        },
      });

      if (parsedSubDomainIds.length > 0) {
        await tx.tenderSubDomain.createMany({
          data: parsedSubDomainIds.map((subDomainId) => ({
            tenderId: createdTender.id,
            subDomainId,
          })),
          skipDuplicates: true,
        });
      }

      if (parsedRequiredLicenses.length > 0) {
        const licenses = await tx.license.findMany({
          where: {
            OR: [
              { code: { in: parsedRequiredLicenses } },
              { name: { in: parsedRequiredLicenses } },
              { nameEn: { in: parsedRequiredLicenses } },
              { nameAr: { in: parsedRequiredLicenses } },
            ],
          },
        });

        await tx.tenderLicense.createMany({
          data: licenses.map((license) => ({
            tenderId: createdTender.id,
            licenseId: license.id,
          })),
          skipDuplicates: true,
        });
      }

      if (parsedRequiredCertificates.length > 0) {
        const certificates = await tx.certificate.findMany({
          where: {
            name: { in: parsedRequiredCertificates },
          },
        });

        await tx.tenderCertificate.createMany({
          data: certificates.map((certificate) => ({
            tenderId: createdTender.id,
            certificateId: certificate.id,
          })),
          skipDuplicates: true,
        });
      }

      if (parsedRequiredFiles.length > 0) {
        await tx.tenderRequiredFile.createMany({
          data: parsedRequiredFiles.map((fileReq) => ({
            tenderId: createdTender.id,
            fileType: fileReq.file_type ?? fileReq.type ?? "additional",
            fileName: fileReq.file_name ?? fileReq.name ?? "",
            description: fileReq.description ?? "",
            isRequired: fileReq.is_required !== false,
            maxSizeMb: fileReq.max_size_mb ?? 10,
            allowedFormats: fileReq.allowed_formats ?? "PDF,DOC,DOCX,JPG,PNG",
          })),
        });
      }

      return createdTender;
    });

    res.status(201).json({
      success: true,
      tender: {
        id: tender.id,
        reference_number: tender.referenceNumber,
        title,
        message: "Tender created successfully",
      },
    });
  } catch (error) {
    console.error("Error inserting tender:", error);
    res.status(500).json({ error: "Failed to create tender" });
  }
};

export const updateTender: RequestHandler = async (req, res) => {
  const tenderId = Number(req.params.id);
  const tender = req.body as Partial<ReturnType<typeof mapTenderSummary>>;

  try {
    const updatedTender = await prisma.tender.update({
      where: { id: tenderId },
      data: {
        title: tender.title ?? undefined,
        domainId: tender.domain_id ?? undefined,
        projectDescription: tender.project_description ?? undefined,
        cityId: tender.city_id ?? undefined,
        submitDeadline: tender.submit_deadline ? new Date(tender.submit_deadline) : undefined,
        quiresDeadline: tender.quires_deadline ? new Date(tender.quires_deadline) : undefined,
        contractTime: tender.contract_time ?? undefined,
        previousWork: tender.previous_work ?? undefined,
        evaluationCriteria: tender.evaluation_criteria ?? undefined,
        usedTechnologies: tender.used_technologies ?? undefined,
        tenderCoordinator: tender.tender_coordinator ?? undefined,
        coordinatorEmail: tender.coordinator_email ?? undefined,
        coordinatorPhone: tender.coordinator_phone ?? undefined,
      },
      include: tenderBaseInclude,
    });

    res.json(mapTenderSummary(updatedTender));
  } catch (error) {
    console.error("❌ Error updating tender:", error);
    res.status(500).json({ error: "Failed to update tender" });
  }
};

export const deleteTender: RequestHandler = async (req, res) => {
  const tenderId = Number(req.params.id);

  try {
    await prisma.tender.delete({ where: { id: tenderId } });
    res.json({ success: true, message: "Tender deleted successfully" });
  } catch (error) {
    console.error("Error deleting tender:", error);
    res.status(500).json({ error: "Failed to delete tender" });
  }
};

export const getTendersByDomain: RequestHandler = async (req, res) => {
  const domainId = Number(req.params.domainId);

  try {
    const tenders = await prisma.tender.findMany({
      where: { domainId },
      include: tenderBaseInclude,
      orderBy: { createdAt: "desc" },
    });

    const mapped = tenders.map(mapTenderSummary).filter(Boolean);
    res.json({ tenders: mapped });
  } catch (error) {
    console.error("Error fetching tenders by domain:", error);
    res.status(500).json({ error: "Failed to fetch tenders" });
  }
};

export const downloadTenderFile1: RequestHandler = async (req, res) => {
  const tenderId = Number(req.params.id);

  try {
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      select: { file1: true, file1Name: true },
    });

    if (!tender?.file1) {
      return res.status(404).json({ error: "File not found" });
    }

    const filename = tender.file1Name ?? `tender_${tenderId}_file1`;
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(tender.file1);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Failed to fetch file" });
  }
};

export const downloadTenderFile2: RequestHandler = async (req, res) => {
  const tenderId = Number(req.params.id);

  try {
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId },
      select: { file2: true, file2Name: true },
    });

    if (!tender?.file2) {
      return res.status(404).json({ error: "File not found" });
    }

    const filename = tender.file2Name ?? `tender_${tenderId}_file2`;
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(tender.file2);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: "Failed to fetch file" });
  }
};
