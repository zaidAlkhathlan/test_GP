import fs from "fs";
import path from "path";
import initSqlJs from "sql.js";

const DB_FILE = path.resolve("./data/app.db");

console.log("🔍 Database file check:", fs.existsSync(DB_FILE) ? "EXISTS" : "NOT FOUND");

if (!fs.existsSync(DB_FILE)) {
  console.log("❌ Database file does not exist!");
  process.exit(1);
}

const SQL = await initSqlJs({
  locateFile: (file) => path.join("node_modules", "sql.js", "dist", file),
});

// Load the database
const fileBuffer = fs.readFileSync(DB_FILE);
const db = new SQL.Database(new Uint8Array(fileBuffer));

console.log("✅ Database loaded successfully");

// Check domains
const domainsResult = db.exec("SELECT COUNT(*) as count FROM domains");
const domainCount = domainsResult[0]?.values?.[0]?.[0] ?? 0;
console.log(`📊 Domains count: ${domainCount}`);

// Check buyers
try {
  const buyersResult = db.exec("SELECT COUNT(*) as count FROM Buyer");
  const buyerCount = buyersResult[0]?.values?.[0]?.[0] ?? 0;
  console.log(`👥 Buyers count: ${buyerCount}`);
} catch (e) {
  console.log("ℹ️  Buyer table not found or error:", e.message);
}

// Check tenders
try {
  const tendersResult = db.exec("SELECT COUNT(*) as count FROM tender");
  const tenderCount = tendersResult[0]?.values?.[0]?.[0] ?? 0;
  console.log(`📋 Tenders count: ${tenderCount}`);

  if (tenderCount > 0) {
    console.log("\n📄 Tender details:");
    const tenderDetails = db.exec(`
      SELECT id, title, reference_number, city, created_at 
      FROM tender 
      ORDER BY id
    `);
    
    if (tenderDetails.length > 0) {
      tenderDetails[0].values.forEach((row, index) => {
        console.log(`${index + 1}. ID: ${row[0]}, Title: ${row[1]}, Ref: ${row[2]}, City: ${row[3]}, Created: ${row[4]}`);
      });
    }
  }
} catch (e) {
  console.log("❌ Tender table error:", e.message);
}

db.close();
console.log("✅ Database verification complete");