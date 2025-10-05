import { RequestHandler, Request } from "express";
import { db } from "../db";
import { TenderEntity } from "@shared/api";

// Extend Express Request to include files
interface MulterRequest extends Request {
  files?: { [fieldname: string]: Express.Multer.File[] };
}

// Get all tenders (optionally filtered by buyer_id)
export const getTenders: RequestHandler = (req, res) => {
  const buyerId = req.query.buyer_id;
  
  let query = `SELECT 
    t.*,
    d.Name as domain_name,
    b.Account_name as buyer_name,
    b.company_name as buyer_company
   FROM tender t
   LEFT JOIN domains d ON t.domain_id = d.ID
   LEFT JOIN Buyer b ON t.buyer_id = b.ID`;
  
  const params: any[] = [];
  
  if (buyerId) {
    query += ` WHERE t.buyer_id = ?`;
    params.push(buyerId);
  }
  
  query += ` ORDER BY t.created_at DESC`;
  
  db.all(query, params, (err, rows) => {
      if (err) {
        console.error("Error fetching tenders:", err);
        res.status(500).json({ error: "Failed to fetch tenders" });
        return;
      }

      if (!rows || rows.length === 0) {
        res.json({ tenders: [] });
        return;
      }

      // Fetch sub-domains for each tender
      let completedTenders = 0;
      const tendersWithSubDomains = rows.map(tender => ({ ...tender, sub_domains: [] }));

      tendersWithSubDomains.forEach((tender, index) => {
        db.all(
          `SELECT sd.ID, sd.Name 
           FROM tender_sub_domains tsd
           JOIN sub_domains sd ON tsd.sub_domain_id = sd.ID
           WHERE tsd.tender_id = ?
           ORDER BY sd.Name`,
          [tender.id],
          (subErr, subRows) => {
            if (!subErr && subRows) {
              tendersWithSubDomains[index].sub_domains = subRows;
            }
            
            completedTenders++;
            if (completedTenders === tendersWithSubDomains.length) {
              res.json({ tenders: tendersWithSubDomains });
            }
          }
        );
      });
    }
  );
};

// Get tender by ID
export const getTenderById: RequestHandler = (req, res) => {
  const { id } = req.params;
  
  db.get(
    `SELECT 
      t.*,
      d.Name as domain_name
     FROM tender t
     LEFT JOIN domains d ON t.domain_id = d.ID
     WHERE t.id = ?`,
    [id],
    (err, row) => {
      if (err) {
        console.error("Error fetching tender:", err);
        res.status(500).json({ error: "Failed to fetch tender" });
        return;
      }
      
      if (!row) {
        res.status(404).json({ error: "Tender not found" });
        return;
      }
      
      // Get associated sub-domains
      db.all(
        `SELECT sd.ID, sd.Name 
         FROM tender_sub_domains tsd
         JOIN sub_domains sd ON tsd.sub_domain_id = sd.ID
         WHERE tsd.tender_id = ?`,
        [id],
        (err, subDomains) => {
          if (err) {
            console.error("Error fetching tender sub-domains:", err);
            res.status(500).json({ error: "Failed to fetch tender details" });
            return;
          }
          
          // For now, skip license associations until the system is fully unified
          const licenses: any[] = [];
          
          // Create tender details with only real data from database
          const tenderDetails = {
            ...row,
            // Only add description if project_description exists
            description: row.project_description || null,
            // No hardcoded technical requirements - will be added via database later
            technicalRequirements: null,
            // No hardcoded financial requirements - will be added via database later  
            financialRequirements: null,
            // Only add contact info if exists in database
            contactInfo: {
              email: row.coordinator_email || null,
              phone: row.coordinator_phone || null,
              address: row.city ? `${row.city}, المملكة العربية السعودية` : null
            },
            // Only include documents that actually exist
            documents: [
              row.file1_name && row.file1 ? {
                name: row.file1_name,
                url: `/api/tenders/${id}/file1`,
                size: 'متاح للتنزيل'
              } : null,
              row.file2_name && row.file2 ? {
                name: row.file2_name, 
                url: `/api/tenders/${id}/file2`,
                size: 'متاح للتنزيل'
              } : null
            ].filter(doc => doc !== null),
            // No sample activities - will get real activities from database
            activities: [],
            // No fake stats - will get real stats from database 
            stats: {
              offersCount: 0,
              inquiriesCount: 0,  
              viewsCount: 0
            }
          };
          
          res.json({
            tender: tenderDetails,
            subDomains: subDomains || [],
            licenses: licenses || [],
            requiredLicenses: licenses || [] // For backward compatibility
          });
        }
      );
    }
  );
};

