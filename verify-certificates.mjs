import path from "path";
import fs from "fs";

async function verifyCertificates() {
  console.log('🔍 Verifying certificates in database...');
  
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
    
    // Query all certificates
    const result = db.exec("SELECT ID, Name FROM Certificates ORDER BY ID");
    
    if (result && result[0]) {
      const certificates = result[0].values;
      console.log(`\n📋 Found ${certificates.length} certificates in database:`);
      console.log('─'.repeat(60));
      
      certificates.forEach(([id, name]) => {
        console.log(`${String(id).padStart(3, ' ')}. ${name}`);
      });
      
      console.log('─'.repeat(60));
      console.log(`✅ Total: ${certificates.length} certificates`);
    } else {
      console.log("📋 No certificates found in database");
    }
    
  } catch (error) {
    console.error('❌ Error verifying certificates:', error);
  }
}

// Run the verification
verifyCertificates();