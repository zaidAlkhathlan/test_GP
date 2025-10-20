import { RequestHandler, Request } from "express";
import { db } from "../db";
import { TenderEntity } from "@shared/api";

// Extend Express Request to include files
interface MulterRequest extends Request {
  files?: { [fieldname: string]: Express.Multer.File[] };
}

// Get all tenders (optionally filtered by buyer_id and submit_deadline range)
export const getTenders: RequestHandler = (req, res) => {
  const buyerId = req.query.buyer_id;
  const submitFrom = req.query.submit_from as string | undefined;
  const submitTo = req.query.submit_to as string | undefined;
  const expectedMin = (req.query.expected_min as string | undefined) ?? undefined;
  const expectedMax = (req.query.expected_max as string | undefined) ?? undefined;

  let query = `SELECT 
    t.*,
    d.Name as domain_name,
    b.Account_name as buyer_name,
    b.company_name as buyer_company,
    c.id as city_table_id,
    c.name as city_name,
    r.id as region_id,
    r.name as region_name,
    s.name as status_name
   FROM tender t
   LEFT JOIN domains d ON t.domain_id = d.ID
   LEFT JOIN Buyer b ON t.buyer_id = b.ID
   LEFT JOIN City c ON t.city_id = c.id
   LEFT JOIN Region r ON c.region_id = r.id
   LEFT JOIN status s ON t.status_id = s.id`;
  
  const params: any[] = [];
  const where: string[] = [];

  if (buyerId) {
    where.push(`t.buyer_id = ?`);
    params.push(buyerId);
  }

  if (submitFrom) {
    // include start of day
    where.push(`datetime(t.submit_deadline) >= datetime(?)`);
    params.push(`${submitFrom} 00:00:00`);
  }

  if (submitTo) {
    // include end of day
    where.push(`datetime(t.submit_deadline) <= datetime(?)`);
    params.push(`${submitTo} 23:59:59`);
  }

  // Expected budget filtering (cast text to number)
  if (expectedMin) {
    where.push(`CAST(COALESCE(t.expected_budget, '0') AS REAL) >= ?`);
    params.push(Number(expectedMin));
  }
  if (expectedMax) {
    where.push(`CAST(COALESCE(t.expected_budget, '0') AS REAL) <= ?`);
    params.push(Number(expectedMax));
  }

  if (where.length > 0) {
    query += ` WHERE ` + where.join(' AND ');
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
      t.id, t.buyer_id, t.reference_number, t.title, t.domain_id, t.project_description, 
      t.city_id, t.created_at, t.submit_deadline, t.quires_deadline, t.contract_time, 
      t.previous_work, t.evaluation_criteria, t.used_technologies, t.tender_coordinator, 
      t.coordinator_email, t.coordinator_phone, t.file1_name, t.file2_name, t.expected_budget,
      t.status_id, t.finished_at,
      d.Name as domain_name, c.name as city_name, r.name as region_name, s.name as status_name
     FROM tender t
     LEFT JOIN domains d ON t.domain_id = d.ID
     LEFT JOIN City c ON t.city_id = c.id
     LEFT JOIN Region r ON c.region_id = r.id
     LEFT JOIN status s ON t.status_id = s.id
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
          
          // Get associated licenses
          db.all(
            `SELECT l.ID, l.Name 
             FROM tender_licenses tl
             JOIN Licenses l ON tl.license_id = l.ID
             WHERE tl.tender_id = ?`,
            [id],
            (licenseErr, licenses) => {
              if (licenseErr) {
                console.error("Error fetching tender licenses:", licenseErr);
              }
              
              // Get associated certificates
              db.all(
                `SELECT c.ID, c.Name 
                 FROM tender_certificates tc
                 JOIN Certificates c ON tc.certificate_id = c.ID
                 WHERE tc.tender_id = ?`,
                [id],
                (certErr, certificates) => {
                  if (certErr) {
                    console.error("Error fetching tender certificates:", certErr);
                  }
                  
                  // Get required files for this tender
                  db.all(
                    `SELECT * FROM tender_required_files WHERE tender_id = ? ORDER BY file_type, file_name`,
                    [id],
                    (filesErr, requiredFiles) => {
                      if (filesErr) {
                        console.error("Error fetching tender required files:", filesErr);
                      }
                      
                      // Create tender details with real data from database
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
                          address: row.city_name ? `${row.city_name}, المملكة العربية السعودية` : null
                        },
                        // Only include documents that actually exist
                        documents: [
                          row.file1_name ? {
                            name: row.file1_name,
                            url: `/api/tenders/${id}/file1`,
                            size: 'متاح للتنزيل'
                          } : null,
                          row.file2_name ? {
                            name: row.file2_name, 
                            url: `/api/tenders/${id}/file2`,
                            size: 'متاح للتنزيل'
                          } : null
                        ].filter(doc => doc !== null),
                        // No sample activities - will get real activities from database
                        activities: [],
                        // No fake stats - will get real stats from database 
                        stats: {
                          proposalsCount: 0,
                          inquiriesCount: 0,  
                          viewsCount: 0
                        }
                      };
                      
                      res.json({
                        tender: tenderDetails,
                        subDomains: subDomains || [],
                        licenses: licenses || [],
                        certificates: certificates || [],
                        requiredFiles: requiredFiles || [],
                        requiredLicenses: licenses || [], // For backward compatibility
                        requiredCertificates: certificates || []
                      });
                    }
                  );
                }
              );
            }
          );
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
    required_files
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

  // Parse required_files if it's a string (from FormData)
  let parsedRequiredFiles = [];
  if (required_files) {
    try {
      parsedRequiredFiles = typeof required_files === 'string' 
        ? JSON.parse(required_files) 
        : required_files;
    } catch (e) {
      console.error("Invalid required_files format:", e);
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
          city_id, submit_deadline, quires_deadline, contract_time, previous_work,
          evaluation_criteria, used_technologies, tender_coordinator, coordinator_email, coordinator_phone, 
          file1, file2, file1_name, file2_name, expected_budget, status_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)`,
        [
          buyer_id, nextRefNumber, title, domain_id, project_description,
          city_id, submit_deadline, quires_deadline, contract_time, previous_work,
          evaluation_criteria || null, used_technologies || null, tender_coordinator, coordinator_email, coordinator_phone,
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
          let responseAlreadySent = false;
          const completeTenderCreation = () => {
            if (responseAlreadySent) {
              console.log("⚠️ Response already sent, skipping duplicate call");
              return;
            }
            
            console.log("✅ Tender creation completed:", {
              tenderId, 
              insertedSubDomains, 
              totalSubDomains, 
              insertedLicenses, 
              totalLicenses, 
              insertedCertificates, 
              totalCertificates,
              insertedRequiredFiles,
              totalRequiredFiles
            });
            
            responseAlreadySent = true;
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
          let insertedRequiredFiles = 0;
          const totalSubDomains = parsedSubDomainIds.length;
          const totalLicenses = parsedRequiredLicenses.length;
          const totalCertificates = parsedRequiredCertificates.length;
          const totalRequiredFiles = parsedRequiredFiles.length;
          
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
                  if (insertedSubDomains === totalSubDomains && insertedLicenses === totalLicenses && insertedCertificates === totalCertificates && insertedRequiredFiles === totalRequiredFiles) {
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
            if (insertedSubDomains === totalSubDomains && insertedCertificates === totalCertificates && insertedRequiredFiles === totalRequiredFiles) {
              completeTenderCreation();
            }
          } else {
            parsedRequiredLicenses.forEach((licenseCode: string) => {
              console.log("Adding license requirement:", licenseCode);
              
              // First, find the license ID by code (name)
              db.get(
                "SELECT ID FROM Licenses WHERE Name = ?",
                [licenseCode],
                (licenseErr, licenseRow: any) => {
                  if (licenseErr) {
                    console.error("Error finding license:", licenseErr);
                  } else if (licenseRow) {
                    // Insert into tender_licenses table
                    db.run(
                      "INSERT INTO tender_licenses (tender_id, license_id) VALUES (?, ?)",
                      [tenderId, licenseRow.ID],
                      (insertErr) => {
                        if (insertErr) {
                          console.error("Error inserting tender license:", insertErr);
                        } else {
                          console.log(`✅ Inserted license relationship: tender ${tenderId} -> license ${licenseRow.ID}`);
                        }
                      }
                    );
                  } else {
                    console.warn(`⚠️ License not found: ${licenseCode}`);
                  }
                  
                  insertedLicenses++;
                  if (insertedSubDomains === totalSubDomains && insertedLicenses === totalLicenses && insertedCertificates === totalCertificates && insertedRequiredFiles === totalRequiredFiles) {
                    completeTenderCreation();
                  }
                }
              );
            });
          }

          // Insert tender-certificate relationships
          if (totalCertificates === 0) {
            // No certificates to insert, check if we can complete
            insertedCertificates = totalCertificates;
            if (insertedSubDomains === totalSubDomains && insertedLicenses === totalLicenses && insertedRequiredFiles === totalRequiredFiles) {
              completeTenderCreation();
            }
          } else {
            parsedRequiredCertificates.forEach((certificateCode: string) => {
              console.log("Adding certificate requirement:", certificateCode);
              
              // First, find the certificate ID by code (name)
              db.get(
                "SELECT ID FROM Certificates WHERE Name = ?",
                [certificateCode],
                (certErr, certRow: any) => {
                  if (certErr) {
                    console.error("Error finding certificate:", certErr);
                  } else if (certRow) {
                    // Insert into tender_certificates table
                    db.run(
                      "INSERT INTO tender_certificates (tender_id, certificate_id) VALUES (?, ?)",
                      [tenderId, certRow.ID],
                      (insertErr) => {
                        if (insertErr) {
                          console.error("Error inserting tender certificate:", insertErr);
                        } else {
                          console.log(`✅ Inserted certificate relationship: tender ${tenderId} -> certificate ${certRow.ID}`);
                        }
                      }
                    );
                  } else {
                    console.warn(`⚠️ Certificate not found: ${certificateCode}`);
                  }
                  
                  insertedCertificates++;
                  if (insertedSubDomains === totalSubDomains && insertedLicenses === totalLicenses && insertedCertificates === totalCertificates && insertedRequiredFiles === totalRequiredFiles) {
                    completeTenderCreation();
                  }
                }
              );
            });
          }

          // Insert tender required files
          if (totalRequiredFiles === 0) {
            // No required files to insert, check if we can complete
            insertedRequiredFiles = totalRequiredFiles;
            if (insertedSubDomains === totalSubDomains && insertedLicenses === totalLicenses && insertedCertificates === totalCertificates) {
              completeTenderCreation();
            }
          } else {
            parsedRequiredFiles.forEach((fileReq: any) => {
              console.log("Adding required file:", fileReq);
              
              db.run(
                `INSERT INTO tender_required_files 
                 (tender_id, file_type, file_name, description, is_required, max_size_mb, allowed_formats) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                  tenderId,
                  fileReq.file_type,
                  fileReq.file_name || fileReq.name,
                  fileReq.description || '',
                  fileReq.is_required !== false ? 1 : 0,
                  fileReq.max_size_mb || 10,
                  fileReq.allowed_formats || 'PDF,DOC,DOCX,JPG,PNG'
                ],
                (fileErr) => {
                  if (fileErr) {
                    console.error("Error inserting tender required file:", fileErr);
                  } else {
                    console.log(`✅ Inserted required file: ${fileReq.file_name} for tender ${tenderId}`);
                  }
                  
                  insertedRequiredFiles++;
                  if (insertedSubDomains === totalSubDomains && insertedLicenses === totalLicenses && insertedCertificates === totalCertificates && insertedRequiredFiles === totalRequiredFiles) {
                    completeTenderCreation();
                  }
                }
              );
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
      city_id = COALESCE(?, city_id),
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
      tender.city_id,
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
      d.Name as domain_name,
      s.name as status_name
     FROM tender t
     LEFT JOIN domains d ON t.domain_id = d.ID
     LEFT JOIN status s ON t.status_id = s.id
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

