import path from "path";
import fs from "fs";

// List of certificates to seed
const certificates = [
  'ISO 9001',
  'ISO 14001',
  'ISO 45001',
  'ISO 27001',
  'ISO 50001',
  'ISO 22301',
  'ISO/IEC 17025',
  'ISO/IEC 17020',
  'CIDB Registration Certificate',
  'NEBOSH Certificate',
  'OSHA Compliance Certificate',
  'Environmental Impact Assessment (EIA) Approval',
  'Professional Engineer License',
  'Architect Registration Certificate',
  'PMP (Project Management Professional)',
  'PRINCE2 Certification',
  'Data Protection / GDPR Compliance Certificate',
  'SOC 2 Report',
  'Cyber Essentials Certificate',
  'First Aid Certificate',
  'Fire Safety Certificate',
  'Insurance Certificate – Public Liability',
  'Insurance Certificate – Professional Indemnity',
  'Bank Reference Letter',
  'Audited Financial Statements'
];

async function seedCertificates() {
  console.log('🚀 Starting certificate seeding process...');
  
  try {
    console.log("🚀 Initializing database with sql.js...");
    
    // Dynamically import sql.js
    const initSqlJs = (await import("sql.js")).default;
    
    console.log("🔄 Initializing sql.js with WASM...");
    const SQL = await initSqlJs({
      locateFile: (file) => {
        console.log("📁 Looking for sql.js file:", file);
        return `node_modules/sql.js/dist/${file}`;
      }
    });
    console.log("✅ SQL.js initialized successfully");

    // Load existing database
    const dataDir = path.resolve(process.cwd(), "data");
    const dbPath = path.join(dataDir, "app.db");

    let dbData;
    if (fs.existsSync(dbPath)) {
      dbData = fs.readFileSync(dbPath);
      console.log("📖 Loading existing database from", dbPath);
    } else {
      console.error("❌ Database file not found at", dbPath);
      return;
    }

    const db = new SQL.Database(dbData);
    
    // Check existing certificates
    const existingCerts = db.exec("SELECT * FROM Certificates");
    const existingNames = existingCerts[0] ? existingCerts[0].values.map(row => row[1]) : [];
    
    console.log(`📊 Found ${existingNames.length} existing certificates in database`);
    
    let insertedCount = 0;
    let skippedCount = 0;
    
    // Insert each certificate if it doesn't already exist
    certificates.forEach((certName) => {
      if (existingNames.includes(certName)) {
        console.log(`⏭️  Skipping "${certName}" - already exists`);
        skippedCount++;
      } else {
        try {
          db.run("INSERT INTO Certificates (Name) VALUES (?)", [certName]);
          console.log(`✅ Inserted certificate: "${certName}"`);
          insertedCount++;
        } catch (err) {
          console.error(`❌ Error inserting certificate "${certName}":`, err);
        }
      }
    });
    
    // Save database back to file
    const data = db.export();
    fs.writeFileSync(dbPath, data);
    console.log("💾 Database saved to file");
    
    console.log(`\n🎉 Certificate seeding completed!`);
    console.log(`📊 Summary:`);
    console.log(`   - Inserted: ${insertedCount} new certificates`);
    console.log(`   - Skipped: ${skippedCount} existing certificates`);
    console.log(`   - Total certificates in list: ${certificates.length}`);
    console.log(`   - Total certificates in database: ${existingNames.length + insertedCount}`);
    
  } catch (error) {
    console.error('❌ Error during certificate seeding:', error);
  }
}

// Run the seeding function
seedCertificates();