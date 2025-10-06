import { RequestHandler } from "express";
import { db } from "../db";

// Get buyer licenses
export const getBuyerLicenses: RequestHandler = (req, res) => {
  const { id } = req.params;

  const statement = `
    SELECT l.ID as id, l.Name as name, l.name_ar, l.name_en, l.description_ar, l.description_en, l.category
    FROM Licenses l
    INNER JOIN Buyer_Licenses bl ON l.ID = bl.license_id
    WHERE bl.buyer_id = ?
  `;

  db.all(statement, [id], (err, licenses) => {
    if (err) {
      console.error('❌ Error fetching buyer licenses:', err);
      return res.status(500).json({ error: 'Failed to fetch buyer licenses' });
    }

    console.log(`✅ Found ${licenses?.length || 0} licenses for buyer ${id}`);
    res.json(licenses || []);
  });
};

// Get buyer certificates
export const getBuyerCertificates: RequestHandler = (req, res) => {
  const { id } = req.params;

  const statement = `
    SELECT c.ID as id, c.Name as name
    FROM Certificates c
    INNER JOIN Buyer_Certificates bc ON c.ID = bc.certificate_id
    WHERE bc.buyer_id = ?
  `;

  db.all(statement, [id], (err, certificates) => {
    if (err) {
      console.error('❌ Error fetching buyer certificates:', err);
      return res.status(500).json({ error: 'Failed to fetch buyer certificates' });
    }

    console.log(`✅ Found ${certificates?.length || 0} certificates for buyer ${id}`);
    res.json(certificates || []);
  });
};

// Get supplier licenses (from JSON field)
export const getSupplierLicenses: RequestHandler = (req, res) => {
  const { id } = req.params;

  const statement = `SELECT licenses FROM Supplier WHERE id = ?`;
  
  db.get(statement, [id], (err, result: { licenses?: string } | undefined) => {
    if (err) {
      console.error('❌ Error fetching supplier:', err);
      return res.status(500).json({ error: 'Failed to fetch supplier licenses' });
    }

    if (!result) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    if (!result.licenses) {
      return res.json([]);
    }

    try {
      // Parse the JSON string to get license IDs
      const licenseIds = JSON.parse(result.licenses);
      
      if (!Array.isArray(licenseIds) || licenseIds.length === 0) {
        return res.json([]);
      }

      const placeholders = licenseIds.map(() => '?').join(',');
      const licenseStatement = `
        SELECT ID as id, Name as name, name_ar, name_en, description_ar, description_en, category
        FROM Licenses 
        WHERE ID IN (${placeholders})
      `;
      
      db.all(licenseStatement, licenseIds, (licenseErr, licenses) => {
        if (licenseErr) {
          console.error('❌ Error fetching licenses:', licenseErr);
          return res.status(500).json({ error: 'Failed to fetch supplier licenses' });
        }

        console.log(`✅ Found ${licenses?.length || 0} licenses for supplier ${id}`);
        res.json(licenses || []);
      });
    } catch (parseError) {
      console.error('Error parsing supplier licenses JSON:', parseError);
      res.json([]);
    }
  });
};

// Get supplier certificates (from JSON field)
export const getSupplierCertificates: RequestHandler = (req, res) => {
  const { id } = req.params;

  const statement = `SELECT certificates FROM Supplier WHERE id = ?`;
  
  db.get(statement, [id], (err, result: { certificates?: string } | undefined) => {
    if (err) {
      console.error('❌ Error fetching supplier:', err);
      return res.status(500).json({ error: 'Failed to fetch supplier certificates' });
    }

    if (!result) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    if (!result.certificates) {
      return res.json([]);
    }

    try {
      // Parse the JSON string to get certificate IDs
      const certificateIds = JSON.parse(result.certificates);
      
      if (!Array.isArray(certificateIds) || certificateIds.length === 0) {
        return res.json([]);
      }

      const placeholders = certificateIds.map(() => '?').join(',');
      const certificateStatement = `
        SELECT ID as id, Name as name
        FROM Certificates 
        WHERE ID IN (${placeholders})
      `;
      
      db.all(certificateStatement, certificateIds, (certificateErr, certificates) => {
        if (certificateErr) {
          console.error('❌ Error fetching certificates:', certificateErr);
          return res.status(500).json({ error: 'Failed to fetch supplier certificates' });
        }

        console.log(`✅ Found ${certificates?.length || 0} certificates for supplier ${id}`);
        res.json(certificates || []);
      });
    } catch (parseError) {
      console.error('Error parsing supplier certificates JSON:', parseError);
      res.json([]);
    }
  });
};

