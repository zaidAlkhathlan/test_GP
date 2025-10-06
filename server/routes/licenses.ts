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
    // Try the Licenses table first (this is what we have)
    db.all(`
      SELECT ID as id, Name as name 
      FROM Licenses 
      ORDER BY Name
    `, [], (err, licenses) => {
      if (err) {
        console.error('Error fetching licenses from database:', err);
        res.status(500).json({ error: 'خطأ في الخادم' });
        return;
      }

      // Transform database results to match frontend expectations
      const transformedLicenses = (licenses || []).map((license: any) => ({
        id: license.id,
        code: license.name, // Use name as code for simplicity
        name_ar: license.name, // Use the name for both Arabic and English
        name_en: license.name,
        category: 'general' // Default category
      }));

      res.json(transformedLicenses);
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
    
    db.get(`
      SELECT ID as id, Name as name 
      FROM Licenses 
      WHERE Name = ? OR ID = ?
    `, [code, parseInt(code) || 0], (err, license) => {
      if (err) {
        console.error('Error fetching license from database:', err);
        res.status(500).json({ error: 'خطأ في الخادم' });
        return;
      }

      if (!license) {
        return res.status(404).json({ error: 'الرخصة غير موجودة' });
      }

      // Transform database result to match frontend expectations
      const transformedLicense = {
        id: license.id,
        code: license.name,
        name_ar: license.name,
        name_en: license.name,
        category: 'general'
      };

      res.json(transformedLicense);
    });
  } catch (error) {
    console.error('Error fetching license:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
};