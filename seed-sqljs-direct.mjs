import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const sqljsPath = path.resolve(process.cwd(), 'node_modules', 'sql.js', 'dist', 'sql-wasm.js');
const wasmPath = path.resolve(process.cwd(), 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');

console.log('Loading SQL.js from:', sqljsPath);
const initSqlJs = (await import(pathToFileURL(sqljsPath).href)).default || (await import(pathToFileURL(sqljsPath).href));

// fallback in case default export isn't the function
const init = typeof initSqlJs === 'function' ? initSqlJs : initSqlJs.initSqlJs || initSqlJs.default;

const SQL = await init({ locateFile: () => wasmPath });

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'app.db');

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
for (const row of buyers) stmt.run(row);
stmt.free && stmt.free();

fs.writeFileSync(dbPath, Buffer.from(db.export()));
console.log('Wrote database to', dbPath);

// verify
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
