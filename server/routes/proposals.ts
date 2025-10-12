import { RequestHandler, Request } from "express";
import { db } from "../db";
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
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
  files: {
    financial_file?: Express.Multer.File[];
    technical_file?: Express.Multer.File[];
    company_file?: Express.Multer.File[];
    extra_file?: Express.Multer.File[];
  };
}

// Submit proposal with files
export const submitProposalWithFiles = [
  upload.fields([
    { name: 'financial_file', maxCount: 1 },
    { name: 'technical_file', maxCount: 1 },
    { name: 'company_file', maxCount: 1 },
    { name: 'extra_file', maxCount: 1 }
  ]),
  (req: MulterRequest, res) => {
    try {
      const { 
        tender_id, 
        supplier_id, 
        proposal_price, 
        project_description,
        extra_description,
        reference_number,
        company_name 
      } = req.body;

      const files = req.files || {};
      
      console.log("Submitting proposal:", { 
        tender_id, 
        supplier_id, 
        proposal_price, 
        project_description,
        filesCount: Object.keys(files).length 
      });

      // Validate required fields
      if (!tender_id || !supplier_id || !proposal_price) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: tender_id, supplier_id, proposal_price"
        });
      }

      // Prepare file data
      const financial_file = files.financial_file?.[0]?.buffer || null;
      const technical_file = files.technical_file?.[0]?.buffer || null;
      const company_file = files.company_file?.[0]?.buffer || null;
      const extra_file = files.extra_file?.[0]?.buffer || null;

      // Insert proposal into Proposal table
      const insertProposalSql = `
        INSERT INTO Proposal (
          reference_number, proposal_price, company_name, project_description,
          financial_file, technical_file, company_file, extra_file, extra_description,
          tender_id, supplier_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `;

      const proposalParams = [
        reference_number || null,
        parseFloat(proposal_price),
        company_name || '',
        project_description || '',
        financial_file,
        technical_file,
        company_file,
        extra_file,
        extra_description || '',
        tender_id,
        supplier_id
      ];

      db.run(insertProposalSql, proposalParams, function(err) {
        if (err) {
          console.error("Error inserting proposal:", err);
          return res.status(500).json({
            success: false,
            message: "Error submitting proposal"
          });
        }

        const proposalId = this.lastID;
        console.log("Proposal inserted with ID:", proposalId);

        res.json({
          success: true,
          message: "Proposal submitted successfully",
          proposal: {
            id: proposalId,
            tender_id: tender_id,
            supplier_id: supplier_id,
            proposal_price: proposal_price,
            reference_number: reference_number,
            created_at: new Date().toISOString()
          }
        });
      });

    } catch (error) {
      console.error("Error in submitProposalWithFiles:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
];

// Get proposals for a specific tender
export const getProposalsForTender: RequestHandler = (req, res) => {
  const { tenderId } = req.params;

  if (!tenderId) {
    return res.status(400).json({
      success: false,
      message: "Tender ID is required"
    });
  }

  const sql = `
    SELECT p.*, s.company_name as supplier_company_name, s.Account_email as supplier_email
    FROM Proposal p
    LEFT JOIN Supplier s ON p.supplier_id = s.ID
    WHERE p.tender_id = ?
    ORDER BY p.created_at DESC
  `;

  db.all(sql, [tenderId], (err, rows) => {
    if (err) {
      console.error("Error fetching proposals:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching proposals"
      });
    }

    // Convert BLOB data to indicate file presence (don't send actual binary data)
    const proposals = rows.map(row => ({
      ...row,
      has_financial_file: !!row.financial_file,
      has_technical_file: !!row.technical_file,
      has_company_file: !!row.company_file,
      has_extra_file: !!row.extra_file,
      financial_file: undefined, // Remove binary data
      technical_file: undefined,
      company_file: undefined,
      extra_file: undefined
    }));

    res.json({
      success: true,
      proposals: proposals
    });
  });
};

// Get proposals for a specific supplier
export const getProposalsForSupplier: RequestHandler = (req, res) => {
  const { supplierId } = req.params;

  if (!supplierId) {
    return res.status(400).json({
      success: false,
      message: "Supplier ID is required"
    });
  }

  const sql = `
    SELECT p.*, t.title as tender_title, t.reference_number as tender_reference
    FROM Proposal p
    LEFT JOIN tender t ON p.tender_id = t.id
    WHERE p.supplier_id = ?
    ORDER BY p.created_at DESC
  `;

  db.all(sql, [supplierId], (err, rows) => {
    if (err) {
      console.error("Error fetching supplier proposals:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching proposals"
      });
    }

    // Convert BLOB data to indicate file presence
    const proposals = rows.map(row => ({
      ...row,
      has_financial_file: !!row.financial_file,
      has_technical_file: !!row.technical_file,
      has_company_file: !!row.company_file,
      has_extra_file: !!row.extra_file,
      financial_file: undefined,
      technical_file: undefined,
      company_file: undefined,
      extra_file: undefined
    }));

    res.json({
      success: true,
      proposals: proposals
    });
  });
};

// Download a specific file from a proposal
export const downloadProposalFile: RequestHandler = (req, res) => {
  const { proposalId, fileType } = req.params;

  if (!proposalId || !fileType) {
    return res.status(400).json({
      success: false,
      message: "Proposal ID and file type are required"
    });
  }

  const validFileTypes = ['financial_file', 'technical_file', 'company_file', 'extra_file'];
  if (!validFileTypes.includes(fileType)) {
    return res.status(400).json({
      success: false,
      message: "Invalid file type"
    });
  }

  const sql = `SELECT ${fileType}, company_name FROM Proposal WHERE id = ?`;

  db.get(sql, [proposalId], (err, row) => {
    if (err) {
      console.error("Error fetching proposal file:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching file"
      });
    }

    if (!row || !row[fileType]) {
      return res.status(404).json({
        success: false,
        message: "File not found"
      });
    }

    // Set appropriate headers
    const filename = `${fileType}_${row.company_name || 'proposal'}_${proposalId}.pdf`;
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Send the binary data
    res.send(Buffer.from(row[fileType]));
  });
};

// Get a specific proposal by ID
export const getProposalById: RequestHandler = (req, res) => {
  const { proposalId } = req.params;

  if (!proposalId) {
    return res.status(400).json({
      success: false,
      message: "Proposal ID is required"
    });
  }

  const sql = `
    SELECT p.*, s.company_name as supplier_company_name, s.Account_email as supplier_email,
           t.title as tender_title, t.reference_number as tender_reference
    FROM Proposal p
    LEFT JOIN Supplier s ON p.supplier_id = s.ID
    LEFT JOIN tender t ON p.tender_id = t.id
    WHERE p.id = ?
  `;

  db.get(sql, [proposalId], (err, row) => {
    if (err) {
      console.error("Error fetching proposal:", err);
      return res.status(500).json({
        success: false,
        message: "Error fetching proposal"
      });
    }

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found"
      });
    }

    // Convert BLOB data to indicate file presence
    const proposal = {
      ...row,
      has_financial_file: !!row.financial_file,
      has_technical_file: !!row.technical_file,
      has_company_file: !!row.company_file,
      has_extra_file: !!row.extra_file,
      financial_file: undefined,
      technical_file: undefined,
      company_file: undefined,
      extra_file: undefined
    };

    res.json({
      success: true,
      proposal: proposal
    });
  });
};