// Download tender file1
export const downloadTenderFile1: RequestHandler = (req, res) => {
  const { id } = req.params;

  db.get(
    "SELECT file1, file1_name FROM tender WHERE id = ?",
    [id],
    (err, row: any) => {
      if (err) {
        console.error("Error fetching file:", err);
        res.status(500).json({ error: "Failed to fetch file" });
        return;
      }

      if (!row || !row.file1) {
        res.status(404).json({ error: "File not found" });
        return;
      }

      // Set appropriate headers
      const filename = row.file1_name || `tender_${id}_file1`;
      const extension = filename.split('.').pop()?.toLowerCase();
      
      let contentType = 'application/octet-stream';
      if (extension === 'pdf') {
        contentType = 'application/pdf';
      } else if (extension === 'doc') {
        contentType = 'application/msword';
      } else if (extension === 'docx') {
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (['jpg', 'jpeg'].includes(extension || '')) {
        contentType = 'image/jpeg';
      } else if (extension === 'png') {
        contentType = 'image/png';
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
      res.send(row.file1);
    }
  );
};

// Download tender file2
export const downloadTenderFile2: RequestHandler = (req, res) => {
  const { id } = req.params;

  db.get(
    "SELECT file2, file2_name FROM tender WHERE id = ?",
    [id],
    (err, row: any) => {
      if (err) {
        console.error("Error fetching file:", err);
        res.status(500).json({ error: "Failed to fetch file" });
        return;
      }

      if (!row || !row.file2) {
        res.status(404).json({ error: "File not found" });
        return;
      }

      // Set appropriate headers
      const filename = row.file2_name || `tender_${id}_file2`;
      const extension = filename.split('.').pop()?.toLowerCase();
      
      let contentType = 'application/octet-stream';
      if (extension === 'pdf') {
        contentType = 'application/pdf';
      } else if (extension === 'doc') {
        contentType = 'application/msword';
      } else if (extension === 'docx') {
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      } else if (['jpg', 'jpeg'].includes(extension || '')) {
        contentType = 'image/jpeg';
      } else if (extension === 'png') {
        contentType = 'image/png';
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
      res.send(row.file2);
    }
  );
};