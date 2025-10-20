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

// Submit offer with files
export const submitOfferWithFiles = [
  upload.any(), // Accept any files
  ((req: MulterRequest, res) => {
    try {
      const { tender_id, supplier_id, offer_value, additional_notes } = req.body;
      const files = req.files as Express.Multer.File[] || [];

      console.log("Submitting offer:", { tender_id, supplier_id, offer_value, filesCount: files.length });

      // Validate required fields
      if (!tender_id || !supplier_id || !offer_value) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: tender_id, supplier_id, offer_value"
        });
      }

      // Insert offer into offers table
      const insertOfferSql = `
        INSERT INTO offers (tender_id, supplier_id, offer_value, additional_notes, status, submitted_at)
        VALUES (?, ?, ?, ?, 'submitted', CURRENT_TIMESTAMP)
      `;
      
      const offerParams = [tender_id, supplier_id, parseFloat(offer_value), additional_notes || ''];

      db.run(insertOfferSql, offerParams, function(err) {
        if (err) {
          console.error("Error inserting offer:", err);
          return res.status(500).json({
            success: false,
            message: "Error submitting offer"
          });
        }

        const offerId = this.lastID;
        console.log("Offer inserted with ID:", offerId);

        // Process files if any were uploaded
        if (files.length > 0) {
          let filesProcessed = 0;
          let filesWithErrors = 0;

          files.forEach((file) => {
            try {
              // Read file data
              const fileData = fs.readFileSync(file.path);
              
              // Determine file type based on fieldname or filename
              let fileType = 'additional'; // default
              const fieldName = file.fieldname?.toLowerCase() || '';
              const fileName = file.originalname?.toLowerCase() || '';
              
              if (fieldName.includes('technical') || fileName.includes('technical')) {
                fileType = 'technical';
              } else if (fieldName.includes('financial') || fileName.includes('financial')) {
                fileType = 'financial';
              } else if (fieldName.includes('company') || fileName.includes('company')) {
                fileType = 'company';
              }

              // Insert file into offer_files table
              const insertFileSql = `
                INSERT INTO offer_files (offer_id, file_type, file_name, file_data, file_size, mime_type)
                VALUES (?, ?, ?, ?, ?, ?)
              `;

              const fileParams = [
                offerId,
                fileType,
                file.originalname,
                fileData,
                file.size,
                file.mimetype
              ];

              db.run(insertFileSql, fileParams, function(fileErr) {
                filesProcessed++;
                
                if (fileErr) {
                  console.error("Error inserting file:", fileErr);
                  filesWithErrors++;
                } else {
                  console.log("File saved:", file.originalname);
                }

                // Clean up temp file
                try {
                  fs.unlinkSync(file.path);
                } catch (unlinkErr) {
                  console.error("Error cleaning up temp file:", unlinkErr);
                }

                // Check if all files are processed
                if (filesProcessed === files.length) {
                  if (filesWithErrors > 0) {
                    return res.status(206).json({
                      success: true,
                      message: `Offer submitted successfully, but ${filesWithErrors} files had errors`,
                      offer_id: offerId,
                      files_processed: filesProcessed - filesWithErrors,
                      files_with_errors: filesWithErrors
                    });
                  } else {
                    return res.json({
                      success: true,
                      message: "Offer and files submitted successfully",
                      offer_id: offerId,
                      files_uploaded: filesProcessed
                    });
                  }
                }
              });
            } catch (fileReadErr) {
              console.error("Error reading file:", fileReadErr);
              filesProcessed++;
              filesWithErrors++;
              
              // Clean up temp file
              try {
                fs.unlinkSync(file.path);
              } catch (unlinkErr) {
                console.error("Error cleaning up temp file:", unlinkErr);
              }

              // Check if all files are processed
              if (filesProcessed === files.length) {
                return res.status(206).json({
                  success: true,
                  message: `Offer submitted successfully, but ${filesWithErrors} files had errors`,
                  offer_id: offerId,
                  files_processed: filesProcessed - filesWithErrors,
                  files_with_errors: filesWithErrors
                });
              }
            }
          });
        } else {
          // No files uploaded
          return res.json({
            success: true,
            message: "Offer submitted successfully",
            offer_id: offerId,
            files_uploaded: 0
          });
        }
      });

    } catch (error) {
      console.error("Error in submitOfferWithFiles:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }) as RequestHandler
];

// Get offers for a specific tender
export const getOffersByTender: RequestHandler = (req, res) => {
  try {
    const { tenderId } = req.params;
    
    db.all(`
      SELECT 
        o.*,
        s.company_name,
        s.Account_name as contact_name
      FROM offers o
      LEFT JOIN Supplier s ON o.supplier_id = s.ID
      WHERE o.tender_id = ?
      ORDER BY o.submitted_at DESC
    `, [tenderId], (err, rows) => {
      if (err) {
        console.error("Error fetching offers:", err);
        return res.status(500).json({ 
          success: false,
          message: "Error fetching offers" 
        });
      }

      res.json({ 
        success: true,
        data: rows || []
      });
    });
  } catch (error) {
    console.error("Error in getOffersByTender:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

// Get offers by supplier (for supplier dashboard)
export const getOffersBySupplier: RequestHandler = (req, res) => {
  try {
    const { supplierId } = req.params;
    
    db.all(`
      SELECT 
        o.*,
        t.title as tender_title,
        t.reference_number,
        t.submit_deadline,
        b.company_name as buyer_company
      FROM offers o
      LEFT JOIN tender t ON o.tender_id = t.id
      LEFT JOIN Buyer b ON t.buyer_id = b.ID
      WHERE o.supplier_id = ?
      ORDER BY o.submitted_at DESC
    `, [supplierId], (err, rows) => {
      if (err) {
        console.error("Error fetching supplier offers:", err);
        return res.status(500).json({ 
          success: false,
          message: "Error fetching offers" 
        });
      }

      res.json({ 
        success: true,
        data: rows || []
      });
    });
  } catch (error) {
    console.error("Error in getOffersBySupplier:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

// Get offer files
export const getOfferFiles: RequestHandler = (req, res) => {
  try {
    const { offerId } = req.params;
    
    db.all(`
      SELECT id, file_type, file_name, file_size, mime_type, uploaded_at
      FROM offer_files
      WHERE offer_id = ?
      ORDER BY uploaded_at DESC
    `, [offerId], (err, rows) => {
      if (err) {
        console.error("Error fetching offer files:", err);
        return res.status(500).json({ 
          success: false,
          message: "Error fetching files" 
        });
      }

      res.json({ 
        success: true,
        data: rows || []
      });
    });
  } catch (error) {
    console.error("Error in getOfferFiles:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

// Download offer file
export const downloadOfferFile: RequestHandler = (req, res) => {
  try {
    const { fileId } = req.params;
    
    db.get(`
      SELECT file_name, file_data, mime_type
      FROM offer_files
      WHERE id = ?
    `, [fileId], (err, row) => {
      if (err) {
        console.error("Error fetching file:", err);
        return res.status(500).json({ 
          success: false,
          message: "Error fetching file" 
        });
      }

      if (!row) {
        return res.status(404).json({ 
          success: false,
          message: "File not found" 
        });
      }

      res.setHeader('Content-Disposition', `attachment; filename="${row.file_name}"`);
      res.setHeader('Content-Type', row.mime_type);
      res.send(row.file_data);
    });
  } catch (error) {
    console.error("Error in downloadOfferFile:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};