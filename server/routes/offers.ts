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

export const submitOfferWithFiles: RequestHandler[] = [
  upload.any(),
  async (req: MulterRequest, res) => {
    try {
      const { tender_id, supplier_id, offer_value, additional_notes } = req.body;
      const files = (req.files as Express.Multer.File[]) ?? [];

      if (!tender_id || !supplier_id || !offer_value) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: tender_id, supplier_id, offer_value",
        });
      }

      const offer = await prisma.offer.create({
        data: {
          tenderId: Number(tender_id),
          supplierId: Number(supplier_id),
          offerValue: Number(offer_value),
          additionalNotes: additional_notes ?? "",
          status: "submitted",
        },
      });

      if (files.length > 0) {
        await prisma.offerFile.createMany({
          data: files.map((file) => ({
            offerId: offer.id,
            fileType: detectOfferFileType(file),
            fileName: file.originalname,
            fileData: file.buffer,
            fileSize: file.size,
            mimeType: file.mimetype,
          })),
        });
      }

      res.json({
        success: true,
        message: files.length
          ? "Offer and files submitted successfully"
          : "Offer submitted successfully",
        offer_id: offer.id,
        files_uploaded: files.length,
      });
    } catch (error) {
      console.error("Error in submitOfferWithFiles:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];

export const getOffersByTender: RequestHandler = async (req, res) => {
  const tenderId = Number(req.params.tenderId);

  try {
    const offers = await prisma.offer.findMany({
      where: { tenderId },
      include: {
        supplier: true,
      },
      orderBy: { submittedAt: "desc" },
    });

    res.json({
      success: true,
      data: offers.map((offer) => ({
        id: offer.id,
        tender_id: offer.tenderId,
        supplier_id: offer.supplierId,
        offer_value: offer.offerValue,
        additional_notes: offer.additionalNotes,
        status: offer.status,
        submitted_at: offer.submittedAt?.toISOString?.() ?? offer.submittedAt,
        company_name: offer.supplier?.companyName ?? null,
        contact_name: offer.supplier?.accountName ?? null,
      })),
    });
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching offers",
    });
  }
};

export const getOffersBySupplier: RequestHandler = async (req, res) => {
  const supplierId = Number(req.params.supplierId);

  try {
    const offers = await prisma.offer.findMany({
      where: { supplierId },
      include: {
        tender: {
          include: { buyer: true },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    res.json({
      success: true,
      data: offers.map((offer) => ({
        id: offer.id,
        tender_id: offer.tenderId,
        supplier_id: offer.supplierId,
        offer_value: offer.offerValue,
        additional_notes: offer.additionalNotes,
        status: offer.status,
        submitted_at: offer.submittedAt?.toISOString?.() ?? offer.submittedAt,
        tender_title: offer.tender?.title ?? null,
        reference_number: offer.tender?.referenceNumber ?? null,
        submit_deadline: offer.tender?.submitDeadline?.toISOString?.() ?? offer.tender?.submitDeadline,
        buyer_company: offer.tender?.buyer?.companyName ?? null,
      })),
    });
  } catch (error) {
    console.error("Error fetching supplier offers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching offers",
    });
  }
};

export const getOfferFiles: RequestHandler = async (req, res) => {
  const offerId = Number(req.params.offerId);

  try {
    const files = await prisma.offerFile.findMany({
      where: { offerId },
      orderBy: { uploadedAt: "desc" },
    });

    res.json({
      success: true,
      data: files.map((file) => ({
        id: file.id,
        file_type: file.fileType,
        file_name: file.fileName,
        file_size: file.fileSize,
        mime_type: file.mimeType,
        uploaded_at: file.uploadedAt?.toISOString?.() ?? file.uploadedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching offer files:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching files",
    });
  }
};

export const downloadOfferFile: RequestHandler = async (req, res) => {
  const fileId = Number(req.params.fileId);

  try {
    const file = await prisma.offerFile.findUnique({
      where: { id: fileId },
      select: {
        fileName: true,
        fileData: true,
        mimeType: true,
      },
    });

    if (!file || !file.fileData) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.setHeader("Content-Disposition", `attachment; filename="${file.fileName}"`);
    res.setHeader("Content-Type", file.mimeType ?? "application/octet-stream");
    res.send(file.fileData);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching file",
    });
  }
};

function detectOfferFileType(file: Express.Multer.File): string {
  const field = file.fieldname?.toLowerCase();
  const name = file.originalname?.toLowerCase();

  if (field.includes("technical") || name.includes("technical")) {
    return "technical";
  }
  if (field.includes("financial") || name.includes("financial")) {
    return "financial";
  }
  if (field.includes("company") || name.includes("company")) {
    return "company";
  }
  return "additional";
}
