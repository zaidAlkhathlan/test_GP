import { RequestHandler } from "express";
import { db } from "../db";
import { Buyer } from "@shared/api";

export const createBuyer: RequestHandler = (req, res) => {
  const b: Buyer = req.body;

  const stmt = db.prepare(`
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
  `);

  stmt.run(
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
    b.certificates || null,
    function (this: any, err: Error | null) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create buyer" });
        return;
      }
      const id = this.lastID as number;
      db.get("SELECT * FROM Buyer WHERE id = ?", [id], (err2, row: any) => {
        if (err2) {
          res.status(500).json({ error: "Failed to fetch created buyer" });
          return;
        }
        if (row) {
          // Do not return the stored password
          delete row.account_password;
        }
        res.status(201).json(row);
      });
    }
  );
  stmt.finalize();
};
