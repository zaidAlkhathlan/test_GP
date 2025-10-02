import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'data', 'app.db');

try {
  const db = new Database(dbPath);
  
  console.log('📖 Opening database at:', dbPath);
  
  const insertSupplier = db.prepare(`
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insertSupplier.run(
    1,
    'CR123456789',
    '+966501234567',
    'Technology',
    new Date().toISOString(),
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
  );

  console.log('✅ Supplier inserted successfully!');
  console.log('📊 Changes:', result.changes);
  console.log('🆔 Last Insert ID:', result.lastInsertRowid);
  
  // Verify the insertion
  const verification = db.prepare('SELECT * FROM Supplier WHERE id = ?').get(1);
  console.log('🔍 Verification - Inserted supplier:');
  console.log(verification);
  
  db.close();
  console.log('✅ Database connection closed');
  
} catch (error) {
  console.error('❌ Error inserting supplier:', error);
  process.exit(1);
}