import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.resolve(process.cwd(), 'data');
const dbPath = path.join(dataDir, 'app.db');

console.log('📊 Creating offer-related tables...');

if (!fs.existsSync(dbPath)) {
  console.error('❌ Database file does not exist:', dbPath);
  process.exit(1);
}

const db = new Database(dbPath);

try {
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create offers table to store supplier offers
  const createOffersTable = `
    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tender_id INTEGER NOT NULL,
      supplier_id INTEGER NOT NULL,
      offer_value DECIMAL(15, 2) NOT NULL,
      additional_notes TEXT,
      status TEXT DEFAULT 'submitted' CHECK(status IN ('submitted', 'under_review', 'accepted', 'rejected', 'withdrawn')),
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tender_id) REFERENCES tender(id) ON DELETE CASCADE,
      FOREIGN KEY (supplier_id) REFERENCES Supplier(ID) ON DELETE CASCADE,
      UNIQUE(tender_id, supplier_id) -- One offer per supplier per tender
    );
  `;

  // Create offer_files table to store uploaded files
  const createOfferFilesTable = `
    CREATE TABLE IF NOT EXISTS offer_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      offer_id INTEGER NOT NULL,
      file_type TEXT NOT NULL CHECK(file_type IN ('technical', 'financial', 'company', 'additional')),
      file_name TEXT NOT NULL,
      file_data BLOB NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE CASCADE
    );
  `;

  // Create indexes for better performance
  const createIndexes = `
    CREATE INDEX IF NOT EXISTS idx_offers_tender ON offers(tender_id);
    CREATE INDEX IF NOT EXISTS idx_offers_supplier ON offers(supplier_id);
    CREATE INDEX IF NOT EXISTS idx_offers_status ON offers(status);
    CREATE INDEX IF NOT EXISTS idx_offer_files_offer ON offer_files(offer_id);
    CREATE INDEX IF NOT EXISTS idx_offer_files_type ON offer_files(file_type);
  `;

  // Execute table creation
  console.log('📝 Creating offers table...');
  db.exec(createOffersTable);
  
  console.log('📁 Creating offer_files table...');
  db.exec(createOfferFilesTable);
  
  console.log('🔍 Creating indexes...');
  db.exec(createIndexes);

  // Verify tables were created
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('offers', 'offer_files')").all();
  console.log('✅ Created tables:', tables.map(t => t.name));

  // Show table structure
  console.log('\n📋 Offers table structure:');
  const offersSchema = db.prepare("PRAGMA table_info(offers)").all();
  offersSchema.forEach(col => {
    console.log(`  ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
  });

  console.log('\n📁 Offer files table structure:');
  const filesSchema = db.prepare("PRAGMA table_info(offer_files)").all();
  filesSchema.forEach(col => {
    console.log(`  ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
  });

  console.log('\n✅ Offer tables created successfully!');
  
} catch (error) {
  console.error('❌ Error creating tables:', error);
  process.exit(1);
} finally {
  db.close();
}