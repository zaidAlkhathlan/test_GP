const fs = require('fs');
const path = require('path');

// Helper function to run with sql.js  
async function testDomains() {
  console.log("Testing domains and sub-domains...");

  try {
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs();
    
    const dbPath = path.join(__dirname, 'data', 'app.db');
    if (!fs.existsSync(dbPath)) {
      console.error('Database file not found');
      return;
    }
    
    const fileBuffer = fs.readFileSync(dbPath);
    const db = new SQL.Database(fileBuffer);

    // Test domains
    console.log('\n=== DOMAINS ===');
    const domains = db.exec("SELECT ID, Name FROM domains ORDER BY ID");
    if (domains[0] && domains[0].values) {
      domains[0].values.forEach(row => {
        console.log(`${row[0]}: ${row[1]}`);
      });
    }

    // Test sub-domains
    console.log('\n=== SUB-DOMAINS BY DOMAIN ===');
    const subDomains = db.exec(`
      SELECT d.Name as domain_name, sd.ID, sd.Name 
      FROM sub_domains sd 
      JOIN domains d ON sd.domain_id = d.ID 
      ORDER BY d.ID, sd.ID
    `);
    
    if (subDomains[0] && subDomains[0].values) {
      let currentDomain = null;
      subDomains[0].values.forEach(row => {
        if (row[0] !== currentDomain) {
          currentDomain = row[0];
          console.log(`\n--- ${currentDomain} ---`);
        }
        console.log(`  ${row[1]}: ${row[2]}`);
      });
    }

    db.close();
    console.log('\n✅ Domain test completed!');

  } catch (error) {
    console.error('❌ Error testing domains:', error);
  }
}

testDomains();