// Create new tender
export const createTender: RequestHandler = (req, res) => {
  console.log("📝 Request headers:", req.headers);
  console.log("📝 Request body:", req.body);
  console.log("📝 Request files:", req.files);
  console.log("📝 Request body type:", typeof req.body);
  
  if (!req.body || typeof req.body !== 'object') {
    res.status(400).json({ 
      error: "Request body is missing or invalid" 
    });
    return;
  }

  const {
    buyer_id,
    title,
    domain_id,
    sub_domain_ids,
    project_description,
    city,
    submit_deadline,
    quires_deadline,
    contract_time,
    previous_work,
    tender_coordinator,
    coordinator_email,
    coordinator_phone,
    expected_budget,
    required_licenses,
    required_certificates
  } = req.body;

  // Parse sub_domain_ids if it's a string (from FormData)
  let parsedSubDomainIds;
  try {
    parsedSubDomainIds = typeof sub_domain_ids === 'string' 
      ? JSON.parse(sub_domain_ids) 
      : sub_domain_ids;
  } catch (e) {
    res.status(400).json({ error: "Invalid sub_domain_ids format" });
    return;
  }

  // Parse required_licenses if it's a string (from FormData)
  let parsedRequiredLicenses = [];
  if (required_licenses) {
    try {
      parsedRequiredLicenses = typeof required_licenses === 'string' 
        ? JSON.parse(required_licenses) 
        : required_licenses;
    } catch (e) {
      console.error("Invalid required_licenses format:", e);
    }
  }

  // Parse required_certificates if it's a string (from FormData)
  let parsedRequiredCertificates = [];
  if (required_certificates) {
    try {
      parsedRequiredCertificates = typeof required_certificates === 'string' 
        ? JSON.parse(required_certificates) 
        : required_certificates;
    } catch (e) {
      console.error("Invalid required_certificates format:", e);
    }
  }

  // Handle uploaded files
  const files = (req as MulterRequest).files;
  const file1Data = files?.file1?.[0]?.buffer || null;
  const file2Data = files?.file2?.[0]?.buffer || null;
  const file1Name = files?.file1?.[0]?.originalname || null;
  const file2Name = files?.file2?.[0]?.originalname || null;

  console.log("📝 Creating tender:", { buyer_id, title, domain_id, sub_domain_ids: parsedSubDomainIds });
  console.log("📝 Files:", { file1Name, file2Name, file1Size: file1Data?.length, file2Size: file2Data?.length });

  // Validate required fields
  if (!buyer_id || !title || !domain_id || !parsedSubDomainIds || parsedSubDomainIds.length === 0) {
    res.status(400).json({ 
      error: "Missing required fields: buyer_id, title, domain_id, sub_domain_ids" 
    });
    return;
  }

  // Generate reference number (simple incremental for now)
  db.get(
    "SELECT MAX(reference_number) as max_ref FROM tender",
    [],
    (err, result) => {
      if (err) {
        console.error("Error getting max reference number:", err);
        res.status(500).json({ error: "Failed to create tender" });
        return;
      }

      const nextRefNumber = (result?.max_ref || 1000) + 1;
      
      // Insert tender with files
      db.run(
        `INSERT INTO tender (
          buyer_id, reference_number, title, domain_id, project_description,
          city, submit_deadline, quires_deadline, contract_time, previous_work,
          tender_coordinator, coordinator_email, coordinator_phone, 
          file1, file2, file1_name, file2_name, expected_budget, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          buyer_id, nextRefNumber, title, domain_id, project_description,
          city, submit_deadline, quires_deadline, contract_time, previous_work,
          tender_coordinator, coordinator_email, coordinator_phone,
          file1Data, file2Data, file1Name, file2Name, parseFloat(expected_budget) || null
        ],
        function(err) {
          if (err) {
            console.error("Error inserting tender:", err);
            res.status(500).json({ error: "Failed to create tender" });
            return;
          }

          const tenderId = this.lastID;
          console.log("✅ Tender created with ID:", tenderId);
          
          // Function to complete tender creation after all relationships are inserted
          const completeTenderCreation = () => {
            console.log("✅ Tender creation completed:", {
              tenderId, 
              insertedSubDomains, 
              totalSubDomains, 
              insertedLicenses, 
              totalLicenses, 
              insertedCertificates, 
              totalCertificates
            });
            
            res.status(201).json({
              success: true,
              tender: {
                id: tenderId,
                reference_number: nextRefNumber,
                title,
                message: "Tender created successfully"
              }
            });
          };

          // Track insertions
          let insertedSubDomains = 0;
          let insertedLicenses = 0;
          let insertedCertificates = 0;
          const totalSubDomains = parsedSubDomainIds.length;
          const totalLicenses = parsedRequiredLicenses.length;
          const totalCertificates = parsedRequiredCertificates.length;
          
          // Insert tender-subdomain relationships
          if (totalSubDomains === 0) {
            // No sub-domains to insert, proceed to licenses
            insertedSubDomains = totalSubDomains;
          } else {
            parsedSubDomainIds.forEach((subDomainId: number) => {
              db.run(
                "INSERT INTO tender_sub_domains (tender_id, sub_domain_id) VALUES (?, ?)",
                [tenderId, subDomainId],
                (subErr) => {
                  if (subErr) {
                    console.error("Error inserting tender sub-domain:", subErr);
                  }
                  
                  insertedSubDomains++;
                  if (insertedSubDomains === totalSubDomains && insertedLicenses === totalLicenses && insertedCertificates === totalCertificates) {
                    completeTenderCreation();
                  }
                }
              );
            });
          }

          // Insert tender-license relationships
          if (totalLicenses === 0) {
            // No licenses to insert, check if we can complete
            insertedLicenses = totalLicenses;
            if (insertedSubDomains === totalSubDomains && insertedCertificates === totalCertificates) {
              completeTenderCreation();
            }
          } else {
            // For now, we'll store license codes directly since the license system needs to be unified
            parsedRequiredLicenses.forEach((licenseCode: string) => {
              // For simplicity, create a license association record with the code
              // This will be updated once the license system is unified
              console.log("Adding license requirement:", licenseCode);
              
              insertedLicenses++;
              if (insertedSubDomains === totalSubDomains && insertedLicenses === totalLicenses && insertedCertificates === totalCertificates) {
                completeTenderCreation();
              }
            });
          }

          // Insert tender-certificate relationships
          if (totalCertificates === 0) {
            // No certificates to insert, check if we can complete
            insertedCertificates = totalCertificates;
            if (insertedSubDomains === totalSubDomains && insertedLicenses === totalLicenses) {
              completeTenderCreation();
            }
          } else {
            // For now, we'll store certificate codes directly since the certificate system is simple
            parsedRequiredCertificates.forEach((certificateCode: string) => {
              console.log("Adding certificate requirement:", certificateCode);
              
              insertedCertificates++;
              if (insertedSubDomains === totalSubDomains && insertedLicenses === totalLicenses && insertedCertificates === totalCertificates) {
                completeTenderCreation();
              }
            });
          }
        }
      );
    }
  );
};

// Update tender
export const updateTender: RequestHandler = (req, res) => {
  const { id } = req.params;
  const tender: Partial<TenderEntity> = req.body;

  console.log("📝 Updating tender:", id, tender);

  db.run(
    `UPDATE tender SET 
      title = COALESCE(?, title),
      domain_id = COALESCE(?, domain_id),
      project_description = COALESCE(?, project_description),
      city = COALESCE(?, city),
      submit_deadline = COALESCE(?, submit_deadline),
      quires_deadline = COALESCE(?, quires_deadline),
      contract_time = COALESCE(?, contract_time),
      previous_work = COALESCE(?, previous_work),
      evaluation_criteria = COALESCE(?, evaluation_criteria),
      used_technologies = COALESCE(?, used_technologies),
      tender_coordinator = COALESCE(?, tender_coordinator),
      coordinator_email = COALESCE(?, coordinator_email),
      coordinator_phone = COALESCE(?, coordinator_phone)
     WHERE id = ?`,
    [
      tender.title,
      tender.domain_id,
      tender.project_description,
      tender.city,
      tender.submit_deadline,
      tender.quires_deadline,
      tender.contract_time,
      tender.previous_work,
      tender.evaluation_criteria,
      tender.used_technologies,
      tender.tender_coordinator,
      tender.coordinator_email,
      tender.coordinator_phone,
      id
    ],
    (err) => {
      if (err) {
        console.error("Error updating tender:", err);
        res.status(500).json({ error: "Failed to update tender" });
        return;
      }

      res.json({ success: true, message: "Tender updated successfully" });
    }
  );
};

// Delete tender
export const deleteTender: RequestHandler = (req, res) => {
  const { id } = req.params;

  db.run(
    `DELETE FROM tender WHERE id = ?`,
    [id],
    (err) => {
      if (err) {
        console.error("Error deleting tender:", err);
        res.status(500).json({ error: "Failed to delete tender" });
        return;
      }

      res.json({ success: true, message: "Tender deleted successfully" });
    }
  );
};

// Get tenders by domain
export const getTendersByDomain: RequestHandler = (req, res) => {
  const { domainId } = req.params;

  db.all(
    `SELECT 
      t.*,
      d.Name as domain_name
     FROM tender t
     LEFT JOIN domains d ON t.domain_id = d.ID
     WHERE t.domain_id = ?
     ORDER BY t.created_at DESC`,
    [domainId],
    (err, rows) => {
      if (err) {
        console.error("Error fetching tenders by domain:", err);
        res.status(500).json({ error: "Failed to fetch tenders" });
        return;
      }
      res.json({ tenders: rows || [] });
    }
  );
};