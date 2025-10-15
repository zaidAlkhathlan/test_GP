import { RequestHandler } from "express";
import { db } from "../db";

// Create new supplier
export const createSupplier: RequestHandler = (req, res) => {
  const {
    commercial_registration_number,
    commercial_phone_number,
    domains_id,
    city_id,
    logo,
    account_name,
    account_email,
    account_phone,
    company_name,
    account_password,
    sub_domains = [],
    licenses = [],
    certificates = []
  } = req.body;

  // Validate required fields
  if (!commercial_registration_number || !commercial_phone_number || !domains_id || 
      !city_id || !logo || !account_name || !account_email || !account_phone || 
      !company_name || !account_password) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const currentTime = new Date().toISOString();

  // Insert supplier
  db.run(
    `INSERT INTO Supplier (
      Commercial_registration_number, Commercial_Phone_number, domains_id, 
      created_at, city_id, updated_at, Logo, Account_name, Account_email, 
      Account_phone, company_name, Account_password
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      commercial_registration_number,
      commercial_phone_number,
      domains_id,
      currentTime,
      city_id,
      currentTime,
      logo,
      account_name,
      account_email,
      account_phone,
      company_name,
      account_password
    ],
    function(err) {
      if (err) {
        console.error("Error creating supplier:", err);
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(400).json({ error: "Email already exists" });
        } else {
          res.status(500).json({ error: "Failed to create supplier" });
        }
        return;
      }

      const supplierId = this.lastID;

      // Handle sub-domains associations
      let completedOperations = 0;
      const totalOperations = sub_domains.length + licenses.length + certificates.length;

      const checkCompletion = () => {
        completedOperations++;
        if (completedOperations === totalOperations) {
          res.status(201).json({
            success: true,
            supplier: {
              id: supplierId,
              account_name,
              company_name,
              account_email
            }
          });
        }
      };

      // If no additional operations needed
      if (totalOperations === 0) {
        res.status(201).json({
          success: true,
          supplier: {
            id: supplierId,
            account_name,
            company_name,
            account_email
          }
        });
        return;
      }

      // Insert supplier sub-domains
      sub_domains.forEach((subDomainId: number) => {
        // Get sub-domain name
        db.get("SELECT Name FROM sub_domains WHERE ID = ?", [subDomainId], (err, row) => {
          if (!err && row) {
            db.run(
              "INSERT INTO supplier_sub_domains (supplier_id, sub_domains_id, Name) VALUES (?, ?, ?)",
              [supplierId, subDomainId, row.Name],
              (err) => {
                if (err) console.error("Error inserting supplier sub-domain:", err);
                checkCompletion();
              }
            );
          } else {
            checkCompletion();
          }
        });
      });

      // Insert supplier licenses
      licenses.forEach((licenseId: number) => {
        db.run(
          "INSERT INTO Supplier_Licenses (supplier_id, license_id) VALUES (?, ?)",
          [supplierId, licenseId],
          (err) => {
            if (err) console.error("Error inserting supplier license:", err);
            checkCompletion();
          }
        );
      });

      // Insert supplier certificates
      certificates.forEach((certificateId: number) => {
        db.run(
          "INSERT INTO Supplier_Certificates (supplier_id, certificate_id) VALUES (?, ?)",
          [supplierId, certificateId],
          (err) => {
            if (err) console.error("Error inserting supplier certificate:", err);
            checkCompletion();
          }
        );
      });
    }
  );
};

// Get all suppliers
export const getSuppliers: RequestHandler = (req, res) => {
  db.all(
    `SELECT 
      s.*,
      d.Name as domain_name,
      c.name as city_name,
      r.name as region_name
     FROM Supplier s
     LEFT JOIN domains d ON s.domains_id = d.ID
     LEFT JOIN City c ON s.city_id = c.id
     LEFT JOIN Region r ON c.region_id = r.id
     ORDER BY s.created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error("Error fetching suppliers:", err);
        res.status(500).json({ error: "Failed to fetch suppliers" });
        return;
      }

      res.json({ suppliers: rows || [] });
    }
  );
};

