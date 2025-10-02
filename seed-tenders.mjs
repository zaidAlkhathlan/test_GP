import fs from "fs";
import path from "path";
import initSqlJs from "sql.js";

const DB_DIR = path.resolve("./data");
const DB_FILE = path.join(DB_DIR, "app.db");

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const SQL = await initSqlJs({
  locateFile: (file) => path.join("node_modules", "sql.js", "dist", file),
});

// Load or create DB
let db;
if (fs.existsSync(DB_FILE)) {
  const fileBuffer = fs.readFileSync(DB_FILE);
  db = new SQL.Database(new Uint8Array(fileBuffer));
  console.log("Loaded existing DB:", DB_FILE);
} else {
  db = new SQL.Database();
  console.log("Created new DB in-memory (will write to", DB_FILE, ")");
}

// Ensure required tables exist
// domains table
db.run(`
  CREATE TABLE IF NOT EXISTS domains (
    ID INTEGER PRIMARY KEY,
    Name TEXT NOT NULL UNIQUE
  );
`);

// tender table (must match server/db.ts)
db.run(`
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
    FOREIGN KEY (buyer_id) REFERENCES Buyer(ID),
    FOREIGN KEY (domain_id) REFERENCES domains(ID)
  );
`);

// tender_sub_domains relationship table
db.run(`
  CREATE TABLE IF NOT EXISTS tender_sub_domains (
    tender_id     INTEGER NOT NULL,
    sub_domain_id INTEGER NOT NULL,
    PRIMARY KEY (tender_id, sub_domain_id),
    FOREIGN KEY (tender_id) REFERENCES tender(id),
    FOREIGN KEY (sub_domain_id) REFERENCES sub_domains(ID)
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
} catch (e) {
  console.log("Domains already exist or error:", e.message);
}

// Your tender data with sub-domains and buyer relationships
const tenders = [
  {
    buyer_id: 1, // Tech Solutions Ltd (ahmed@techsolutions.com)
    reference_number: 1001,
    title: 'مشروع ترحيل إلى السحابة',
    domain_id: 2, // تقنية المعلومات والبرمجيات
    project_description: 'ترحيل التطبيقات القديمة إلى البنية التحتية السحابية',
    city: 'الرياض',
    created_at: '2025-10-01 10:00:00',
    submit_deadline: '2025-11-01 23:59:59',
    quires_deadline: '2025-10-15 23:59:59',
    contract_time: '2026-01-01 00:00:00',
    previous_work: 'خبرة سابقة في مشاريع الترحيل إلى السحابة',
    evaluation_criteria: 'التكلفة، الخبرة، الامتثال الأمني',
    used_technologies: 'AWS, Docker, Kubernetes',
    tender_coordinator: 'أحمد العتيبي',
    coordinator_email: 'ahmed@example.com',
    coordinator_phone: '+966-555-123-456',
    sub_domains: [16, 15, 20] // خدمات السحابة، البنية التحتية والشبكات، الدعم الفني وإدارة الأنظمة
  },
  {
    buyer_id: 2, // Building Masters Inc (fatima@buildingmasters.com)
    reference_number: 1002,
    title: 'تعزيز الأمن السيبراني',
    domain_id: 2, // تقنية المعلومات والبرمجيات
    project_description: 'تطوير أنظمة المراقبة الأمنية وحماية الشبكات',
    city: 'جدة',
    created_at: '2025-09-15 09:00:00',
    submit_deadline: '2025-10-20 23:59:59',
    quires_deadline: '2025-10-05 23:59:59',
    contract_time: '2026-03-01 00:00:00',
    previous_work: 'سجل مثبت في اختبار الاختراق',
    evaluation_criteria: 'الامتثال، التكلفة، الخبرة التقنية',
    used_technologies: 'SIEM, IDS, Zero Trust',
    tender_coordinator: 'سارة الخطيب',
    coordinator_email: 'sara@example.com',
    coordinator_phone: '+966-555-987-654',
    sub_domains: [17, 15] // الأمن السيبراني، البنية التحتية والشبكات
  }
];

// Check existing tenders and insert new ones
const selectStmt = db.prepare("SELECT id FROM tender WHERE reference_number = ?");
const insertStmt = db.prepare(`
  INSERT INTO tender (
    buyer_id, reference_number, title, domain_id, project_description, city,
    created_at, submit_deadline, quires_deadline, contract_time, previous_work,
    evaluation_criteria, used_technologies, tender_coordinator,
    coordinator_email, coordinator_phone
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Prepare sub-domain relationship statement
const subDomainStmt = db.prepare("INSERT INTO tender_sub_domains (tender_id, sub_domain_id) VALUES (?, ?)");

for (const t of tenders) {
  selectStmt.bind([t.reference_number]);
  const exists = selectStmt.step();
  selectStmt.reset();
  if (exists) {
    console.log("Skip (exists):", t.title);
    continue;
  }
  
  insertStmt.run([
    t.buyer_id,
    t.reference_number,
    t.title,
    t.domain_id,
    t.project_description,
    t.city,
    t.created_at,
    t.submit_deadline,
    t.quires_deadline,
    t.contract_time,
    t.previous_work,
    t.evaluation_criteria,
    t.used_technologies,
    t.tender_coordinator,
    t.coordinator_email,
    t.coordinator_phone,
  ]);
  
  // Get the inserted tender ID
  const tenderIdResult = db.exec("SELECT last_insert_rowid() as id");
  const tenderId = tenderIdResult[0]?.values?.[0]?.[0];
  
  // Insert sub-domain relationships
  if (tenderId && t.sub_domains && t.sub_domains.length > 0) {
    for (const subDomainId of t.sub_domains) {
      try {
        subDomainStmt.run([tenderId, subDomainId]);
      } catch (e) {
        console.log(`  Warning: Could not link sub-domain ${subDomainId}:`, e.message);
      }
    }
    console.log(`Inserted: ${t.title} with ${t.sub_domains.length} sub-domains`);
  } else {
    console.log("Inserted:", t.title);
  }
}

insertStmt.free();
selectStmt.free();
subDomainStmt.free();

// Write DB file
const data = db.export();
fs.writeFileSync(DB_FILE, Buffer.from(data));
console.log("\nTender seed complete ->", DB_FILE);
console.log("Seeded tenders:");
console.log("1. مشروع ترحيل إلى السحابة (Cloud Migration)");
console.log("2. تعزيز الأمن السيبراني (Cybersecurity Enhancement)");

// Verify the data was written
const verifyDb = new SQL.Database(fs.readFileSync(DB_FILE));
const result = verifyDb.exec("SELECT id, title, reference_number FROM tender");
console.log("\nVerification - Tenders in database:");
if (result.length > 0) {
  result[0].values.forEach(row => {
    console.log(`- ID: ${row[0]}, Title: ${row[1]}, Ref: ${row[2]}`);
    
    // Check sub-domains for this tender
    const subDomainResult = verifyDb.exec(`
      SELECT sd.Name 
      FROM tender_sub_domains tsd 
      JOIN sub_domains sd ON tsd.sub_domain_id = sd.ID 
      WHERE tsd.tender_id = ${row[0]}
    `);
    
    if (subDomainResult.length > 0 && subDomainResult[0].values.length > 0) {
      const subDomains = subDomainResult[0].values.map(sdRow => sdRow[0]).join(', ');
      console.log(`  Sub-domains: ${subDomains}`);
    }
  });
} else {
  console.log("❌ No tenders found in verification!");
}
verifyDb.close();
db.close();