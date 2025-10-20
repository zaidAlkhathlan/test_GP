import fs from "fs";
import path from "path";
import initSqlJs from "sql.js";
import { seedDatabase } from "./seed-data.ts";

async function buildDatabase() {
  console.log("🛠 Starting database build process...");

  const dataDir = path.resolve(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
  const dbPath = path.join(dataDir, "app.db");

  const SQL = await initSqlJs({
    locateFile: (file) => `node_modules/sql.js/dist/${file}`,
  });

  const db = new SQL.Database();

  const createSchemaSQL = `
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS Registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      commercial_registration_number TEXT NOT NULL UNIQUE,
      phone_number TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS domains (ID INTEGER PRIMARY KEY, Name TEXT NOT NULL UNIQUE);
    CREATE TABLE IF NOT EXISTS sub_domains (
      ID INTEGER PRIMARY KEY,
      domain_id INTEGER NOT NULL,
      Name TEXT NOT NULL,
      FOREIGN KEY (domain_id) REFERENCES domains(ID)
    );
    CREATE INDEX IF NOT EXISTS idx_sub_domains_domain_id ON sub_domains(domain_id);

CREATE TABLE Licenses (
  ID              INTEGER PRIMARY KEY AUTOINCREMENT,
  code            TEXT UNIQUE,
  name_ar         TEXT,
  name_en         TEXT,
  category        TEXT,
  description_ar  TEXT,
  description_en  TEXT,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
);
    CREATE TABLE IF NOT EXISTS certificates (ID INTEGER PRIMARY KEY, Name TEXT NOT NULL UNIQUE);
    CREATE TABLE IF NOT EXISTS status (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);

CREATE TABLE IF NOT EXISTS Region (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS City (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  region_id INTEGER NOT NULL,
  FOREIGN KEY (region_id) REFERENCES Region(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT,
  UNIQUE(region_id, name)
);


CREATE TABLE IF NOT EXISTS Buyer (
  id INTEGER PRIMARY KEY,
  company_name TEXT,
  commercial_registration_number TEXT UNIQUE,
  commercial_phone_number TEXT,
  domains_id INTEGER,
  city_id INTEGER,
  account_name TEXT,
  account_email TEXT UNIQUE,
  account_phone TEXT,
  account_password TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (domains_id) REFERENCES domains(ID),
  FOREIGN KEY (city_id) REFERENCES City(id)
);

CREATE TABLE IF NOT EXISTS Supplier (
  id INTEGER PRIMARY KEY,
  company_name TEXT,
  commercial_registration_number TEXT UNIQUE,
  commercial_phone_number TEXT,
  domains_id INTEGER,
  licenses TEXT,
  certificates TEXT,
  city_id INTEGER,
  account_name TEXT,
  account_email TEXT UNIQUE,
  account_phone TEXT,
  account_password TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES City(id)
);



    CREATE TABLE IF NOT EXISTS tender (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
    buyer_id INTEGER NOT NULL,
    reference_number INTEGER,
    title TEXT NOT NULL,
    domain_id INTEGER NOT NULL,
    project_description TEXT,
    city_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    submit_deadline TEXT,
    quires_deadline TEXT,
    contract_time TEXT,
    previous_work TEXT,
    evaluation_criteria TEXT,
    used_technologies TEXT,
    tender_coordinator TEXT,
    coordinator_email TEXT,
    coordinator_phone TEXT,
    file1 BLOB,
    file2 BLOB,
    file1_name TEXT,
    file2_name TEXT,
    expected_budget REAL,
    FOREIGN KEY (city_id) REFERENCES City(id)
        ON UPDATE CASCADE ON DELETE RESTRICT
    );

    CREATE TABLE IF NOT EXISTS tender_offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tender_id INTEGER NOT NULL,
      supplier_id INTEGER NOT NULL,
      financial_offer_file TEXT,
      technical_offer_file TEXT,
      comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tender_id) REFERENCES tender(id),
      FOREIGN KEY (supplier_id) REFERENCES Supplier(id)
    );
  `;

  db.run(createSchemaSQL);
  console.log("✅ Tables created successfully.");

    seedDatabase(db); // Call the centralized seeding function
  // 💾 Save DB
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
  console.log(`💾 Database file written to ${dbPath}`);

  db.close();
  console.log("🎉 Database build complete!");
}

buildDatabase().catch((err) => {
  console.error("❌ Database build failed:", err);
  process.exit(1);
});
