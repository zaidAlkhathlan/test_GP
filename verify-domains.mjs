import Database from 'sql.js';
import fs from 'fs';
import path from 'path';

async function verifyDomainsData() {
  console.log("🔍 Verifying domains and sub-domains data...");
  
  try {
    // Load database
    const initSqlJs = (await import('sql.js')).default;
    const SQL = await initSqlJs();
    
    const dataDir = path.resolve(process.cwd(), "data");
    const dbPath = path.join(dataDir, "app.db");
    const dbData = fs.readFileSync(dbPath);
    const db = new SQL.Database(dbData);
    
    // Show first 5 domains with their sub-domains
    console.log("📊 Sample Domains with Sub-domains:\n");
    
    const domains = db.exec("SELECT ID, Name FROM domains ORDER BY ID LIMIT 5");
    
    if (domains.length > 0) {
      for (const [id, name] of domains[0].values) {
        console.log(`🏷️  ${id}. ${name}`);
        
        const subDomains = db.exec(
          "SELECT Name FROM sub_domains WHERE domain_id = ? ORDER BY ID", 
          [id]
        );
        
        if (subDomains.length > 0) {
          subDomains[0].values.forEach(([subName]) => {
            console.log(`     ├─ ${subName}`);
          });
        }
        console.log('');
      }
    }
    
    // Show statistics
    const stats = db.exec(`
      SELECT 
        (SELECT COUNT(*) FROM domains) as total_domains,
        (SELECT COUNT(*) FROM sub_domains) as total_subdomains,
        (SELECT AVG(sub_count) FROM (
          SELECT COUNT(*) as sub_count 
          FROM sub_domains 
          GROUP BY domain_id
        )) as avg_subdomains_per_domain
    `);
    
    if (stats.length > 0) {
      const [totalDomains, totalSubDomains, avgSubDomains] = stats[0].values[0];
      console.log("📈 Statistics:");
      console.log(`   • Total Domains: ${totalDomains}`);
      console.log(`   • Total Sub-domains: ${totalSubDomains}`);
      console.log(`   • Average Sub-domains per Domain: ${Math.round(avgSubDomains * 100) / 100}`);
    }
    
    console.log("\n✅ Database verification completed!");
    
  } catch (error) {
    console.error("❌ Verification failed:", error);
  }
}

verifyDomainsData();