import { RequestHandler } from "express";
import { db } from "../db";

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
export const getDomains: RequestHandler = (req, res) => {
  db.all("SELECT ID, Name FROM domains ORDER BY Name", [], (err, rows) => {
    if (err) {
      console.error("Error fetching domains:", err);
      return res.status(500).json({ error: "Failed to fetch domains" });
    }

    const response: DomainsResponse = {
      domains: rows as Domain[]
    };

    res.json(response);
  });
};

// Get sub-domains by domain ID
export const getSubDomainsByDomain: RequestHandler = (req, res) => {
  const domainId = req.params.domainId;

  if (!domainId) {
    return res.status(400).json({ error: "Domain ID is required" });
  }

  db.all(
    "SELECT ID, domain_id, Name FROM sub_domains WHERE domain_id = ? ORDER BY Name",
    [domainId],
    (err, rows) => {
      if (err) {
        console.error("Error fetching sub-domains:", err);
        return res.status(500).json({ error: "Failed to fetch sub-domains" });
      }

      const response: SubDomainsResponse = {
        subDomains: rows as SubDomain[]
      };

      res.json(response);
    }
  );
};

// Get all sub-domains (for multi-select usage)
export const getAllSubDomains: RequestHandler = (req, res) => {
  db.all(
    `SELECT sd.ID, sd.domain_id, sd.Name, d.Name as domain_name 
     FROM sub_domains sd 
     JOIN domains d ON sd.domain_id = d.ID 
     ORDER BY d.Name, sd.Name`,
    [],
    (err, rows) => {
      if (err) {
        console.error("Error fetching all sub-domains:", err);
        return res.status(500).json({ error: "Failed to fetch sub-domains" });
      }

      const response = {
        subDomains: rows as (SubDomain & { domain_name: string })[]
      };

      res.json(response);
    }
  );
};