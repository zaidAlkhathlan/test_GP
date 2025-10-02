import Database from 'sql.js';
import fs from 'fs';
import path from 'path';

async function createSampleBuyer() {
  console.log("👤 Creating a sample buyer with new domain structure...");
  
  try {
    // Load database
    const initSqlJs = (await import('sql.js')).default;
    const SQL = await initSqlJs();
    
    const dataDir = path.resolve(process.cwd(), "data");
    const dbPath = path.join(dataDir, "app.db");
    const dbData = fs.readFileSync(dbPath);
    const db = new SQL.Database(dbData);
    
    // Create a new buyer for "التسويق والإعلام والإبداع" domain
    const now = new Date().toISOString();
    
    const buyerData = {
      id: 10,
      commercial_registration_number: '6060987654',
      commercial_phone_number: '+966612345678',
      domains_id: 6, // التسويق والإعلام والإبداع
      city: 'الرياض',
      account_name: 'نوره عبدالله الحربي',
      account_email: 'noura.alharbi@creativesolutions.sa',
      account_phone: 966506789012,
      company_name: 'شركة الحلول الإبداعية للتسويق',
      account_password: 'hashed_password_creative'
    };
    
    // Insert the buyer
    db.run(`INSERT OR REPLACE INTO Buyer (
      ID, Commercial_registration_number, Commercial_Phone_number, domains_id,
      created_at, City, updated_at, Logo, Account_name, Account_email,
      Account_phone, company_name, Account_password
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      buyerData.id, buyerData.commercial_registration_number, buyerData.commercial_phone_number,
      buyerData.domains_id, now, buyerData.city, now, null, buyerData.account_name,
      buyerData.account_email, buyerData.account_phone, buyerData.company_name, buyerData.account_password
    ]);
    
    console.log("✅ Buyer created successfully!");
    
    // Test the relationship
    const buyerWithDomain = db.exec(`
      SELECT b.company_name, b.Account_name, b.City, d.Name as domain_name
      FROM Buyer b
      JOIN domains d ON b.domains_id = d.ID
      WHERE b.ID = ?
    `, [buyerData.id]);
    
    if (buyerWithDomain.length > 0) {
      const [company, name, city, domain] = buyerWithDomain[0].values[0];
      console.log("\n🔍 Buyer Details:");
      console.log(`   • Company: ${company}`);
      console.log(`   • Account Name: ${name}`);
      console.log(`   • City: ${city}`);
      console.log(`   • Domain: ${domain}`);
    }
    
    // Show available sub-domains for this buyer's domain
    const subDomains = db.exec(`
      SELECT Name FROM sub_domains WHERE domain_id = ? ORDER BY ID
    `, [buyerData.domains_id]);
    
    if (subDomains.length > 0) {
      console.log("\n📋 Available Sub-domains for this buyer:");
      subDomains[0].values.forEach(([subName]) => {
        console.log(`   ├─ ${subName}`);
      });
    }
    
    // Save database
    const data = db.export();
    fs.writeFileSync(dbPath, data);
    
    console.log("\n💾 Database updated and saved!");
    console.log("🎉 Sample buyer creation completed!");
    
  } catch (error) {
    console.error("❌ Error creating sample buyer:", error);
  }
}

createSampleBuyer();