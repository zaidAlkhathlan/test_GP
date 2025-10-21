import { RequestHandler } from "express";
import { prisma } from "../db";

export const TENDER_STATUS = {
  OPEN: 1,
  AWARDING: 2,
  FINISHED: 3,
} as const;

export const STATUS_NAMES = {
  1: "OPEN",
  2: "AWARDING",
  3: "FINISHED",
} as const;

export const getTendersWithStatus: RequestHandler = async (_req, res) => {
  try {
    const tenders = await prisma.tender.findMany({
      include: {
        status: true,
        buyer: true,
        domain: true,
        city: {
          include: {
            region: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(
      tenders.map((tender) => ({
        id: tender.id,
        title: tender.title,
        status_id: tender.statusId,
        status_name: tender.status?.name ?? null,
        submit_deadline: tender.submitDeadline?.toISOString?.() ?? tender.submitDeadline,
        finished_at: tender.finishedAt?.toISOString?.() ?? tender.finishedAt,
        created_at: tender.createdAt?.toISOString?.() ?? tender.createdAt,
        buyer_id: tender.buyerId,
        expected_budget: tender.expectedBudget,
        city: tender.city?.name ?? null,
        region: tender.city?.region?.name ?? null,
        buyer_company_name: tender.buyer?.companyName ?? null,
        domain_name: tender.domain?.name ?? null,
      }))
    );
  } catch (error) {
    console.error("❌ Database error getting tenders with status:", error);
    res.status(500).json({
      error: "فشل في استرداد المناقصات",
      details: (error as Error).message,
    });
  }
};

export const runUpdateExpiredTenders = async (): Promise<number> => {
  const result = await prisma.tender.updateMany({
    where: {
      statusId: TENDER_STATUS.OPEN,
      submitDeadline: {
        lte: new Date(),
      },
    },
    data: {
      statusId: TENDER_STATUS.AWARDING,
    },
  });

  return result.count;
};

export const updateExpiredTenders: RequestHandler = async (_req, res) => {
  try {
    const updatedCount = await runUpdateExpiredTenders();
    res.json({
      success: true,
      message: `تم تحديث ${updatedCount} مناقصة منتهية الصلاحية`,
      updated_count: updatedCount,
    });
  } catch (error) {
    console.error("❌ Database error updating expired tenders:", error);
    res.status(500).json({
      error: "فشل في تحديث المناقصات المنتهية الصلاحية",
      details: (error as Error).message,
    });
  }
};

export const finishTender: RequestHandler = async (req, res) => {
  const tenderId = Number(req.params.id);

  if (!tenderId) {
    return res.status(400).json({ error: "معرف المناقصة مطلوب" });
  }

  try {
    const result = await prisma.tender.updateMany({
      where: { id: tenderId, statusId: TENDER_STATUS.AWARDING },
      data: {
        statusId: TENDER_STATUS.FINISHED,
        finishedAt: new Date(),
      },
    });

    if (result.count === 0) {
      return res.status(404).json({
        error: "المناقصة غير موجودة أو ليست في حالة التقييم",
      });
    }

    res.json({
      success: true,
      message: "تم إنهاء المناقصة بنجاح",
      tender_id: tenderId,
    });
  } catch (error) {
    console.error("❌ Database error finishing tender:", error);
    res.status(500).json({
      error: "فشل في إنهاء المناقصة",
      details: (error as Error).message,
    });
  }
};

export const getTenderStatusStats: RequestHandler = async (_req, res) => {
  try {
    const statuses = await prisma.status.findMany({
      orderBy: { id: "asc" },
      include: {
        _count: {
          select: { tenders: true },
        },
      },
    });

    res.json(
      statuses.map((status) => ({
        status_name: status.name,
        count: status._count.tenders,
      }))
    );
  } catch (error) {
    console.error("❌ Database error getting status statistics:", error);
    res.status(500).json({
      error: "فشل في استرداد إحصائيات المناقصات",
      details: (error as Error).message,
    });
  }
};

export const awardTender: RequestHandler = async (req, res) => {
  const tenderId = Number(req.params.tenderId);
  const { supplierId, proposalId } = req.body as { supplierId: number; proposalId: number };

  if (!tenderId || !supplierId || !proposalId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: tenderId, supplierId, proposalId",
    });
  }

  try {
    const updated = await prisma.tender.update({
      where: { id: tenderId },
      data: {
        statusId: TENDER_STATUS.FINISHED,
        winnerId: supplierId,
        finishedAt: new Date(),
      },
      include: {
        status: true,
        winner: true,
      },
    });

    res.json({
      success: true,
      message: "Tender successfully awarded",
      data: {
        tender: {
          id: updated.id,
          title: updated.title,
          status_id: updated.statusId,
          status_name: updated.status?.name ?? null,
          finished_at: updated.finishedAt?.toISOString?.() ?? updated.finishedAt,
          winner_company_name: updated.winner?.companyName ?? null,
        },
        awardedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Error awarding tender:", error);
    res.status(500).json({
      success: false,
      message: "Database error while awarding tender",
    });
  }
};

export const getAwardedSupplier: RequestHandler = async (req, res) => {
  const tenderId = Number(req.params.tenderId);

  if (!tenderId) {
    return res.status(400).json({
      success: false,
      message: "Invalid tender ID",
    });
  }

  try {
    const tender = await prisma.tender.findUnique({
      where: { id: tenderId, statusId: TENDER_STATUS.FINISHED },
      include: {
        domain: true,
        winner: {
          include: {
            city: {
              include: { region: true },
            },
          },
        },
      },
    });

    if (!tender || !tender.winner) {
      return res.status(404).json({
        success: false,
        message: "No awarded supplier found for this tender",
      });
    }

    res.json({
      success: true,
      data: {
        tender: {
          id: tender.id,
          title: tender.title,
          status_id: tender.statusId,
          finished_at: tender.finishedAt?.toISOString?.() ?? tender.finishedAt,
          domain_name: tender.domain?.name ?? null,
        },
        supplier: {
          id: tender.winner.id,
          company_name: tender.winner.companyName,
          commercial_register: tender.winner.commercialRegistrationNumber,
          phone: tender.winner.commercialPhoneNumber,
          email: tender.winner.accountEmail,
          contact_person: tender.winner.accountName,
          city_name: tender.winner.city?.name ?? null,
          region_name: tender.winner.city?.region?.name ?? null,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error fetching awarded supplier:", error);
    res.status(500).json({
      success: false,
      message: "Database error while fetching awarded supplier",
    });
  }
};

export const getTendersByStatus: RequestHandler = async (req, res) => {
  const statusId = Number(req.params.statusId);

  if (![TENDER_STATUS.OPEN, TENDER_STATUS.AWARDING, TENDER_STATUS.FINISHED].includes(statusId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status ID. Must be 1 (OPEN), 2 (AWARDING), or 3 (FINISHED)",
    });
  }

  try {
    const tenders = await prisma.tender.findMany({
      where: { statusId },
      include: {
        status: true,
        buyer: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: tenders.map((tender) => ({
        id: tender.id,
        title: tender.title,
        status_id: tender.statusId,
        status_name: tender.status?.name ?? null,
        submit_deadline: tender.submitDeadline?.toISOString?.() ?? tender.submitDeadline,
        finished_at: tender.finishedAt?.toISOString?.() ?? tender.finishedAt,
        created_at: tender.createdAt?.toISOString?.() ?? tender.createdAt,
        expected_budget: tender.expectedBudget,
        buyer_company_name: tender.buyer?.companyName ?? null,
      })),
      count: tenders.length,
      status: STATUS_NAMES[statusId as keyof typeof STATUS_NAMES],
    });
  } catch (error) {
    console.error("❌ Error fetching tenders by status:", error);
    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
};

export function getStatusName(statusId: number): string {
  return STATUS_NAMES[statusId as keyof typeof STATUS_NAMES] ?? "UNKNOWN";
}

export function canTransitionToStatus(currentStatus: number, newStatus: number): boolean {
  const validTransitions: Record<number, number[]> = {
    [TENDER_STATUS.OPEN]: [TENDER_STATUS.AWARDING],
    [TENDER_STATUS.AWARDING]: [TENDER_STATUS.FINISHED],
    [TENDER_STATUS.FINISHED]: [],
  };

  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}
