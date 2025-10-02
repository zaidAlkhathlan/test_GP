const fs = require('fs');
const path = require('path');

// Test API endpoints by directly checking if database file exists and can be read
async function testAPI() {
  console.log('🧪 Testing API functionality...');
  
  try {
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs();
    
    const dbPath = path.join(__dirname, 'data', 'app.db');
    if (!fs.existsSync(dbPath)) {
      console.error('❌ Database file not found at:', dbPath);
      return;
    }
    
    const fileBuffer = fs.readFileSync(dbPath);
    const db = new SQL.Database(fileBuffer);

    console.log('\n=== Testing domains query ===');
    const domains = db.exec("SELECT ID, Name FROM domains ORDER BY ID");
    if (domains[0] && domains[0].values) {
      console.log('✅ Found', domains[0].values.length, 'domains');
      console.log('First few domains:');
      domains[0].values.slice(0, 5).forEach(row => {
        console.log(`  ${row[0]}: ${row[1]}`);
      });
    } else {
      console.log('❌ No domains found');
    }

    db.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();