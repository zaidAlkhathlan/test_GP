// Simple test script to create SQLite database and insert test data
const path = require('path');
const fs = require('fs');

// Create data directory if it doesn't exist
const dataDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log('Created data directory');
}

const dbPath = path.join(dataDir, "app.db");

try {
  const sqlite3 = require("sqlite3").verbose();
  const db = new sqlite3.Database(dbPath);
  
  console.log("SQLite database connected successfully!");
  console.log("Database path:", dbPath);
  
  // Create the Buyer table
  const createTable = `
    CREATE TABLE IF NOT EXISTS Buyer (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      commercial_registration_number TEXT NOT NULL,
      commercial_phone_number TEXT NOT NULL,
      industry TEXT NOT NULL,
      company_name TEXT NOT NULL,
      city TEXT NOT NULL,
      logo TEXT,
      account_name TEXT NOT NULL,
      account_email TEXT NOT NULL,
      account_phone TEXT NOT NULL,
      account_password TEXT NOT NULL,
      licenses TEXT,
      certificates TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME
    );
  `;
  
  db.serialize(() => {
    db.run(createTable, (err) => {
      if (err) {
        console.error('Error creating table:', err);
        return;
      }
      console.log('Buyer table created successfully');
      
      // Insert test data
      const insertStmt = db.prepare(`
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
      
      const testBuyers = [
        {
          commercial_registration_number: "CR123456789",
          commercial_phone_number: "+966501234567",
          industry: "Technology",
          company_name: "Tech Solutions Ltd",
          city: "Riyadh",
          logo: null,
          account_name: "Ahmed Al-Rashid",
          account_email: "ahmed@techsolutions.com",
          account_phone: "+966501234567",
          account_password: "password123",
          licenses: "IT License 2024",
          certificates: "ISO 9001:2015"
        },
        {
          commercial_registration_number: "CR987654321",
          commercial_phone_number: "+966507654321",
          industry: "Construction",
          company_name: "Building Masters Co",
          city: "Jeddah",
          logo: null,
          account_name: "Fatima Al-Zahra",
          account_email: "fatima@buildingmasters.com",
          account_phone: "+966507654321",
          account_password: "password456",
          licenses: "Construction License 2024",
          certificates: "Safety Certificate 2024"
        }
      ];
      
      testBuyers.forEach((buyer, index) => {
        insertStmt.run(
          buyer.commercial_registration_number,
          buyer.commercial_phone_number,
          buyer.industry,
          buyer.company_name,
          buyer.city,
          buyer.logo,
          buyer.account_name,
          buyer.account_email,
          buyer.account_phone,
          buyer.account_password,
          buyer.licenses,
          buyer.certificates,
          function(err) {
            if (err) {
              console.error(`Error inserting buyer ${index + 1}:`, err);
            } else {
              console.log(`✓ Inserted buyer ${index + 1}: ${buyer.company_name} (ID: ${this.lastID})`);
            }
          }
        );
      });
      
      insertStmt.finalize();
      
      // Query to verify data was inserted
      setTimeout(() => {
        db.all("SELECT id, company_name, account_email, city FROM Buyer", (err, rows) => {
          if (err) {
            console.error('Error querying data:', err);
          } else {
            console.log('\n--- Current Buyers in Database ---');
            rows.forEach(row => {
              console.log(`ID: ${row.id}, Company: ${row.company_name}, Email: ${row.account_email}, City: ${row.city}`);
            });
          }
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err);
            } else {
              console.log('\nDatabase connection closed successfully');
            }
          });
        });
      }, 1000);
    });
  });
  
} catch (err) {
  console.error("SQLite3 not available:", err.message);
  console.log("You may need to install Python and Visual Studio Build Tools for native bindings to work on Windows");
}