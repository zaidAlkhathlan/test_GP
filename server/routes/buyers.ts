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
