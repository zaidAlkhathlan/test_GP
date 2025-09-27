// Script to insert data into Commercial_Registration table
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'app.db');

async function insertCommercialData() {
  try {
    console.log('📖 Loading database from:', dbPath);
    
    // Initialize sql.js
    const SQL = await initSqlJs();
    
    // Load database file
    const dbData = fs.readFileSync(dbPath);
    const db = new SQL.Database(dbData);
    
    // Insert data into Commercial_Registration table
    const insertSQL = `
      INSERT INTO Commercial_Registration 
      (ID, Company_name, Industry, City, Logo, Location)
      VALUES
      (1, 'Saudi Aramco', 'Oil & Gas', '1', CURRENT_TIMESTAMP, 'Dhahran, Eastern Province'),
      (2, 'SABIC', 'Chemicals', '1', CURRENT_TIMESTAMP, 'Riyadh'),
      (3, 'Saudi Telecom Company (STC)', 'Telecommunications', '1', CURRENT_TIMESTAMP, 'Riyadh'),
      (4, 'Almarai', 'Food & Beverage', '0', CURRENT_TIMESTAMP, 'Riyadh'),
      (5, 'Saudi Electricity Company', 'Utilities', '1', CURRENT_TIMESTAMP, 'Riyadh'),
      (6, 'Jarir Bookstore', 'Retail', '0', CURRENT_TIMESTAMP, 'Riyadh'),
      (7, 'Saudi Airlines (Saudia)', 'Aviation', '1', CURRENT_TIMESTAMP, 'Jeddah'),
      (8, 'Al Rajhi Bank', 'Banking', '1', CURRENT_TIMESTAMP, 'Riyadh'),
      (9, 'National Commercial Bank (NCB)', 'Banking', '1', CURRENT_TIMESTAMP, 'Jeddah'),
      (10, 'Mobily', 'Telecommunications', '0', CURRENT_TIMESTAMP, 'Riyadh');
    `;
    
    console.log('📝 Inserting data into Commercial_Registration table...');
    
    // Execute the insert statement
    db.run(insertSQL);
    
    console.log('✅ Data inserted successfully');
    
    // Save database
    const data = db.export();
    fs.writeFileSync(dbPath, data);
    console.log('💾 Database saved with new data');
    
    // Verify the data was inserted by querying the table
    console.log('\n📊 Verifying inserted data:');
    const selectSQL = "SELECT * FROM Commercial_Registration ORDER BY ID;";
    const stmt = db.prepare(selectSQL);
    
    console.log('🏢 Commercial Registration Records:');
    console.log('ID | Company Name                     | Industry           | City | Location');
    console.log('---|----------------------------------|--------------------|----- |------------------');
    
    while (stmt.step()) {
      const row = stmt.get();
      const id = row[0];
      const companyName = row[1].padEnd(32);
      const industry = row[2].padEnd(18);
      const city = row[3];
      const location = row[5];
      
      console.log(`${id.toString().padStart(2)} | ${companyName} | ${industry} | ${city}    | ${location}`);
    }
    
    stmt.free();
    
    // Get count of records
    const countStmt = db.prepare("SELECT COUNT(*) FROM Commercial_Registration;");
    countStmt.step();
    const count = countStmt.get()[0];
    countStmt.free();
    
    db.close();
    
    console.log(`\n✅ Successfully inserted ${count} records into Commercial_Registration table!`);
    
  } catch (error) {
    console.error('❌ Error inserting data:', error.message);
  }
}

insertCommercialData();