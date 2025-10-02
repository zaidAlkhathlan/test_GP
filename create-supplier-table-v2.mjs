// Script to create the Supplier table and insert data
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'app.db');

async function createSupplierTable() {
  try {
    console.log('📖 Loading database from:', dbPath);
    
    // Initialize sql.js
    const SQL = await initSqlJs();
    
    // Load database file
    const dbData = fs.readFileSync(dbPath);
    const db = new SQL.Database(dbData);
    
    // Create the Supplier table with exact structure specified
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS Supplier (
        id                              INTEGER PRIMARY KEY,         
        commercial_registration_number  TEXT    UNIQUE,              
        commercial_phone_number         TEXT,                        
        industry                        TEXT,
        created_at                      TEXT,    
        city                            TEXT,
        updated_at                      TEXT,   
        logo                            TEXT,                      
        account_name                    TEXT,                       
        account_email                   TEXT    UNIQUE,             
        account_phone                   TEXT,                       
        company_name                    TEXT,
        licenses                        TEXT,                       
        certificates                    TEXT,                        
        account_password                TEXT                       
      );
    `;
    
    console.log('🔧 Creating Supplier table...');
    
    // Execute the create table statement
    db.run(createTableSQL);
    
    console.log('✅ Supplier table created successfully');
    
    // Insert sample data (similar to buyer data but for suppliers)
    const insertSQL = `
      INSERT INTO Supplier (
        id,
        commercial_registration_number,
        commercial_phone_number,
        industry,
        created_at,
        city,
        updated_at,
        logo,
        account_name,
        account_email,
        account_phone,
        company_name,
        licenses,
        certificates,
        account_password
      ) VALUES
      (1, 'CR123456789', '+966501234567', 'Technology', datetime('now'), 'Riyadh', NULL, NULL, 'Ahmed Al-Rashid', 'ahmed.supplier@techsolutions.com', '+966501234567', 'Tech Solutions Supplier Ltd', 'IT License 2024', 'ISO 9001:2015', 'password123'),
      (2, 'CR987654321', '+966507654321', 'Construction', datetime('now'), 'Jeddah', NULL, NULL, 'Fatima Al-Zahra', 'fatima.supplier@buildingmasters.com', '+966507654321', 'Building Masters Supply Co', 'Construction License 2024', 'Safety Certificate 2024', 'password456'),
      (3, 'CR456789123', '+966512345678', 'Manufacturing', datetime('now'), 'Dammam', NULL, NULL, 'Mohammed Al-Salem', 'mohammed.supplier@manufacturing.com', '+966512345678', 'Saudi Manufacturing Supply Corp', 'Manufacturing License 2024', 'Quality Assurance Cert', 'password789'),
      (4, 'CR789123456', '+966523456789', 'Transportation', datetime('now'), 'Riyadh', NULL, NULL, 'Aisha Al-Qadiri', 'aisha.supplier@transport.com', '+966523456789', 'Express Transport Supply Services', 'Transport License 2024', 'Safety Standards Cert', 'password101'),
      (5, 'CR321654987', '+966534567890', 'Food Services', datetime('now'), 'Mecca', NULL, NULL, 'Omar Al-Hassan', 'omar.supplier@foodservices.com', '+966534567890', 'Premium Food Supply Co', 'Food Safety License 2024', 'HACCP Certification', 'password202');
    `;
    
    console.log('📝 Inserting sample supplier data...');
    
    // Execute the insert statement
    db.run(insertSQL);
    
    console.log('✅ Sample data inserted successfully');
    
    // Save database
    const data = db.export();
    fs.writeFileSync(dbPath, data);
    console.log('💾 Database saved with new table and data');
    
    // Verify the table was created by listing all tables
    console.log('\n📊 Verifying table creation...');
    const tablesQuery = "SELECT name FROM sqlite_master WHERE type='table';";
    const stmt = db.prepare(tablesQuery);
    
    console.log('📋 Tables in database:');
    while (stmt.step()) {
      const tableName = stmt.get()[0];
      console.log(`   - ${tableName}`);
    }
    
    stmt.free();
    
    // Get table schema to confirm structure
    console.log('\n🏗️ Supplier table schema:');
    const schemaQuery = "PRAGMA table_info(Supplier);";
    const schemaStmt = db.prepare(schemaQuery);
    
    while (schemaStmt.step()) {
      const columnInfo = schemaStmt.get();
      const isUnique = columnInfo[5] === 1 ? ' (UNIQUE)' : '';
      const isPrimaryKey = columnInfo[5] === 1 && columnInfo[1] === 'id' ? ' (PRIMARY KEY)' : '';
      console.log(`   Column: ${columnInfo[1]} (${columnInfo[2]})${isUnique}${isPrimaryKey}`);
    }
    
    schemaStmt.free();
    
    // Verify the data was inserted
    console.log('\n📊 Verifying inserted supplier data:');
    const selectSQL = "SELECT id, company_name, account_email, industry, city FROM Supplier ORDER BY id;";
    const selectStmt = db.prepare(selectSQL);
    
    console.log('🏢 Supplier Records:');
    console.log('ID | Company Name                          | Contact Email                           | Industry        | City');
    console.log('---|---------------------------------------|----------------------------------------|-----------------|--------');
    
    while (selectStmt.step()) {
      const row = selectStmt.get();
      const id = row[0];
      const companyName = row[1].padEnd(37);
      const email = row[2].padEnd(38);
      const industry = row[3].padEnd(15);
      const city = row[4];
      
      console.log(`${id.toString().padStart(2)} | ${companyName} | ${email} | ${industry} | ${city}`);
    }
    
    selectStmt.free();
    
    // Get count of records
    const countStmt = db.prepare("SELECT COUNT(*) FROM Supplier;");
    countStmt.step();
    const count = countStmt.get()[0];
    countStmt.free();
    
    db.close();
    
    console.log(`\n✅ Successfully created Supplier table and inserted ${count} supplier records!`);
    
  } catch (error) {
    console.error('❌ Error creating supplier table:', error.message);
  }
}

createSupplierTable();