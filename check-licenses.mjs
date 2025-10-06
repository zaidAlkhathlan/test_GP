import path from "path";
import fs from "fs";

async function checkLicenses() {
  console.log('🔍 Checking licenses in database...');
  
  try {
    console.log("🚀 Initializing database with sql.js...");
    
    // Dynamically import sql.js
    const initSqlJs = (await import("sql.js")).default;
    
    console.log("🔄 Initializing sql.js with WASM...");
    const SQL = await initSqlJs({
      locateFile: (file) => {
        return `node_modules/sql.js/dist/${file}`;
      }
    });

    // Load existing database
    const dataDir = path.resolve(process.cwd(), "data");
    const dbPath = path.join(dataDir, "app.db");

    let dbData;
    if (fs.existsSync(dbPath)) {
      dbData = fs.readFileSync(dbPath);
      console.log("📖 Loading database from", dbPath);
    } else {
      console.error("❌ Database file not found at", dbPath);
      return;
    }

    const db = new SQL.Database(dbData);
    
    // Check licenses
    const licenseResult = db.exec("SELECT * FROM Licenses");
    if (licenseResult[0]) {
      const licenses = licenseResult[0].values;
      console.log(`\n📋 Found ${licenses.length} licenses in database:`);
      console.log('─'.repeat(60));
      
      licenses.forEach(([id, name]) => {
        console.log(`${String(id).padStart(3, ' ')}. ${name}`);
      });
    } else {
      console.log("📋 No licenses found in database");
    }
    
    // Check certificates
    const certResult = db.exec("SELECT * FROM Certificates");
    if (certResult[0]) {
      const certificates = certResult[0].values;
      console.log(`\n📜 Found ${certificates.length} certificates in database:`);
      console.log('─'.repeat(60));
      
      certificates.forEach(([id, name]) => {
        console.log(`${String(id).padStart(3, ' ')}. ${name}`);
      });
    } else {
      console.log("📜 No certificates found in database");
    }
    
  } catch (error) {
    console.error('❌ Error checking licenses:', error);
  }
}

// Run the check
checkLicenses();