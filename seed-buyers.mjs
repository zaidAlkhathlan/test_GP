import fs from "fs";
import path from "path";
import initSqlJs from "sql.js";

const DB_DIR = path.resolve("./data");
const DB_FILE = path.join(DB_DIR, "app.db");

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const SQL = await initSqlJs({
  locateFile: (file) => path.join("node_modules", "sql.js", "dist", file),
});

// load or create DB
let db;
if (fs.existsSync(DB_FILE)) {
  const fileBuffer = fs.readFileSync(DB_FILE);
  db = new SQL.Database(new Uint8Array(fileBuffer));
  console.log("Loaded existing DB:", DB_FILE);
} else {
  db = new SQL.Database();
  console.log("Created new DB in-memory (will write to", DB_FILE, ")");
}

// Ensure required tables exist (domains and Buyer using current server schema)
// domains table
db.run(`
  CREATE TABLE IF NOT EXISTS domains (
    ID INTEGER PRIMARY KEY,
    Name TEXT NOT NULL UNIQUE
  );
`);

// Buyer table (must match server/db.ts)
db.run(`
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
`);

// Seed minimal domains if empty (IDs align with server's seed)
try {
  const domCount = db.exec("SELECT COUNT(*) as c FROM domains")[0]?.values?.[0]?.[0] ?? 0;
  if (domCount === 0) {
    const domainInserts = [
      [1, 'الاستشارات'],
      [2, 'تقنية المعلومات والبرمجيات'],
      [3, 'الإنشاءات والتشييد']
    ];
    const stmt = db.prepare("INSERT INTO domains (ID, Name) VALUES (?, ?)");
    for (const d of domainInserts) stmt.run(d);
    stmt.free();
    console.log("Seeded minimal domains (1,2,3)");
  }
} catch {}

const buyers = [
  {
    Commercial_registration_number: "CR-1001",
    Commercial_Phone_number: 966501234567,
    domains_id: 2, // تقنية المعلومات والبرمجيات
    City: "الرياض",
    Logo: null,
    Account_name: "Ahmed Ali",
    Account_email: "ahmed@techsolutions.com",
    Account_phone: 966501234567,
    company_name: "Tech Solutions Ltd",
    Account_password: "password123",
  },
  {
    Commercial_registration_number: "CR-2002",
    Commercial_Phone_number: 966507654321,
    domains_id: 3, // الإنشاءات والتشييد
    City: "جدة",
    Logo: null,
    Account_name: "Fatima Noor",
    Account_email: "fatima@buildingmasters.com",
    Account_phone: 966507654321,
    company_name: "Building Masters Co",
    Account_password: "password456",
  },
];

const selectStmt = db.prepare("SELECT ID FROM Buyer WHERE Account_email = ?");
const insertStmt = db.prepare(`
  INSERT INTO Buyer (
    Commercial_registration_number, Commercial_Phone_number, domains_id, created_at, City,
    updated_at, Logo, Account_name, Account_email, Account_phone, company_name, Account_password
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const now = new Date().toISOString();
for (const b of buyers) {
  selectStmt.bind([b.Account_email]);
  const exists = selectStmt.step();
  selectStmt.reset();
  if (exists) {
    console.log("Skip (exists):", b.Account_email);
    continue;
  }
  insertStmt.run([
    b.Commercial_registration_number,
    b.Commercial_Phone_number,
    b.domains_id,
    now,
    b.City,
    now,
    b.Logo,
    b.Account_name,
    b.Account_email,
    b.Account_phone,
    b.company_name,
    b.Account_password,
  ]);
  console.log("Inserted:", b.Account_email);
}
insertStmt.free();
selectStmt.free();

// write DB file
const data = db.export();
fs.writeFileSync(DB_FILE, Buffer.from(data));
console.log("\nSeed complete ->", DB_FILE);
console.log("Sign-in test accounts:");
console.log("- ahmed@techsolutions.com / password123");
console.log("- fatima@buildingmasters.com / password456");
