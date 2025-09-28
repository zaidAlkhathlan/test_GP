import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'app.db');

async function checkAndInsertSupplier() {
  try {
    const SQL = await initSqlJs();
    
    let db;
    if (fs.existsSync(dbPath)) {
      console.log('📖 Loading existing database from', dbPath);
      const filebuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(filebuffer);
    } else {
      console.log('🆕 Creating new database');
      db = new SQL.Database();
    }

    console.log('✅ Database loaded successfully');

    // First, check existing suppliers
    const existing = db.exec('SELECT * FROM Supplier');
    console.log('🔍 Existing suppliers:');
    if (existing.length > 0) {
      console.log(existing[0]);
    } else {
      console.log('No existing suppliers found');
    }

    // Delete existing supplier with this email if exists
    db.run('DELETE FROM Supplier WHERE account_email = ?', ['ahmed@techsolutions.com']);
    console.log('🗑️ Cleared any existing supplier with email ahmed@techsolutions.com');

    // Insert the new supplier record (without specifying ID, let it auto-increment)
    const insertSQL = `
      INSERT INTO Supplier (
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
      ) VALUES (?, ?, ?, datetime('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertSQL, [
      'CR123456789',
      '+966501234567',
      'Technology',
      'Riyadh',
      null,
      null,
      'Ahmed Al-Rashid',
      'ahmed@techsolutions.com',
      '+966501234567',
      'Tech Solutions Supplier Ltd',
      'IT License 2024',
      'ISO 9001:2015',
      'password123'
    ]);

    console.log('✅ Supplier inserted successfully!');

    // Verify the insertion
    const verification = db.exec('SELECT * FROM Supplier WHERE account_email = "ahmed@techsolutions.com"');
    if (verification.length > 0) {
      console.log('🔍 Verification - Inserted supplier:');
      console.log(verification[0]);
    }

    // Save the database
    const data = db.export();
    fs.writeFileSync(dbPath, data);
    console.log('💾 Database saved to', dbPath);

    db.close();
    console.log('✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error inserting supplier:', error);
    process.exit(1);
  }
}

checkAndInsertSupplier();