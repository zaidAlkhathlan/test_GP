import { RequestHandler } from "express";
import multer from "multer";
import { prisma } from "../db";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOC, DOCX, JPG, PNG files are allowed."));
    }
  },
});

interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}

export const submitProposalWithFiles: RequestHandler[] = [
  upload.any(),
  async (req: MulterRequest, res) => {
    try {
      const {
        tender_id,
        supplier_id,
        proposal_price,
        company_name,
        project_description,
        extra_description,
      } = req.body;

      const files = (req.files as Express.Multer.File[]) ?? [];

      if (!tender_id || !supplier_id || !proposal_price) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: tender_id, supplier_id, proposal_price",
        });
      }

      const fileData: Record<string, Buffer | null> = {
        financial_file: null,
        technical_file: null,
        company_file: null,
        extra_file: null,
      };

      for (const file of files) {
        if (file.fieldname in fileData) {
          fileData[file.fieldname] = file.buffer;
        }
      }

      const proposal = await prisma.proposal.create({
        data: {
          referenceNumber: Math.floor(100000 + Math.random() * 900000),
          proposalPrice: Number(proposal_price),
          companyName: company_name ?? null,
          projectDescription: project_description ?? null,
          financialFile: fileData.financial_file,
          technicalFile: fileData.technical_file,
          companyFile: fileData.company_file,
          extraFile: fileData.extra_file,
          extraDescription: extra_description ?? null,
          tenderId: Number(tender_id),
          supplierId: Number(supplier_id),
        },
      });

      res.json({
        success: true,
        message: "Proposal submitted successfully",
        proposalId: proposal.id,
        referenceNumber: proposal.referenceNumber,
      });
    } catch (error: any) {
      console.error("Error in submitProposalWithFiles:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];

export const getProposalsForTender: RequestHandler = async (req, res) => {
  const tenderId = Number(req.params.tenderId);

  try {
    const proposals = await prisma.proposal.findMany({
      where: { tenderId },
      include: {
        supplier: {
          include: {
            supplierLicenses: { include: { license: true } },
            supplierCertificates: { include: { certificate: true } },
            city: true,
            domain: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = proposals.map((proposal) => ({
      id: proposal.id,
      reference_number: proposal.referenceNumber,
      proposal_price: proposal.proposalPrice,
      created_at: proposal.createdAt?.toISOString?.() ?? proposal.createdAt,
      company_name: proposal.companyName,
      project_description: proposal.projectDescription,
      extra_description: proposal.extraDescription,
      tender_id: proposal.tenderId,
      supplier_id: proposal.supplierId,
      supplier_company_name: proposal.supplier?.companyName ?? null,
      supplier_email: proposal.supplier?.accountEmail ?? null,
      supplier_account_name: proposal.supplier?.accountName ?? null,
      supplier_commercial_record: proposal.supplier?.commercialRegistrationNumber ?? null,
      supplier_phone: proposal.supplier?.commercialPhoneNumber ?? null,
      supplier_account_phone: proposal.supplier?.accountPhone ?? null,
      supplier_city_id: proposal.supplier?.cityId ?? null,
      supplier_city: proposal.supplier?.city?.name ?? null,
      supplier_domain_name: proposal.supplier?.domain?.name ?? null,
      licenses:
        proposal.supplier?.supplierLicenses?.map((entry) =>
          entry.license?.name ?? entry.license?.nameEn ?? entry.license?.nameAr ?? ""
        ) ?? [],
      certificates:
        proposal.supplier?.supplierCertificates?.map((entry) => entry.certificate?.name ?? "") ?? [],
    }));

    res.json({ success: true, data: mapped });
  } catch (error) {
    console.error("Error in getProposalsForTender:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching proposals",
    });
  }
};

export const getProposalsBySupplier: RequestHandler = async (req, res) => {
  const supplierId = Number(req.params.supplierId);

  try {
    const proposals = await prisma.proposal.findMany({
      where: { supplierId },
      include: {
        tender: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: proposals.map((proposal) => ({
        id: proposal.id,
        reference_number: proposal.referenceNumber,
        proposal_price: proposal.proposalPrice,
        created_at: proposal.createdAt?.toISOString?.() ?? proposal.createdAt,
        company_name: proposal.companyName,
        project_description: proposal.projectDescription,
        tender_id: proposal.tenderId,
        tender_title: proposal.tender?.title ?? null,
        tender_reference_number: proposal.tender?.referenceNumber ?? null,
      })),
    });
  } catch (error) {
    console.error("Error in getProposalsBySupplier:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching proposals",
    });
  }
};

export const downloadProposalFile: RequestHandler = async (req, res) => {
  const proposalId = Number(req.params.proposalId);
  const fileType = req.params.fileType;

  const validFileTypes = ["financial_file", "technical_file", "company_file", "extra_file"] as const;
  if (!validFileTypes.includes(fileType as any)) {
    return res.status(400).json({
      success: false,
      message: "Invalid file type",
    });
  }

  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: {
        financialFile: true,
        technicalFile: true,
        companyFile: true,
        extraFile: true,
      },
    });

    if (!proposal || !proposal[convertFileKey(fileType)]) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileType}_${proposalId}"`
    );
    res.send(proposal[convertFileKey(fileType)]);
  } catch (error) {
    console.error("Error in downloadProposalFile:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching file",
    });
  }
};

export const getProposalDetails: RequestHandler = async (req, res) => {
  const proposalId = Number(req.params.proposalId);

  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        supplier: true,
        tender: true,
      },
    });

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: proposal.id,
        reference_number: proposal.referenceNumber,
        proposal_price: proposal.proposalPrice,
        company_name: proposal.companyName,
        project_description: proposal.projectDescription,
        extra_description: proposal.extraDescription,
        tender_id: proposal.tenderId,
        supplier_id: proposal.supplierId,
        supplier_company_name: proposal.supplier?.companyName ?? null,
        supplier_email: proposal.supplier?.accountEmail ?? null,
        tender_title: proposal.tender?.title ?? null,
        tender_reference_number: proposal.tender?.referenceNumber ?? null,
        files: {
          financial_file: !!proposal.financialFile,
          technical_file: !!proposal.technicalFile,
          company_file: !!proposal.companyFile,
          extra_file: !!proposal.extraFile,
        },
      },
    });
  } catch (error) {
    console.error("Error in getProposalDetails:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching proposal details",
    });
  }
};

function convertFileKey(fileType: string) {
  switch (fileType) {
    case "financial_file":
      return "financialFile" as const;
    case "technical_file":
      return "technicalFile" as const;
    case "company_file":
      return "companyFile" as const;
    case "extra_file":
      return "extraFile" as const;
    default:
      return "financialFile" as const;
  }
}
