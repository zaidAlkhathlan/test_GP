import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';

// Create data dir
const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'app.db');

console.log('Initializing sql.js (WebAssembly) ...');
const SQL = await initSqlJs({
  locateFile: (file) => path.resolve(process.cwd(), 'node_modules', 'sql.js', 'dist', file),
});

const db = new SQL.Database();

const createTable = `
CREATE TABLE IF NOT EXISTS Buyer (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  commercial_registration_number TEXT NOT NULL,
  commercial_phone_number TEXT NOT NULL,
  industry TEXT NOT NULL,
  company_name TEXT NOT NULL,
  city TEXT NOT NULL,
  logo TEXT,
  account_name TEXT NOT NULL,
  account_email TEXT NOT NULL,
  account_phone TEXT NOT NULL,
  account_password TEXT NOT NULL,
  licenses TEXT,
  certificates TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME
);
`;

db.run(createTable);

const buyers = [
  [
    'CR123456789',
    '+966501234567',
    'Technology',
    'Tech Solutions Ltd',
    'Riyadh',
    null,
    'Ahmed Al-Rashid',
    'ahmed@techsolutions.com',
    '+966501234567',
    'password123',
    'IT License 2024',
    'ISO 9001:2015'
  ],
  [
    'CR987654321',
    '+966507654321',
    'Construction',
    'Building Masters Co',
    'Jeddah',
    null,
    'Fatima Al-Zahra',
    'fatima@buildingmasters.com',
    '+966507654321',
    'password456',
    'Construction License 2024',
    'Safety Certificate 2024'
  ]
];

const insertSql = `INSERT INTO Buyer (
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
  certificates
) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);`;

const stmt = db.prepare(insertSql);
for (const row of buyers) {
  stmt.run(row);
}
stmt.free && stmt.free();

// Export and write to disk
const binaryArray = db.export();
fs.writeFileSync(dbPath, Buffer.from(binaryArray));
console.log('Wrote database to', dbPath);

// Quick verification: open the file with a new sql.js instance and query
const db2 = new SQL.Database(fs.readFileSync(dbPath));
const res = db2.exec("SELECT id, company_name, account_email, account_password FROM Buyer;");
if (res && res.length) {
  const cols = res[0].columns;
  console.log('\nInserted rows:');
  for (const row of res[0].values) {
    const out = {};
    cols.forEach((c, i) => out[c] = row[i]);
    console.log(out);
  }
} else {
  console.log('No rows found after seeding');
}

db.close();
db2.close();
