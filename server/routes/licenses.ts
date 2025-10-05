import { RequestHandler } from "express";
import { db } from '../db';

export interface License {
  id: number;
  code: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  created_at: string;
}

// Get all licenses
export const getLicenses: RequestHandler = (req, res) => {
  try {
    // First try the new licenses table, fall back to Licenses table
    db.all(`
      SELECT * FROM licenses 
      ORDER BY name_ar
    `, [], (err, licenses) => {
      if (err) {
        // Try the original Licenses table
        db.all(`
          SELECT ID as id, Name as code, Name as name_ar, Name as name_en 
          FROM Licenses 
          ORDER BY Name
        `, [], (err2, licensesFromOld) => {
          if (err2) {
            console.error('Error fetching licenses from both tables:', err, err2);
            res.status(500).json({ error: 'خطأ في الخادم' });
            return;
          }

          res.json(licensesFromOld || []);
        });
        return;
      }

      res.json(licenses || []);
    });
  } catch (error) {
    console.error('Error fetching licenses:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
};

// Get license by code
export const getLicenseByCode: RequestHandler = (req, res) => {
  try {
    const { code } = req.params;
    
    // First try the new licenses table, fall back to Licenses table  
    db.get(`
      SELECT * FROM licenses 
      WHERE code = ?
    `, [code], (err, license) => {
      if (err) {
        // Try the original Licenses table
        db.get(`
          SELECT ID as id, Name as code, Name as name_ar, Name as name_en 
          FROM Licenses 
          WHERE Name = ? OR ID = ?
        `, [code, parseInt(code) || 0], (err2, licenseFromOld) => {
          if (err2) {
            console.error('Error fetching license from both tables:', err, err2);
            res.status(500).json({ error: 'خطأ في الخادم' });
            return;
          }

          if (!licenseFromOld) {
            return res.status(404).json({ error: 'الرخصة غير موجودة' });
          }

          res.json(licenseFromOld);
        });
        return;
      }

      if (!license) {
        return res.status(404).json({ error: 'الرخصة غير موجودة' });
      }

      res.json(license);
    });
  } catch (error) {
    console.error('Error fetching license:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
};