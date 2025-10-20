import { RequestHandler } from 'express';
import { db } from '../db';

export interface Certificate {
  id: number;
  code: string;
  name_ar: string;
  name_en: string;
  category?: string;
}

export const getAllCertificates: RequestHandler = (req, res) => {
  try {
    db.all(`
      SELECT ID as id, Name as name 
      FROM Certificates 
      ORDER BY Name
    `, [], (err, certificates) => {
      if (err) {
        console.error('Error fetching certificates from database:', err);
        res.status(500).json({ error: 'Failed to fetch certificates' });
        return;
      }

      // Transform database results to match frontend expectations
      const transformedCertificates = (certificates || []).map((cert: any) => ({
        id: cert.id,
        code: cert.name, // Use name as code for simplicity
        name_ar: cert.name, // Use the name for both Arabic and English
        name_en: cert.name,
        category: 'general' // Default category
      }));

      res.json(transformedCertificates);
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
};

export const getCertificateByCode: RequestHandler = (req, res) => {
  try {
    const { code } = req.params;
    
    db.get(`
      SELECT ID as id, Name as name 
      FROM Certificates 
      WHERE Name = ? OR ID = ?
    `, [code, parseInt(code) || 0], (err, certificate) => {
      if (err) {
        console.error('Error fetching certificate from database:', err);
        res.status(500).json({ error: 'Failed to fetch certificate' });
        return;
      }

      if (!certificate) {
        return res.status(404).json({ error: 'Certificate not found' });
      }

      // Transform database result to match frontend expectations
      const transformedCertificate = {
        id: certificate.id,
        code: certificate.name,
        name_ar: certificate.name,
        name_en: certificate.name,
        category: 'general'
      };

      res.json(transformedCertificate);
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    res.status(500).json({ error: 'Failed to fetch certificate' });
  }
};