// Add license to buyer
export const addBuyerLicense: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { licenseId } = req.body;

  if (!licenseId) {
    return res.status(400).json({ error: 'License ID is required' });
  }

  // Check if relationship already exists
  const checkStatement = `SELECT 1 FROM Buyer_Licenses WHERE buyer_id = ? AND license_id = ?`;
  db.get(checkStatement, [id, licenseId], (err, existing) => {
    if (err) {
      console.error('❌ Error checking existing license:', err);
      return res.status(500).json({ error: 'Failed to check existing license' });
    }

    if (existing) {
      return res.status(409).json({ error: 'License already added to this buyer' });
    }

    // Add the license
    const insertStatement = `INSERT INTO Buyer_Licenses (buyer_id, license_id) VALUES (?, ?)`;
    db.run(insertStatement, [id, licenseId], function(insertErr) {
      if (insertErr) {
        console.error('❌ Error adding buyer license:', insertErr);
        return res.status(500).json({ error: 'Failed to add license' });
      }

      console.log(`✅ Added license ${licenseId} to buyer ${id}`);
      res.json({ success: true, message: 'License added successfully' });
    });
  });
};

// Remove license from buyer
export const removeBuyerLicense: RequestHandler = (req, res) => {
  const { id, licenseId } = req.params;

  const deleteStatement = `DELETE FROM Buyer_Licenses WHERE buyer_id = ? AND license_id = ?`;
  db.run(deleteStatement, [id, licenseId], function(err) {
    if (err) {
      console.error('❌ Error removing buyer license:', err);
      return res.status(500).json({ error: 'Failed to remove license' });
    }

    console.log(`✅ Removed license ${licenseId} from buyer ${id}`);
    res.json({ success: true, message: 'License removed successfully' });
  });
};

// Add certificate to buyer
export const addBuyerCertificate: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { certificateId } = req.body;

  if (!certificateId) {
    return res.status(400).json({ error: 'Certificate ID is required' });
  }

  // Check if relationship already exists
  const checkStatement = `SELECT 1 FROM Buyer_Certificates WHERE buyer_id = ? AND certificate_id = ?`;
  db.get(checkStatement, [id, certificateId], (err, existing) => {
    if (err) {
      console.error('❌ Error checking existing certificate:', err);
      return res.status(500).json({ error: 'Failed to check existing certificate' });
    }

    if (existing) {
      return res.status(409).json({ error: 'Certificate already added to this buyer' });
    }

    // Add the certificate
    const insertStatement = `INSERT INTO Buyer_Certificates (buyer_id, certificate_id) VALUES (?, ?)`;
    db.run(insertStatement, [id, certificateId], function(insertErr) {
      if (insertErr) {
        console.error('❌ Error adding buyer certificate:', insertErr);
        return res.status(500).json({ error: 'Failed to add certificate' });
      }

      console.log(`✅ Added certificate ${certificateId} to buyer ${id}`);
      res.json({ success: true, message: 'Certificate added successfully' });
    });
  });
};

// Remove certificate from buyer
export const removeBuyerCertificate: RequestHandler = (req, res) => {
  const { id, certificateId } = req.params;

  const deleteStatement = `DELETE FROM Buyer_Certificates WHERE buyer_id = ? AND certificate_id = ?`;
  db.run(deleteStatement, [id, certificateId], function(err) {
    if (err) {
      console.error('❌ Error removing buyer certificate:', err);
      return res.status(500).json({ error: 'Failed to remove certificate' });
    }

    console.log(`✅ Removed certificate ${certificateId} from buyer ${id}`);
    res.json({ success: true, message: 'Certificate removed successfully' });
  });
};

// Get all available licenses (for selection)
export const getAllAvailableLicenses: RequestHandler = (req, res) => {
  const statement = `SELECT ID as id, Name as name, name_ar, name_en, category FROM Licenses ORDER BY Name`;
  
  db.all(statement, [], (err, licenses) => {
    if (err) {
      console.error('❌ Error fetching all licenses:', err);
      return res.status(500).json({ error: 'Failed to fetch licenses' });
    }

    res.json(licenses || []);
  });
};

// Get all available certificates (for selection)
export const getAllAvailableCertificates: RequestHandler = (req, res) => {
  const statement = `SELECT ID as id, Name as name FROM Certificates ORDER BY Name`;
  
  db.all(statement, [], (err, certificates) => {
    if (err) {
      console.error('❌ Error fetching all certificates:', err);
      return res.status(500).json({ error: 'Failed to fetch certificates' });
    }

    res.json(certificates || []);
  });
};