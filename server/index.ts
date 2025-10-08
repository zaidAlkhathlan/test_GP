import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { handleDemo } from "./routes/demo";
import { initDatabase } from "./db";
import { createBuyer } from "./routes/buyers";
import { loginBuyer } from "./routes/buyer-auth";
import { loginSupplier } from "./routes/supplier-auth";
import { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier } from "./routes/suppliers";
import { listInquiriesForTender, createInquiry, answerInquiry } from './routes/inquiries';
import { getDomains, getSubDomainsByDomain, getAllSubDomains } from './routes/domains';
import { getTenders, getTenderById, createTender, updateTender, deleteTender, getTendersByDomain, downloadTenderFile1, downloadTenderFile2 } from './routes/tenders';
import { submitOfferWithFiles, getOffersByTender, getOffersBySupplier, getOfferFiles, downloadOfferFile } from './routes/offers';
import { getLicenses, getLicenseByCode } from './routes/licenses';
import { getAllCertificates, getCertificateByCode } from './routes/certificates';
import { 
  getBuyerLicenses, 
  getBuyerCertificates, 
  getSupplierLicenses, 
  getSupplierCertificates,
  addBuyerLicense,
  removeBuyerLicense,
  addBuyerCertificate,
  removeBuyerCertificate,
  getAllAvailableLicenses,
  getAllAvailableCertificates
} from './routes/company-profile';

// Configure multer for file uploads (store in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow PDF, Word, and common image formats
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word documents, and images are allowed.'));
    }
  }
});

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  
  // Mount routes first, initialize DB in background
  app.post("/api/buyers", createBuyer);
  app.post("/api/auth/login", loginBuyer);
  app.post("/api/auth/supplier/login", loginSupplier);
  
  // Supplier routes
  app.post("/api/suppliers", createSupplier);
  app.get("/api/suppliers", getSuppliers);
  app.get("/api/suppliers/:id", getSupplierById);
  app.put("/api/suppliers/:id", updateSupplier);
  app.delete("/api/suppliers/:id", deleteSupplier);
  
  // Domain routes
  app.get("/api/domains", getDomains);
  app.get("/api/domains/:domainId/sub-domains", getSubDomainsByDomain);
  app.get("/api/sub-domains", getAllSubDomains);
  
  // Tender routes
  app.get('/api/tenders', getTenders);
  app.get('/api/tenders/:id', getTenderById);
  app.get('/api/tenders/:id/file1', downloadTenderFile1);
  app.get('/api/tenders/:id/file2', downloadTenderFile2);
  app.post('/api/tenders', upload.fields([
    { name: 'file1', maxCount: 1 },
    { name: 'file2', maxCount: 1 }
  ]), createTender);
  app.put('/api/tenders/:id', updateTender);
  app.delete('/api/tenders/:id', deleteTender);
  app.get('/api/domains/:domainId/tenders', getTendersByDomain);
  
  // Offers routes
  app.post('/api/tenders/:tenderId/offers', submitOfferWithFiles);
  app.get('/api/tenders/:tenderId/offers', getOffersByTender);
  app.get('/api/suppliers/:supplierId/offers', getOffersBySupplier);
  app.get('/api/offers/:offerId/files', getOfferFiles);
  app.get('/api/offers/files/:fileId/download', downloadOfferFile);
  
  // Inquiries routes
  app.get('/api/tenders/:id/inquiries', listInquiriesForTender);
  app.post('/api/tenders/:id/inquiries', createInquiry);
  app.post('/api/inquiries/:id/answer', answerInquiry);
  
  // License routes
  app.get('/api/licenses', getLicenses);
  app.get('/api/licenses/:code', getLicenseByCode);
  
  // Certificate routes
  app.get('/api/certificates', getAllCertificates);
  app.get('/api/certificates/:code', getCertificateByCode);

  // Company profile routes
  app.get('/api/buyers/:id/licenses', getBuyerLicenses);
  app.get('/api/buyers/:id/certificates', getBuyerCertificates);
  app.get('/api/suppliers/:id/licenses', getSupplierLicenses);
  app.get('/api/suppliers/:id/certificates', getSupplierCertificates);
  
  // Add/remove licenses and certificates
  app.post('/api/buyers/:id/licenses', addBuyerLicense);
  app.delete('/api/buyers/:id/licenses/:licenseId', removeBuyerLicense);
  app.post('/api/buyers/:id/certificates', addBuyerCertificate);
  app.delete('/api/buyers/:id/certificates/:certificateId', removeBuyerCertificate);
  
  // Get all available licenses and certificates for selection
  app.get('/api/available-licenses', getAllAvailableLicenses);
  app.get('/api/available-certificates', getAllAvailableCertificates);
  
  // Initialize DB in background
  initDatabase().catch((error) => {
    console.error("Failed to initialize database:", error);
  });

  return app;
}
