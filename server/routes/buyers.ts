import { RequestHandler } from "express";
import { db } from "../db";
import { Buyer } from "@shared/api";

export const createBuyer: RequestHandler = (req, res) => {
  console.log("🔵 createBuyer endpoint called");
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
  
  const b: Buyer = req.body;

  // Use the run method with the database wrapper
  console.log("🗄️ Attempting to insert buyer into database...");
  
  db.run(`
    INSERT INTO Buyer (
      commercial_registration_number,
      commercial_phone_number,
      industry,
      company_name,
      city,
      logo,
      account_name,
      account_email,
      account_phone,
      account_password,
      licenses,
      certificates
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
  `, [
    b.commercial_registration_number,
    b.commercial_phone_number,
    b.industry,
    b.company_name,
    b.city,
    b.logo || null,
    b.account_name,
    b.account_email,
    b.account_phone,
    b.account_password,
    b.licenses || null,
    b.certificates || null
  ], function (this: any, err: Error | null) {
    if (err) {
      console.error("❌ Database insert error:", err);
      res.status(500).json({ error: "Failed to create buyer" });
      return;
    }
    
    const id = this.lastID;
    console.log("✅ Buyer inserted successfully with ID:", id);
    
    db.get("SELECT * FROM Buyer WHERE id = ?", [id], (err2: Error | null, row: any) => {
      if (err2) {
        console.error("❌ Database fetch error:", err2);
        res.status(500).json({ error: "Failed to fetch created buyer" });
        return;
      }
      
      console.log("📖 Retrieved buyer:", row);
      
      if (row) {
        // Do not return the stored password
        delete row.account_password;
      }
      
      console.log("📤 Sending response:", row);
      res.status(201).json(row);
    });
  });
};

// Update existing buyer
export const updateBuyer: RequestHandler = (req, res) => {
  console.log("🔵 updateBuyer endpoint called");
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
  
  const { id } = req.params;
  const updateData = req.body;

  // Build dynamic SQL update query
  const allowedFields = [
    'commercial_registration_number',
    'commercial_phone_number', 
    'industry',
    'company_name',
    'city',
    'logo',
    'account_name',
    'account_email',
    'account_phone'
  ];

  const fieldsToUpdate = Object.keys(updateData).filter(key => allowedFields.includes(key));
  
  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ');
  const values = fieldsToUpdate.map(field => updateData[field]);
  values.push(id); // Add id for WHERE clause

  const sql = `UPDATE Buyer SET ${setClause} WHERE ID = ?`;
  
  console.log("🗄️ Attempting to update buyer in database...");
  console.log("📝 SQL:", sql);
  console.log("📊 Values:", values);
  
  db.run(sql, values, function (this: any, err: Error | null) {
    if (err) {
      console.error("❌ Database update error:", err);
      res.status(500).json({ error: "Failed to update buyer" });
      return;
    }
    
    if (this.changes === 0) {
      console.log("❌ No buyer found with ID:", id);
      res.status(404).json({ error: "Buyer not found" });
      return;
    }

    console.log("✅ Buyer updated successfully");
    
    // Return updated buyer data
    db.get("SELECT * FROM Buyer WHERE ID = ?", [id], (err: Error | null, row: any) => {
      if (err) {
        console.error("❌ Error fetching updated buyer:", err);
        res.status(500).json({ error: "Failed to fetch updated buyer" });
        return;
      }
      
      if (row) {
        // Do not return the stored password
        delete row.account_password;
      }
      
      console.log("📤 Sending updated buyer response:", row);
      res.json(row);
    });
  });
};
