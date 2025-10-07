#!/usr/bin/env node

import fs from 'fs';
import initSqlJs from 'sql.js';

const DATABASE_PATH = './data/app.db';

async function migrateSupplierSchema() {
  console.log('🔄 Starting supplier schema migration...');
  
  // Initialize sql.js
  const SQL = await initSqlJs();
  
  // Load existing database
  const filebuffer = fs.readFileSync(DATABASE_PATH);
  const db = new SQL.Database(filebuffer);

  try {
    console.log('📦 Creating backup of existing supplier data...');
    
    // Drop backup table if exists
    db.exec('DROP TABLE IF EXISTS Supplier_Backup;');
    
    // Create backup of existing data
    db.exec('CREATE TABLE Supplier_Backup AS SELECT * FROM Supplier;');
    
    console.log('✅ Backup created successfully');

    // Get existing data
    const result = db.exec('SELECT * FROM Supplier_Backup;');
    const existingSuppliers = result.length > 0 ? result[0].values.map(row => {
      const columns = result[0].columns;
      const supplier = {};
      row.forEach((value, index) => {
        supplier[columns[index]] = value;
      });
      return supplier;
    }) : [];
    console.log(`📊 Found ${existingSuppliers.length} existing suppliers`);

    console.log('🗑️ Dropping old supplier table...');
    db.exec('DROP TABLE Supplier;');

    console.log('🏗️ Creating new supplier table with proper schema...');
    
    // Create new Supplier table with proper schema
    db.exec(`
      CREATE TABLE Supplier (
        ID INTEGER PRIMARY KEY,
        Commercial_registration_number TEXT NOT NULL,
        Commercial_Phone_number TEXT NOT NULL,
        domains_id INTEGER NOT NULL,
        created_at TIMESTAMP NOT NULL,
        City TEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        Logo TEXT,
        Account_name TEXT NOT NULL,
        Account_email TEXT NOT NULL UNIQUE,
        Account_phone INTEGER NOT NULL,
        company_name TEXT NOT NULL,
        Account_password TEXT NOT NULL,
        FOREIGN KEY (domains_id) REFERENCES domains(ID)
      );
    `);

    db.exec('CREATE INDEX idx_supplier_domain ON Supplier(domains_id);');

    console.log('🔗 Creating supplier relationship tables...');
    
    // Create supplier_sub_domains table
    db.exec(`
      CREATE TABLE IF NOT EXISTS supplier_sub_domains (
        supplier_id INTEGER NOT NULL,
        sub_domains_id INTEGER NOT NULL,
        Name TEXT NOT NULL,
        PRIMARY KEY (supplier_id, sub_domains_id),
        FOREIGN KEY (supplier_id) REFERENCES Supplier(ID),
        FOREIGN KEY (sub_domains_id) REFERENCES sub_domains(ID)
      );
    `);

    db.exec('CREATE INDEX idx_ssd_supplier ON supplier_sub_domains(supplier_id);');
    db.exec('CREATE INDEX idx_ssd_subd ON supplier_sub_domains(sub_domains_id);');

    // Create Supplier_Licenses table
    db.exec(`
      CREATE TABLE IF NOT EXISTS Supplier_Licenses (
        supplier_id INTEGER NOT NULL,
        license_id INTEGER NOT NULL,
        PRIMARY KEY (supplier_id, license_id),
        FOREIGN KEY (supplier_id) REFERENCES Supplier(ID),
        FOREIGN KEY (license_id) REFERENCES Licenses(ID)
      );
    `);

    db.exec('CREATE INDEX idx_sl_supplier ON Supplier_Licenses(supplier_id);');
    db.exec('CREATE INDEX idx_sl_license ON Supplier_Licenses(license_id);');

    // Create Supplier_Certificates table
    db.exec(`
      CREATE TABLE IF NOT EXISTS Supplier_Certificates (
        supplier_id INTEGER NOT NULL,
        certificate_id INTEGER NOT NULL,
        PRIMARY KEY (supplier_id, certificate_id),
        FOREIGN KEY (supplier_id) REFERENCES Supplier(ID),
        FOREIGN KEY (certificate_id) REFERENCES Certificates(ID)
      );
    `);

    db.exec('CREATE INDEX idx_sc_supplier ON Supplier_Certificates(supplier_id);');
    db.exec('CREATE INDEX idx_sc_certificate ON Supplier_Certificates(certificate_id);');

    console.log('📝 Migrating existing supplier data...');
    
    // Get a default domain_id to use for existing suppliers
    const domainResult = db.exec('SELECT ID FROM domains ORDER BY ID LIMIT 1;');
    const defaultDomainId = domainResult.length > 0 && domainResult[0].values.length > 0 ? domainResult[0].values[0][0] : 1;
    
    console.log(`🔗 Using default domain ID: ${defaultDomainId}`);

    // Migrate each supplier
    for (const supplier of existingSuppliers) {
      console.log(`➤ Migrating supplier: ${supplier.company_name}`);
      
      // Insert supplier with new schema
      const stmt = db.prepare(`
        INSERT INTO Supplier (
          ID, Commercial_registration_number, Commercial_Phone_number, domains_id,
          created_at, City, updated_at, Logo, Account_name, Account_email, 
          Account_phone, company_name, Account_password
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run([
        supplier.id,
        supplier.commercial_registration_number,
        supplier.commercial_phone_number,
        defaultDomainId, // Use default domain
        supplier.created_at,
        supplier.city,
        supplier.updated_at || supplier.created_at, // Use created_at if updated_at is NULL
        supplier.logo || null,
        supplier.account_name || '',
        supplier.account_email,
        supplier.account_phone || '',
        supplier.company_name,
        supplier.account_password
      ]);
      stmt.free();

      // Try to parse and migrate licenses if they exist
      if (supplier.licenses) {
        try {
          let licenseIds = [];
          
          // Try parsing as JSON array first
          try {
            licenseIds = JSON.parse(supplier.licenses);
          } catch {
            // If not JSON, treat as comma-separated string
            licenseIds = supplier.licenses.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
          }
          
          for (const licenseId of licenseIds) {
            // Check if license exists
            const licenseResult = db.exec('SELECT ID FROM Licenses WHERE ID = ?', [licenseId]);
            if (licenseResult.length > 0 && licenseResult[0].values.length > 0) {
              const insertStmt = db.prepare('INSERT OR IGNORE INTO Supplier_Licenses (supplier_id, license_id) VALUES (?, ?)');
              insertStmt.run([supplier.id, licenseId]);
              insertStmt.free();
              console.log(`  ✓ Added license ${licenseId}`);
            }
          }
        } catch (error) {
          console.warn(`  ⚠️ Could not migrate licenses for supplier ${supplier.id}: ${error.message}`);
        }
      }

      // Try to parse and migrate certificates if they exist
      if (supplier.certificates) {
        try {
          let certificateIds = [];
          
          // Try parsing as JSON array first
          try {
            certificateIds = JSON.parse(supplier.certificates);
          } catch {
            // If not JSON, treat as comma-separated string
            certificateIds = supplier.certificates.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
          }
          
          for (const certificateId of certificateIds) {
            // Check if certificate exists
            const certificateResult = db.exec('SELECT ID FROM Certificates WHERE ID = ?', [certificateId]);
            if (certificateResult.length > 0 && certificateResult[0].values.length > 0) {
              const insertStmt = db.prepare('INSERT OR IGNORE INTO Supplier_Certificates (supplier_id, certificate_id) VALUES (?, ?)');
              insertStmt.run([supplier.id, certificateId]);
              insertStmt.free();
              console.log(`  ✓ Added certificate ${certificateId}`);
            }
          }
        } catch (error) {
          console.warn(`  ⚠️ Could not migrate certificates for supplier ${supplier.id}: ${error.message}`);
        }
      }
    }

    console.log('✅ Supplier schema migration completed successfully!');
    console.log(`📊 Migrated ${existingSuppliers.length} suppliers`);
    
    // Verify migration
    const countResult = db.exec('SELECT COUNT(*) as count FROM Supplier;');
    const newSupplierCount = countResult.length > 0 && countResult[0].values.length > 0 ? countResult[0].values[0][0] : 0;
    console.log(`✓ New supplier table has ${newSupplierCount} records`);

    // Save the modified database
    const data = db.export();
    fs.writeFileSync(DATABASE_PATH, data);
    console.log('� Database saved successfully');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack:', error.stack);
    
    throw error;
  } finally {
    if (db) {
      db.close();
    }
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateSupplierSchema().catch(console.error);
}

export { migrateSupplierSchema };