// Get supplier by ID
export const getSupplierById: RequestHandler = (req, res) => {
  const { id } = req.params;

  db.get(
    `SELECT 
      s.*,
      d.Name as domain_name,
      c.name as city_name,
      r.name as region_name
     FROM Supplier s
     LEFT JOIN domains d ON s.domains_id = d.ID
     LEFT JOIN City c ON s.city_id = c.id
     LEFT JOIN Region r ON c.region_id = r.id
     WHERE s.ID = ?`,
    [id],
    (err, row) => {
      if (err) {
        console.error("Error fetching supplier:", err);
        res.status(500).json({ error: "Failed to fetch supplier" });
        return;
      }

      if (!row) {
        res.status(404).json({ error: "Supplier not found" });
        return;
      }

      // Get supplier's sub-domains
      db.all(
        `SELECT ssd.*, sd.Name 
         FROM supplier_sub_domains ssd
         JOIN sub_domains sd ON ssd.sub_domains_id = sd.ID
         WHERE ssd.supplier_id = ?`,
        [id],
        (err, subDomains) => {
          if (err) {
            console.error("Error fetching supplier sub-domains:", err);
            res.status(500).json({ error: "Failed to fetch supplier details" });
            return;
          }

          // Get supplier's licenses
          db.all(
            `SELECT sl.*, l.Name 
             FROM Supplier_Licenses sl
             JOIN Licenses l ON sl.license_id = l.ID
             WHERE sl.supplier_id = ?`,
            [id],
            (err, licenses) => {
              if (err) {
                console.error("Error fetching supplier licenses:", err);
                res.status(500).json({ error: "Failed to fetch supplier details" });
                return;
              }

              // Get supplier's certificates
              db.all(
                `SELECT sc.*, c.Name 
                 FROM Supplier_Certificates sc
                 JOIN Certificates c ON sc.certificate_id = c.ID
                 WHERE sc.supplier_id = ?`,
                [id],
                (err, certificates) => {
                  if (err) {
                    console.error("Error fetching supplier certificates:", err);
                    res.status(500).json({ error: "Failed to fetch supplier details" });
                    return;
                  }

                  res.json({
                    supplier: row,
                    subDomains: subDomains || [],
                    licenses: licenses || [],
                    certificates: certificates || []
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

// Update supplier
export const updateSupplier: RequestHandler = (req, res) => {
  console.log("🔵 updateSupplier endpoint called");
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
  
  const { id } = req.params;
  const updateData = req.body;

  // Build dynamic SQL update query
  const allowedFields = [
    'Commercial_registration_number',
    'Commercial_Phone_number',
    'domains_id',
    'city_id',
    'Logo',
    'Account_name',
    'Account_email',
    'Account_phone',
    'company_name',
    'industry'
  ];

  const fieldsToUpdate = Object.keys(updateData).filter(key => {
    // Map frontend field names to database field names
    const dbFieldMap: { [key: string]: string } = {
      'commercial_registration_number': 'Commercial_registration_number',
      'commercial_phone_number': 'Commercial_Phone_number',
      'city_id': 'city_id',
      'logo': 'Logo',
      'account_name': 'Account_name',
      'account_email': 'Account_email',
      'account_phone': 'Account_phone',
      'company_name': 'company_name',
      'industry': 'industry'
    };
    
    const dbField = dbFieldMap[key] || key;
    return allowedFields.includes(dbField);
  });
  
  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  // Map field names and prepare values
  const setClause = fieldsToUpdate.map(field => {
    const dbFieldMap: { [key: string]: string } = {
      'commercial_registration_number': 'Commercial_registration_number',
      'commercial_phone_number': 'Commercial_Phone_number',
      'city': 'City',
      'logo': 'Logo',
      'account_name': 'Account_name',
      'account_email': 'Account_email',
      'account_phone': 'Account_phone',
      'company_name': 'company_name',
      'industry': 'industry'
    };
    
    const dbField = dbFieldMap[field] || field;
    return `${dbField} = ?`;
  }).join(', ');

  const values = fieldsToUpdate.map(field => updateData[field]);
  values.push(new Date().toISOString()); // Add updated_at
  values.push(id); // Add id for WHERE clause

  const sql = `UPDATE Supplier SET ${setClause}, updated_at = ? WHERE ID = ?`;
  
  console.log("🗄️ Attempting to update supplier in database...");
  console.log("📝 SQL:", sql);
  console.log("📊 Values:", values);

  db.run(sql, values, function(err) {
    if (err) {
      console.error("❌ Database update error:", err);
      if (err.message && err.message.includes('UNIQUE constraint failed')) {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Failed to update supplier" });
      }
      return;
    }

    if (this.changes === 0) {
      console.log("❌ No supplier found with ID:", id);
      res.status(404).json({ error: "Supplier not found" });
      return;
    }

    console.log("✅ Supplier updated successfully");
    
    // Return updated supplier data
    db.get("SELECT * FROM Supplier WHERE ID = ?", [id], (err: Error | null, row: any) => {
      if (err) {
        console.error("❌ Error fetching updated supplier:", err);
        res.status(500).json({ error: "Failed to fetch updated supplier" });
        return;
      }
      
      if (row) {
        // Do not return the stored password
        delete row.Account_password;
      }
      
      console.log("📤 Sending updated supplier response:", row);
      res.json(row);
    });
  });
};

// Delete supplier
export const deleteSupplier: RequestHandler = (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM Supplier WHERE ID = ?", [id], function(err) {
    if (err) {
      console.error("Error deleting supplier:", err);
      res.status(500).json({ error: "Failed to delete supplier" });
      return;
    }

    if (this.changes === 0) {
      res.status(404).json({ error: "Supplier not found" });
      return;
    }

    res.json({ success: true, message: "Supplier deleted successfully" });
  });
};