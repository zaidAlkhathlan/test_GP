import Database from 'sql.js';
import fs from 'fs';
import path from 'path';

async function createDatabase() {
  console.log("🏗️ Creating database with new schema...");
  
  try {
    // Initialize SQL.js
    const initSqlJs = (await import('sql.js')).default;
    const SQL = await initSqlJs();
    
    // Create new database
    const db = new SQL.Database();
    
    // Enable foreign keys
    db.run("PRAGMA foreign_keys = ON");
    
    // Create domains table
    db.run(`
      CREATE TABLE domains (
        ID INTEGER PRIMARY KEY,
        Name TEXT NOT NULL UNIQUE
      )
    `);
    
    // Create sub_domains table
    db.run(`
      CREATE TABLE sub_domains (
        ID INTEGER PRIMARY KEY,
        domain_id INTEGER NOT NULL,
        Name TEXT NOT NULL,
        FOREIGN KEY (domain_id) REFERENCES domains(ID)
      )
    `);
    
    // Create Buyer table
    db.run(`
      CREATE TABLE Buyer (
        ID INTEGER PRIMARY KEY,
        Commercial_registration_number TEXT NOT NULL,
        Commercial_Phone_number TEXT NOT NULL,
        domains_id INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL,
        City TEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        Logo TEXT,
        Account_name TEXT NOT NULL,
        Account_email TEXT NOT NULL,
        Account_phone INTEGER NOT NULL,
        company_name TEXT NOT NULL,
        Account_password TEXT NOT NULL,
        FOREIGN KEY (domains_id) REFERENCES domains(ID)
      )
    `);
    
    // Create Licenses table
    db.run(`
      CREATE TABLE Licenses (
        ID INTEGER PRIMARY KEY,
        Name TEXT NOT NULL UNIQUE
      )
    `);
    
    // Create Certificates table
    db.run(`
      CREATE TABLE Certificates (
        ID INTEGER PRIMARY KEY,
        Name TEXT NOT NULL UNIQUE
      )
    `);
    
    // Insert sample data
    console.log("🌱 Seeding sample data...");
    
    // Insert domains
    db.run("INSERT INTO domains (ID, Name) VALUES (1, 'تقنية المعلومات')");
    db.run("INSERT INTO domains (ID, Name) VALUES (2, 'البناء والإنشاءات')");
    db.run("INSERT INTO domains (ID, Name) VALUES (3, 'الخدمات الطبية')");
    
    // Insert sample buyer
    const now = new Date().toISOString();
    db.run(`INSERT INTO Buyer (
      ID, Commercial_registration_number, Commercial_Phone_number, domains_id,
      created_at, City, updated_at, Logo, Account_name, Account_email,
      Account_phone, company_name, Account_password
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      1, '1010123456', '+966112345678', 1, now, 'الرياض', now, null,
      'أحمد محمد العلي', 'ahmed.ali@techsolutions.sa', 966501234567,
      'Tech Solutions Ltd', 'hashed_password_123'
    ]);
    
    // Test queries
    console.log("🔍 Testing queries...");
    
    const domains = db.exec("SELECT * FROM domains");
    console.log("📊 Domains:", domains[0]?.values || []);
    
    const buyers = db.exec("SELECT * FROM Buyer");
    console.log("👤 Buyers:", buyers[0]?.values || []);
    
    // Save to file
    const dataDir = path.resolve(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }
    
    const dbPath = path.join(dataDir, "app.db");
    const data = db.export();
    fs.writeFileSync(dbPath, data);
    
    console.log("✅ Database created successfully at:", dbPath);
    console.log("🎉 Setup completed!");
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

createDatabase();