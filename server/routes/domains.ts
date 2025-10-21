import { RequestHandler } from "express";
import { prisma } from "../db";

export interface Domain {
  ID: number;
  Name: string;
}

export interface SubDomain {
  ID: number;
  domain_id: number;
  Name: string;
}

export interface DomainsResponse {
  domains: Domain[];
}

export interface SubDomainsResponse {
  subDomains: SubDomain[];
}

// Get all domains
export const getDomains: RequestHandler = async (_req, res) => {
  console.log('[Domains] GET /api/domains');
  try {
    const domains = await prisma.domain.findMany({
      orderBy: { name: "asc" },
    });

    const response: DomainsResponse = {
      domains: domains.map((domain) => ({
        ID: domain.id,
        Name: domain.name,
      })),
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching domains:", error);
    res.status(500).json({ error: "Failed to fetch domains" });
  }
};

// Get sub-domains by domain ID
export const getSubDomainsByDomain: RequestHandler = async (req, res) => {
  const domainId = Number(req.params.domainId);

  if (!domainId) {
    return res.status(400).json({ error: "Domain ID is required" });
  }

  try {
    const subDomains = await prisma.subDomain.findMany({
      where: { domainId },
      orderBy: { name: "asc" },
    });

    const response: SubDomainsResponse = {
      subDomains: subDomains.map((subDomain) => ({
        ID: subDomain.id,
        domain_id: subDomain.domainId,
        Name: subDomain.name,
      })),
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching sub-domains:", error);
    res.status(500).json({ error: "Failed to fetch sub-domains" });
  }
};

// Get all sub-domains (for multi-select usage)
export const getAllSubDomains: RequestHandler = async (_req, res) => {
  try {
    const subDomains = await prisma.subDomain.findMany({
      include: { domain: true },
      orderBy: [
        { domain: { name: "asc" } },
        { name: "asc" },
      ],
    });

    const response = {
      subDomains: subDomains.map((subDomain) => ({
        ID: subDomain.id,
        domain_id: subDomain.domainId,
        Name: subDomain.name,
        domain_name: subDomain.domain?.name ?? "",
      })),
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching all sub-domains:", error);
    res.status(500).json({ error: "Failed to fetch sub-domains" });
  }
};