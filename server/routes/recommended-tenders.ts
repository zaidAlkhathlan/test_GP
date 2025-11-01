import { RequestHandler } from "express";
import { prisma } from "../db";

const mapTenderForClient = (tender: any) => {
  if (!tender) return null;

  const submitDeadline = tender.submitDeadline ?? tender.submit_deadline ?? null;
  const quiresDeadline = tender.quiresDeadline ?? tender.quires_deadline ?? null;

  const toDateString = (d: any) => {
    if (!d) return null;
    try {
      return new Date(d).toISOString().split('T')[0];
    } catch (e) {
      return String(d);
    }
  };

  const daysUntil = (d: any) => {
    if (!d) return null;
    const diff = new Date(d).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return {
    id: String(tender.id),
    title: tender.title,
    company: tender.buyer?.companyName ?? tender.buyer?.accountName ?? null,
    category: tender.domain?.name ?? null,
    subDomains: tender.tenderSubDomains?.map((s: any) => s.subDomain?.name ?? null) ?? [],
    location: tender.city?.name ?? null,
    offerDeadline: toDateString(submitDeadline),
    inquiryDeadline: toDateString(quiresDeadline),
    remainingDays: daysUntil(submitDeadline),
    remainingInquiryDays: daysUntil(quiresDeadline),
    budget: tender.expectedBudget ? String(tender.expectedBudget) : null,
    referenceNumber: tender.referenceNumber ? String(tender.referenceNumber) : null,
    publishDate: tender.createdAt ? new Date(tender.createdAt).toISOString().split('T')[0] : null,
    status: tender.status?.name ?? null,
    description: tender.projectDescription ?? null,
  };
};

export const getRecommendedTenders: RequestHandler = async (req, res) => {
  const supplierId = Number(req.params.id);
  if (!supplierId) {
    return res.status(400).json({ error: 'Invalid supplier ID' });
  }

  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
      include: { supplierSubDomains: true },
    });

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const subDomainIds = (supplier.supplierSubDomains ?? []).map((s) => s.subDomainId).filter(Boolean);

    // If supplier has no sub-domains, we follow the user's instruction: do not return any recommended tenders
    if (!subDomainIds || subDomainIds.length === 0) {
      return res.json({ tenders: [] });
    }   

    // Find tenders that match supplier main domain AND at least one sub-domain
    const tenders = await prisma.tender.findMany({
      where: {
        domainId: supplier.domainId,
        tenderSubDomains: { some: { subDomainId: { in: subDomainIds } } },
        // only active tenders (statusId 1) - adjust if your statuses differ
        statusId: 1,
      },
      include: {
        domain: true,
        buyer: true,
        city: { include: { region: true } },
        status: true,
        tenderSubDomains: { include: { subDomain: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const mapped = tenders.map(mapTenderForClient).filter(Boolean);
    res.json({ tenders: mapped });
  } catch (error) {
    console.error('Error fetching recommended tenders:', error);
    res.status(500).json({ error: 'Failed to fetch recommended tenders' });
  }
};
