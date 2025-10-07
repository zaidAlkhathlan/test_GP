import path from "path";
import fs from "fs";
import { seedDatabase } from "./seedData";

const dataDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, "app.db");

// Define database interface for compatibility
interface DatabaseWrapper {
  run(sql: string, params: any[], callback?: (this: any, err: Error | null) => void): { lastID: number };
  get(sql: string, params: any[], callback: (err: Error | null, row?: any) => void): void;
  all(sql: string, params: any[], callback: (err: Error | null, rows?: any[]) => void): void;
  serialize(callback: () => void): void;
}

// exported `db` will be a database wrapper
export let db: DatabaseWrapper;

export async function initDatabase() {
  console.log("🚀 Initializing database with sqlite3...");

  // Enable foreign keys
  const enableForeignKeys = `PRAGMA foreign_keys = ON;`;

  // Core taxonomy tables
  const createDomainsTable = `
    CREATE TABLE IF NOT EXISTS domains (
      ID INTEGER PRIMARY KEY,
      Name TEXT NOT NULL UNIQUE
    );
  `;

  const createSubDomainsTable = `
    CREATE TABLE IF NOT EXISTS sub_domains (
      ID INTEGER PRIMARY KEY,
      domain_id INTEGER NOT NULL,
      Name TEXT NOT NULL,
      FOREIGN KEY (domain_id) REFERENCES domains(ID)
    );
  `;

  const createSubDomainsIndex = `CREATE INDEX IF NOT EXISTS idx_sub_domains_domain_id ON sub_domains(domain_id);`;

  // Updated Buyer table with your new schema
  const createBuyerTable = `
    CREATE TABLE IF NOT EXISTS Buyer (
      ID INTEGER PRIMARY KEY,
      Commercial_registration_number TEXT NOT NULL,
      Commercial_Phone_number TEXT NOT NULL,
      domains_id INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL,
      City TEXT NOT NULL,
      updated_at TIMESTAMP NOT NULL,
      Logo TEXT,
      Account_name TEXT NOT NULL,
      Account_email TEXT NOT NULL,
      Account_phone INTEGER NOT NULL,
      company_name TEXT NOT NULL,
      Account_password TEXT NOT NULL,
      FOREIGN KEY (domains_id) REFERENCES domains(ID)
    );
  `;

  const createBuyerDomainIndex = `CREATE INDEX IF NOT EXISTS idx_buyer_domain ON Buyer(domains_id);`;

  // Buyer ↔ Sub_Domains (M:N) relationship
  const createBuyerSubDomainsTable = `
    CREATE TABLE IF NOT EXISTS buyer_sub_domains (
      buyer_id INTEGER NOT NULL,
      sub_domains_id INTEGER NOT NULL,
      Name TEXT NOT NULL,
      PRIMARY KEY (buyer_id, sub_domains_id),
      FOREIGN KEY (buyer_id) REFERENCES Buyer(ID),
      FOREIGN KEY (sub_domains_id) REFERENCES sub_domains(ID)
    );
  `;

  const createBuyerSubDomainsIndexes = `
    CREATE INDEX IF NOT EXISTS idx_bsd_buyer ON buyer_sub_domains(buyer_id);
    CREATE INDEX IF NOT EXISTS idx_bsd_subd ON buyer_sub_domains(sub_domains_id);
  `;

  // Licenses and Buyer-Licenses relationship
  const createLicensesTable = `
    CREATE TABLE IF NOT EXISTS Licenses (
      ID INTEGER PRIMARY KEY,
      Name TEXT NOT NULL UNIQUE
    );
  `;

  const createBuyerLicensesTable = `
    CREATE TABLE IF NOT EXISTS Buyer_Licenses (
      buyer_id INTEGER NOT NULL,
      license_id INTEGER NOT NULL,
      PRIMARY KEY (buyer_id, license_id),
      FOREIGN KEY (buyer_id) REFERENCES Buyer(ID),
      FOREIGN KEY (license_id) REFERENCES Licenses(ID)
    );
  `;

  const createBuyerLicensesIndexes = `
    CREATE INDEX IF NOT EXISTS idx_bl_buyer ON Buyer_Licenses(buyer_id);
    CREATE INDEX IF NOT EXISTS idx_bl_license ON Buyer_Licenses(license_id);
  `;

  // Certificates and Buyer-Certificates relationship
  // Create certificates tables
  const createCertificatesTable = `
    CREATE TABLE IF NOT EXISTS Certificates (
      ID INTEGER PRIMARY KEY,
      Name TEXT NOT NULL UNIQUE
    );
  `;

  const createBuyerCertificatesTable = `
    CREATE TABLE IF NOT EXISTS Buyer_Certificates (
      buyer_id INTEGER NOT NULL,
      certificate_id INTEGER NOT NULL,
      PRIMARY KEY (buyer_id, certificate_id),
      FOREIGN KEY (buyer_id) REFERENCES Buyer(ID),
      FOREIGN KEY (certificate_id) REFERENCES Certificates(ID)
    );
  `;

  const createBuyerCertificatesIndexes = `
    CREATE INDEX IF NOT EXISTS idx_bc_buyer ON Buyer_Certificates(buyer_id);
    CREATE INDEX IF NOT EXISTS idx_bc_certificate ON Buyer_Certificates(certificate_id);
  `;

  // Supplier table - mirrors Buyer table structure
  const createSupplierTable = `
    CREATE TABLE IF NOT EXISTS Supplier (
      ID INTEGER PRIMARY KEY,
      Commercial_registration_number TEXT NOT NULL,
      Commercial_Phone_number TEXT NOT NULL,
      domains_id INTEGER NOT NULL,
      created_at TIMESTAMP NOT NULL,
      City TEXT NOT NULL,
      updated_at TIMESTAMP NOT NULL,
      Logo TEXT NOT NULL,
      Account_name TEXT NOT NULL,
      Account_email TEXT NOT NULL UNIQUE,
      Account_phone INTEGER NOT NULL,
      company_name TEXT NOT NULL,
      Account_password TEXT NOT NULL,
      FOREIGN KEY (domains_id) REFERENCES domains(ID)
    );
  `;

  const createSupplierDomainIndex = `CREATE INDEX IF NOT EXISTS idx_supplier_domain ON Supplier(domains_id);`;

  // Supplier ↔ Sub_Domains (M:N) relationship - mirrors buyer_sub_domains
  const createSupplierSubDomainsTable = `
    CREATE TABLE IF NOT EXISTS supplier_sub_domains (
      supplier_id INTEGER NOT NULL,
      sub_domains_id INTEGER NOT NULL,
      Name TEXT NOT NULL,
      PRIMARY KEY (supplier_id, sub_domains_id),
      FOREIGN KEY (supplier_id) REFERENCES Supplier(ID),
      FOREIGN KEY (sub_domains_id) REFERENCES sub_domains(ID)
    );
  `;

  const createSupplierSubDomainsIndexes = `
    CREATE INDEX IF NOT EXISTS idx_ssd_supplier ON supplier_sub_domains(supplier_id);
    CREATE INDEX IF NOT EXISTS idx_ssd_subd ON supplier_sub_domains(sub_domains_id);
  `;

  // Supplier-Licenses relationship - mirrors Buyer_Licenses
  const createSupplierLicensesTable = `
    CREATE TABLE IF NOT EXISTS Supplier_Licenses (
      supplier_id INTEGER NOT NULL,
      license_id INTEGER NOT NULL,
      PRIMARY KEY (supplier_id, license_id),
      FOREIGN KEY (supplier_id) REFERENCES Supplier(ID),
      FOREIGN KEY (license_id) REFERENCES Licenses(ID)
    );
  `;

  const createSupplierLicensesIndexes = `
    CREATE INDEX IF NOT EXISTS idx_sl_supplier ON Supplier_Licenses(supplier_id);
    CREATE INDEX IF NOT EXISTS idx_sl_license ON Supplier_Licenses(license_id);
  `;

  // Supplier-Certificates relationship - mirrors Buyer_Certificates
  const createSupplierCertificatesTable = `
    CREATE TABLE IF NOT EXISTS Supplier_Certificates (
      supplier_id INTEGER NOT NULL,
      certificate_id INTEGER NOT NULL,
      PRIMARY KEY (supplier_id, certificate_id),
      FOREIGN KEY (supplier_id) REFERENCES Supplier(ID),
      FOREIGN KEY (certificate_id) REFERENCES Certificates(ID)
    );
  `;

  const createSupplierCertificatesIndexes = `
    CREATE INDEX IF NOT EXISTS idx_sc_supplier ON Supplier_Certificates(supplier_id);
    CREATE INDEX IF NOT EXISTS idx_sc_certificate ON Supplier_Certificates(certificate_id);
  `;

  // Existing inquiry tables
  const createInquiriesTable = `
    CREATE TABLE IF NOT EXISTS Inquiry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tender_id TEXT NOT NULL,
      supplier_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createAnswersTable = `
    CREATE TABLE IF NOT EXISTS InquiryAnswer (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      inquiry_id INTEGER NOT NULL,
      buyer_id INTEGER NOT NULL,
      answer_text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (inquiry_id) REFERENCES Inquiry(id)
    );
  `;

  // Tender table and relationships
  const createTenderTable = `
    CREATE TABLE IF NOT EXISTS tender (
      id                    INTEGER PRIMARY KEY,
      buyer_id              INTEGER NOT NULL,
      reference_number      INTEGER,
      title                 TEXT NOT NULL,
      domain_id             INTEGER NOT NULL,
      project_description   TEXT,
      city                  TEXT,
      created_at            TEXT    DEFAULT (CURRENT_TIMESTAMP),
      submit_deadline       TEXT,
      quires_deadline       TEXT,
      contract_time         TEXT,
      previous_work         TEXT,
      evaluation_criteria   TEXT,
      used_technologies     TEXT,
      tender_coordinator    TEXT,
      coordinator_email     TEXT,
      coordinator_phone     TEXT,
      file1                 BLOB,
      file2                 BLOB,
      file1_name            TEXT,
      file2_name            TEXT,
      expected_budget       REAL,
      FOREIGN KEY (buyer_id) REFERENCES Buyer(ID) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (domain_id) REFERENCES domains(ID) ON DELETE RESTRICT ON UPDATE CASCADE
    );
  `;

  const createTenderIndex = `
    CREATE INDEX IF NOT EXISTS idx_tender_domain ON tender(domain_id);
    CREATE INDEX IF NOT EXISTS idx_tender_buyer ON tender(buyer_id);
  `;

  // M:N: Tender ↔ Sub-domain
  const createTenderSubDomainsTable = `
    CREATE TABLE IF NOT EXISTS tender_sub_domains (
      tender_id     INTEGER NOT NULL,
      sub_domain_id INTEGER NOT NULL,
      PRIMARY KEY (tender_id, sub_domain_id),
      FOREIGN KEY (tender_id)     REFERENCES tender(id)      ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (sub_domain_id) REFERENCES sub_domains(ID) ON DELETE CASCADE ON UPDATE CASCADE
    );
  `;

  const createTenderSubDomainsIndex = `CREATE INDEX IF NOT EXISTS idx_ts_subdomain ON tender_sub_domains(sub_domain_id);`;

  // M:N: Tender ↔ License
  const createTenderLicensesTable = `
    CREATE TABLE IF NOT EXISTS tender_licenses (
      tender_id   INTEGER NOT NULL,
      license_id  INTEGER NOT NULL,
      PRIMARY KEY (tender_id, license_id),
      FOREIGN KEY (tender_id)  REFERENCES tender(id)   ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (license_id) REFERENCES Licenses(ID) ON DELETE CASCADE ON UPDATE CASCADE
    );
  `;

  const createTenderLicensesIndex = `CREATE INDEX IF NOT EXISTS idx_tl_license ON tender_licenses(license_id);`;

  // M:N: Tender ↔ Certificate
  const createTenderCertificatesTable = `
    CREATE TABLE IF NOT EXISTS tender_certificates (
      tender_id      INTEGER NOT NULL,
      certificate_id INTEGER NOT NULL,
      PRIMARY KEY (tender_id, certificate_id),
      FOREIGN KEY (tender_id)       REFERENCES tender(id)        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (certificate_id)  REFERENCES Certificates(ID)  ON DELETE CASCADE ON UPDATE CASCADE
    );
  `;

  const createTenderCertificatesIndex = `CREATE INDEX IF NOT EXISTS idx_tc_certificate ON tender_certificates(certificate_id);`;

  try {
    // Dynamically import sql.js to avoid bundler resolving it at config time
    let initSqlJs: any;
    try {
      const mod = await import("sql.js");
      initSqlJs = mod.default ?? mod;
      console.log("✅ Successfully imported sql.js module");
    } catch (e) {
      console.error("❌ Failed to import sql.js:", e);
      initSqlJs = null;
    }

    if (initSqlJs) {
      console.log("🔄 Initializing sql.js with WASM...");
      const SQL = await initSqlJs({
        // Provide the path to the WASM file
        locateFile: (file: string) => {
          console.log("📁 Looking for sql.js file:", file);
          return `node_modules/sql.js/dist/${file}`;
        }
      });
      console.log("✅ SQL.js initialized successfully");

      // Load existing database file or create new one
      let dbData: Uint8Array | undefined;
      if (fs.existsSync(dbPath)) {
        dbData = fs.readFileSync(dbPath);
        console.log("📖 Loading existing database from", dbPath);
      } else {
        console.log("🆕 Creating new database at", dbPath);
      }

      const realDb = new SQL.Database(dbData);
    
    // Enable foreign keys and create all tables
    realDb.run(enableForeignKeys);
    
    // Create taxonomy tables
    realDb.run(createDomainsTable);
    realDb.run(createSubDomainsTable);
    realDb.run(createSubDomainsIndex);
    
    // Create buyer and related tables
    realDb.run(createBuyerTable);
    realDb.run(createBuyerDomainIndex);
    realDb.run(createBuyerSubDomainsTable);
    realDb.run(createBuyerSubDomainsIndexes);
    
    // Create licenses tables
    realDb.run(createLicensesTable);
    realDb.run(createBuyerLicensesTable);
    realDb.run(createBuyerLicensesIndexes);
    
    // Create certificates tables
    realDb.run(createCertificatesTable);
    realDb.run(createBuyerCertificatesTable);
    realDb.run(createBuyerCertificatesIndexes);
    
    // Create supplier and related tables (mirroring buyer structure)
    realDb.run(createSupplierTable);
    realDb.run(createSupplierDomainIndex);
    realDb.run(createSupplierSubDomainsTable);
    realDb.run(createSupplierSubDomainsIndexes);
    realDb.run(createSupplierLicensesTable);
    realDb.run(createSupplierLicensesIndexes);
    realDb.run(createSupplierCertificatesTable);
    realDb.run(createSupplierCertificatesIndexes);
    
    // Create existing inquiry tables
    realDb.run(createInquiriesTable);
    realDb.run(createAnswersTable);
    
    // Create tender tables
    realDb.run(createTenderTable);
    realDb.run(createTenderIndex);
    realDb.run(createTenderSubDomainsTable);
    realDb.run(createTenderSubDomainsIndex);
    realDb.run(createTenderLicensesTable);
    realDb.run(createTenderLicensesIndex);
    realDb.run(createTenderCertificatesTable);
    realDb.run(createTenderCertificatesIndex);
    
    // Save database to file
    const data = realDb.export();
    fs.writeFileSync(dbPath, data);
    
    console.log("✅ SQLite database initialized successfully at", dbPath);
    console.log("📁 Database file created:", fs.existsSync(dbPath) ? "YES" : "NO");
    
    // Create a wrapper object to maintain compatibility with old sqlite3 API
    const dbWrapper: DatabaseWrapper = {
      run(sql: string, params: any[], callback?: (this: any, err: Error | null) => void) {
        try {
          console.log("🔧 SQL run:", sql);
          console.log("🔧 Params:", params);
          
          const stmt = realDb.prepare(sql);
          stmt.bind(params);
          const result = stmt.step();
          
          // Get the last insert rowid
          const lastID = realDb.exec("SELECT last_insert_rowid() as id")[0]?.values[0]?.[0] as number || 0;
          
          console.log("🔧 Insert result - lastID:", lastID);
          
          stmt.free();
          
          // Save database after modification
          const data = realDb.export();
          fs.writeFileSync(dbPath, data);
          console.log("💾 Database saved to file");
          
          if (callback) {
            callback.call({ lastID }, null);
          }
          
          return { lastID };
        } catch (err: any) {
          console.error("🔧 Database run error:", err);
          if (callback) {
            callback.call({}, err);
          }
          throw err;
        }
      },
      
      get(sql: string, params: any[], callback: (err: Error | null, row?: any) => void) {
        try {
          const stmt = realDb.prepare(sql);
          stmt.bind(params);
          
          let row: any = null;
          if (stmt.step()) {
            const columns = stmt.getColumnNames();
            const values = stmt.get();
            row = {};
            columns.forEach((col, index) => {
              row[col] = values[index];
            });
          }
          
          stmt.free();
          callback(null, row);
        } catch (err: any) {
          callback(err, undefined);
        }
      },
      
      all(sql: string, params: any[], callback: (err: Error | null, rows?: any[]) => void) {
        try {
          const stmt = realDb.prepare(sql);
          stmt.bind(params);
          
          const rows: any[] = [];
          const columns = stmt.getColumnNames();
          
          while (stmt.step()) {
            const values = stmt.get();
            const row: any = {};
            columns.forEach((col, index) => {
              row[col] = values[index];
            });
            rows.push(row);
          }
          
          stmt.free();
          callback(null, rows);
        } catch (err: any) {
          callback(err, undefined);
        }
      },
      
      serialize(callback: () => void) {
        callback();
      }
    };
    
      // Assign the wrapper to db
      db = dbWrapper;
      
      // Check if database needs seeding (only seed if empty)
      db.get("SELECT COUNT(*) as count FROM domains", [], (err, row) => {
        if (!err && (!row || row.count === 0)) {
          console.log("📦 Database is empty, seeding with essential data...");
          seedDatabase(db);
          
          // Tender data is seeded separately using seed-tenders.mjs
        } else {
          console.log(`📊 Database already contains ${row?.count || 0} domains - checking tenders...`);
          
          // Tender data is seeded separately using seed-tenders.mjs
          db.get("SELECT COUNT(*) as count FROM tender", [], (err, tenderRow) => {
            console.log(`📊 Database contains ${tenderRow?.count || 0} tenders`);
          });
        }
      });
      
      return db;
    }
  } catch (err: any) {
    console.error("❌ sql.js initialization failed:", err);
    console.warn("⚠️  Falling back to in-memory database (data will not persist)");
    // fall through to in-memory fallback below
  }

  // In-memory fallback when sql.js is unavailable
  const rows: any[] = [];
  let autoId = 1;

  db = {
    run(sql: string, params: any[], cb?: (this: any, err: Error | null) => void) {
      try {
        if (/INSERT INTO Buyer/i.test(sql)) {
          const [
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
            certificates,
          ] = params;

          const row = {
            id: autoId++,
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
            certificates,
            created_at: new Date().toISOString(),
            updated_at: null,
          };
          rows.push(row);
          if (cb) cb.call({ lastID: row.id }, null as any);
        } else {
          if (cb) cb(null as any);
        }
      } catch (e: any) {
        if (cb) cb(e);
      }
      return { lastID: autoId - 1 };
    },
    get(sql: string, params: any[], cb: (err: Error | null, row?: any) => void) {
      try {
        const m = sql.match(/WHERE id = \?/i);
        if (m) {
          const id = params[0];
          const found = rows.find((r) => r.id === id);
          cb(null, found || null);
          return;
        }
        cb(null, null);
      } catch (e: any) {
        cb(e, undefined);
      }
    },
    all(_sql: string, _params: any[], cb: (err: Error | null, rows?: any[]) => void) {
      cb(null, rows.slice());
    },
    serialize(cb: () => void) {
      cb();
    },
  };

  return db;
}
