import path from "path";
import fs from "fs";

async function testTenderRelationships() {
  console.log('🧪 Testing tender relationships in database...');
  
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
    
    // Check tender_licenses table
    const licensesResult = db.exec("SELECT * FROM tender_licenses");
    if (licensesResult[0]) {
      const relationships = licensesResult[0].values;
      console.log(`\n📋 Found ${relationships.length} tender-license relationships:`);
      console.log('─'.repeat(60));
      
      relationships.forEach(([tenderId, licenseId]) => {
        console.log(`Tender ${tenderId} -> License ${licenseId}`);
      });
    } else {
      console.log("📋 No tender-license relationships found");
    }
    
    // Check tender_certificates table
    const certificatesResult = db.exec("SELECT * FROM tender_certificates");
    if (certificatesResult[0]) {
      const relationships = certificatesResult[0].values;
      console.log(`\n📜 Found ${relationships.length} tender-certificate relationships:`);
      console.log('─'.repeat(60));
      
      relationships.forEach(([tenderId, certificateId]) => {
        console.log(`Tender ${tenderId} -> Certificate ${certificateId}`);
      });
    } else {
      console.log("📜 No tender-certificate relationships found");
    }
    
    // Check tender_sub_domains table
    const subDomainsResult = db.exec("SELECT * FROM tender_sub_domains");
    if (subDomainsResult[0]) {
      const relationships = subDomainsResult[0].values;
      console.log(`\n🏢 Found ${relationships.length} tender-subdomain relationships:`);
      console.log('─'.repeat(60));
      
      relationships.slice(0, 5).forEach(([tenderId, subDomainId]) => {
        console.log(`Tender ${tenderId} -> SubDomain ${subDomainId}`);
      });
      if (relationships.length > 5) {
        console.log(`... and ${relationships.length - 5} more`);
      }
    } else {
      console.log("🏢 No tender-subdomain relationships found");
    }
    
    // Get a detailed view of a tender with all its relationships
    const tenderDetailResult = db.exec(`
      SELECT 
        t.id, 
        t.title,
        COUNT(DISTINCT tl.license_id) as license_count,
        COUNT(DISTINCT tc.certificate_id) as certificate_count,
        COUNT(DISTINCT tsd.sub_domain_id) as subdomain_count
      FROM tender t
      LEFT JOIN tender_licenses tl ON t.id = tl.tender_id
      LEFT JOIN tender_certificates tc ON t.id = tc.tender_id  
      LEFT JOIN tender_sub_domains tsd ON t.id = tsd.tender_id
      GROUP BY t.id, t.title
      ORDER BY t.id DESC
      LIMIT 5
    `);
    
    if (tenderDetailResult[0]) {
      const tenders = tenderDetailResult[0].values;
      console.log(`\n📊 Recent tenders with relationship counts:`);
      console.log('─'.repeat(80));
      
      tenders.forEach(([id, title, licenseCount, certCount, subdomainCount]) => {
        console.log(`${String(id).padStart(3, ' ')}. ${String(title).slice(0, 40).padEnd(40, ' ')} | L:${licenseCount} C:${certCount} S:${subdomainCount}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error testing tender relationships:', error);
  }
}

// Run the test
testTenderRelationships();