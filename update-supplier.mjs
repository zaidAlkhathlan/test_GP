import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'app.db');

async function updateSupplier() {
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

    // Update the supplier with CR123456789 to have the email ahmed@techsolutions.com
    const updateSQL = `
      UPDATE Supplier SET 
        account_email = ?,
        account_name = ?,
        company_name = ?,
        licenses = ?,
        certificates = ?,
        account_password = ?
      WHERE commercial_registration_number = ?
    `;

    db.run(updateSQL, [
      'ahmed@techsolutions.com',
      'Ahmed Al-Rashid',
      'Tech Solutions Supplier Ltd',
      'IT License 2024',
      'ISO 9001:2015',
      'password123',
      'CR123456789'
    ]);

    console.log('✅ Supplier updated successfully!');

    // Verify the update
    const verification = db.exec('SELECT * FROM Supplier WHERE commercial_registration_number = "CR123456789"');
    if (verification.length > 0) {
      console.log('🔍 Verification - Updated supplier:');
      console.log(verification[0]);
    }

    // Save the database
    const data = db.export();
    fs.writeFileSync(dbPath, data);
    console.log('💾 Database saved to', dbPath);

    db.close();
    console.log('✅ Database connection closed');

    console.log('\n🎉 You can now login with:');
    console.log('📧 Email: ahmed@techsolutions.com');
    console.log('🔑 Password: password123');

  } catch (error) {
    console.error('❌ Error updating supplier:', error);
    process.exit(1);
  }
}

updateSupplier();