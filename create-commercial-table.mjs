// Script to create the Commercial_Registration table
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'app.db');

async function createCommercialRegistrationTable() {
  try {
    console.log('📖 Loading database from:', dbPath);
    
    // Initialize sql.js
    const SQL = await initSqlJs();
    
    // Load database file
    const dbData = fs.readFileSync(dbPath);
    const db = new SQL.Database(dbData);
    
    // Create the Commercial_Registration table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS Commercial_Registration (
        ID INTEGER PRIMARY KEY,
        Company_name TEXT,
        Industry TEXT,
        City TEXT CHECK(City IN ('0', '1')),
        Logo TIMESTAMP,
        Location TEXT
      );
    `;
    
    console.log('🔧 Creating Commercial_Registration table...');
    
    // Execute the create table statement
    db.run(createTableSQL);
    
    console.log('✅ Commercial_Registration table created successfully');
    
    // Save database
    const data = db.export();
    fs.writeFileSync(dbPath, data);
    console.log('💾 Database saved with new table');
    
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
    console.log('\n🏗️ Commercial_Registration table schema:');
    const schemaQuery = "PRAGMA table_info(Commercial_Registration);";
    const schemaStmt = db.prepare(schemaQuery);
    
    while (schemaStmt.step()) {
      const columnInfo = schemaStmt.get();
      console.log(`   Column: ${columnInfo[1]} (${columnInfo[2]})`);
    }
    
    schemaStmt.free();
    db.close();
    
    console.log('\n✅ Commercial_Registration table successfully created and verified!');
    
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
  }
}

createCommercialRegistrationTable();