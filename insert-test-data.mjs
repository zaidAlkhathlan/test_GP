// Direct database insertion script to test the database
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'app.db');

async function insertTestData() {
  try {
    console.log('🔧 Loading database from:', dbPath);
    
    // Initialize sql.js
    const SQL = await initSqlJs();
    
    // Load database file
    const dbData = fs.readFileSync(dbPath);
    const db = new SQL.Database(dbData);
    
    // Insert test buyers directly
    const insertSQL = `
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
    `;
    
    const testBuyers = [
      [
        "CR123456789",
        "+966501234567",
        "Technology",
        "Tech Solutions Ltd",
        "Riyadh",
        null,
        "Ahmed Al-Rashid",
        "ahmed@techsolutions.com",
        "+966501234567",
        "password123",
        "IT License 2024",
        "ISO 9001:2015"
      ],
      [
        "CR987654321",
        "+966507654321",
        "Construction",
        "Building Masters Co",
        "Jeddah",
        null,
        "Fatima Al-Zahra",
        "fatima@buildingmasters.com",
        "+966507654321",
        "password456",
        "Construction License 2024",
        "Safety Certificate 2024"
      ]
    ];
    
    console.log('📝 Inserting test data...');
    
    testBuyers.forEach((buyerData, index) => {
      const stmt = db.prepare(insertSQL);
      stmt.bind(buyerData);
      stmt.step();
      stmt.free();
      console.log(`✅ Inserted buyer ${index + 1}: ${buyerData[3]}`);
    });
    
    // Save database
    const data = db.export();
    fs.writeFileSync(dbPath, data);
    console.log('💾 Database saved successfully');
    
    // Query to verify data
    console.log('\n📊 Verifying inserted data:');
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
    
    buyers.forEach((buyer, index) => {
      console.log(`🏢 Buyer ${index + 1}:`);
      console.log(`   ID: ${buyer.id}`);
      console.log(`   Company: ${buyer.company_name}`);
      console.log(`   Email: ${buyer.account_email}`);
      console.log(`   City: ${buyer.city}`);
      console.log(`   Created: ${buyer.created_at}`);
      console.log('   ' + '─'.repeat(50));
    });
    
    console.log(`\n✅ Successfully inserted and verified ${buyers.length} buyers in the database!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

insertTestData();