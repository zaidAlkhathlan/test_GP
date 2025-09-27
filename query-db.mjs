// Script to read data directly from the SQLite database file
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'app.db');

async function queryDatabase() {
  try {
    console.log('📖 Reading database from:', dbPath);
    
    // Initialize sql.js
    const SQL = await initSqlJs();
    
    // Load database file
    const dbData = fs.readFileSync(dbPath);
    const db = new SQL.Database(dbData);
    
    // Query all buyers
    const stmt = db.prepare("SELECT * FROM Buyer");
    const buyers = [];
    
    while (stmt.step()) {
      const columns = stmt.getColumnNames();
      const values = stmt.get();
      const buyer = {};
      columns.forEach((col, index) => {
        buyer[col] = values[index];
      });
      buyers.push(buyer);
    }
    
    stmt.free();
    db.close();
    
    console.log(`\n📊 Found ${buyers.length} buyer(s) in database:\n`);
    
    buyers.forEach((buyer, index) => {
      console.log(`🏢 Buyer ${index + 1}:`);
      console.log(`   ID: ${buyer.id}`);
      console.log(`   Company: ${buyer.company_name}`);
      console.log(`   Email: ${buyer.account_email}`);
      console.log(`   City: ${buyer.city}`);
      console.log(`   Industry: ${buyer.industry}`);
      console.log(`   Registration: ${buyer.commercial_registration_number}`);
      console.log(`   Created: ${buyer.created_at}`);
      console.log('   ' + '─'.repeat(50));
    });
    
    if (buyers.length === 0) {
      console.log('   No buyers found. Try creating some using the API first.');
    }
    
  } catch (error) {
    console.error('❌ Error reading database:', error.message);
  }
}

queryDatabase();