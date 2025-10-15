import { RequestHandler, Request } from "express";
import { db } from "../db";
import multer from 'multer';
import fs from 'fs';

// Configure multer for file uploads
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Allow common document and image formats
    const allowedTypes = [
      'application/pdf',
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG files are allowed.'));
    }
  }
});

// Extend Request interface to include files
interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}

// Submit proposal with files
export const submitProposalWithFiles = [
  upload.any(), // Accept any files
  ((req: MulterRequest, res) => {
    try {
      const { tender_id, supplier_id, proposal_price, company_name, project_description, extra_description } = req.body;
      const files = req.files as Express.Multer.File[] || [];

      console.log("Submitting proposal:", { tender_id, supplier_id, proposal_price, filesCount: files.length });

      // Validate required fields
      if (!tender_id || !supplier_id || !proposal_price) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: tender_id, supplier_id, proposal_price"
        });
      }

      // Generate reference number (you can implement your own logic here)
      const reference_number = Math.floor(100000 + Math.random() * 900000);

      // Prepare file data as BLOBs
      const fileData: { [key: string]: Buffer | null } = {
        financial_file: null,
        technical_file: null,
        company_file: null,
        extra_file: null
      };

      // Process uploaded files
      for (const file of files) {
        const fileBuffer = fs.readFileSync(file.path);
        
        // Map file fieldname to database column
        if (file.fieldname === 'financial_file') {
          fileData.financial_file = fileBuffer;
        } else if (file.fieldname === 'technical_file') {
          fileData.technical_file = fileBuffer;
        } else if (file.fieldname === 'company_file') {
          fileData.company_file = fileBuffer;
        } else if (file.fieldname === 'extra_file') {
          fileData.extra_file = fileBuffer;
        }

        // Clean up temporary file
        fs.unlinkSync(file.path);
      }

      // Insert proposal into Proposal table
      const insertProposalSql = `
        INSERT INTO Proposal (
          reference_number, proposal_price, company_name, project_description,
          financial_file, technical_file, company_file, extra_file, extra_description,
          tender_id, supplier_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const proposalParams = [
        reference_number,
        parseFloat(proposal_price),
        company_name || null,
        project_description || null,
        fileData.financial_file,
        fileData.technical_file,
        fileData.company_file,
        fileData.extra_file,
        extra_description || null,
        parseInt(tender_id),
        parseInt(supplier_id)
      ];

      db.run(insertProposalSql, proposalParams, function(err) {
        if (err) {
          console.error("Error inserting proposal:", err);
          return res.status(500).json({
            success: false,
            message: "Error submitting proposal: " + err.message
          });
        }

        console.log(`✅ Proposal submitted with ID: ${this.lastID}`);
        res.json({
          success: true,
          message: "Proposal submitted successfully",
          proposalId: this.lastID,
          referenceNumber: reference_number
        });
      });

    } catch (error) {
      console.error("Error in submitProposalWithFiles:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }) as RequestHandler
];

// Get proposals for a specific tender
export const getProposalsForTender: RequestHandler = (req, res) => {
  try {
    const { tenderId } = req.params;

    const query = `
      SELECT 
        p.id,
        p.reference_number,
        p.proposal_price,
        p.created_at,
        p.company_name,
        p.project_description,
        p.extra_description,
        p.tender_id,
        p.supplier_id,
        s.company_name as supplier_company_name,
        s.Account_email as supplier_email,
        s.Account_name as supplier_account_name,
        s.Commercial_registration_number as supplier_commercial_record,
        s.Commercial_Phone_number as supplier_phone,
        s.Account_phone as supplier_account_phone,
        s.city_id as supplier_city_id,
        c.name as supplier_city,
        d.Name as supplier_domain_name
      FROM Proposal p
      JOIN Supplier s ON p.supplier_id = s.ID
      LEFT JOIN domains d ON s.domains_id = d.ID
      LEFT JOIN City c ON s.city_id = c.id
      WHERE p.tender_id = ?
      ORDER BY p.created_at DESC
    `;

    db.all(query, [tenderId], (err, proposals) => {
      if (err) {
        console.error("Error fetching proposals:", err);
        return res.status(500).json({
          success: false,
          message: "Error fetching proposals" 
        });
      }

      if (!proposals || proposals.length === 0) {
        return res.json({
          success: true,
          data: []
        });
      }

      // For each proposal, fetch supplier's licenses and certificates
      let processedCount = 0;
      const enrichedProposals = proposals.map(proposal => ({ ...proposal, licenses: [], certificates: [] }));

      proposals.forEach((proposal, index) => {
        // Get supplier licenses
        db.all(`
          SELECT l.Name 
          FROM Supplier_Licenses sl 
          JOIN Licenses l ON sl.license_id = l.ID 
          WHERE sl.supplier_id = ?
        `, [proposal.supplier_id], (err, licenses) => {
          if (!err && licenses) {
            enrichedProposals[index].licenses = licenses.map(l => l.Name);
          }

          // Get supplier certificates
          db.all(`
            SELECT c.Name 
            FROM Supplier_Certificates sc 
            JOIN certificates c ON sc.certificate_id = c.ID 
            WHERE sc.supplier_id = ?
          `, [proposal.supplier_id], (err, certificates) => {
            if (!err && certificates) {
              enrichedProposals[index].certificates = certificates.map(c => c.Name);
            }

            processedCount++;
            if (processedCount === proposals.length) {
              res.json({
                success: true,
                data: enrichedProposals
              });
            }
          });
        });
      });

    });

  } catch (error) {
    console.error("Error in getProposalsForTender:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get proposals by supplier (for supplier dashboard)
export const getProposalsBySupplier: RequestHandler = (req, res) => {
  try {
    const { supplierId } = req.params;

    const query = `
      SELECT 
        p.id,
        p.reference_number,
        p.proposal_price,
        p.created_at,
        p.company_name,
        p.project_description,
        p.tender_id,
        t.title as tender_title,
        t.reference_number as tender_reference_number
      FROM Proposal p
      JOIN tender t ON p.tender_id = t.id
      WHERE p.supplier_id = ?
      ORDER BY p.created_at DESC
    `;

    db.all(query, [supplierId], (err, proposals) => {
      if (err) {
        console.error("Error fetching supplier proposals:", err);
        return res.status(500).json({
          success: false,
          message: "Error fetching proposals" 
        });
      }

      res.json({
        success: true,
        data: proposals || []
      });
    });

  } catch (error) {
    console.error("Error in getProposalsBySupplier:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get proposal file (download)
export const downloadProposalFile: RequestHandler = (req, res) => {
  try {
    const { proposalId, fileType } = req.params;

    // Validate file type
    const validFileTypes = ['financial_file', 'technical_file', 'company_file', 'extra_file'];
    if (!validFileTypes.includes(fileType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file type"
      });
    }

    const query = `SELECT ${fileType} FROM Proposal WHERE id = ?`;

    db.get(query, [proposalId], (err, result: any) => {
      if (err) {
        console.error("Error fetching proposal file:", err);
        return res.status(500).json({
          success: false,
          message: "Error fetching file"
        });
      }

      if (!result || !result[fileType]) {
        return res.status(404).json({
          success: false,
          message: "File not found"
        });
      }

      // Set appropriate headers
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${fileType}_${proposalId}"`);
      
      // Send the file buffer
      res.send(result[fileType]);
    });

  } catch (error) {
    console.error("Error in downloadProposalFile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get proposal details including file information
export const getProposalDetails: RequestHandler = (req, res) => {
  try {
    const { proposalId } = req.params;

    const query = `
      SELECT 
        p.*,
        s.company_name as supplier_company_name,
        s.Account_email as supplier_email,
        t.title as tender_title,
        t.reference_number as tender_reference_number
      FROM Proposal p
      JOIN Supplier s ON p.supplier_id = s.ID
      JOIN tender t ON p.tender_id = t.id
      WHERE p.id = ?
    `;

    db.get(query, [proposalId], (err, proposal: any) => {
      if (err) {
        console.error("Error fetching proposal details:", err);
        return res.status(500).json({
          success: false,
          message: "Error fetching proposal details"
        });
      }

      if (!proposal) {
        return res.status(404).json({
          success: false,
          message: "Proposal not found"
        });
      }

      // Add file information (check which files exist)
      const files = {
        financial_file: proposal.financial_file ? true : false,
        technical_file: proposal.technical_file ? true : false,
        company_file: proposal.company_file ? true : false,
        extra_file: proposal.extra_file ? true : false
      };

      // Remove BLOB data from response (we don't want to send binary data in JSON)
      delete proposal.financial_file;
      delete proposal.technical_file;
      delete proposal.company_file;
      delete proposal.extra_file;

      res.json({
        success: true,
        data: {
          ...proposal,
          files
        }
      });
    });

  } catch (error) {
    console.error("Error in getProposalDetails:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
