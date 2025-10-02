import Database from 'sql.js';
import fs from 'fs';
import path from 'path';

async function testBuyerLogin() {
  console.log("🔐 Testing buyer login with new database structure...");
  
  try {
    // Load database
    const initSqlJs = (await import('sql.js')).default;
    const SQL = await initSqlJs();
    
    const dataDir = path.resolve(process.cwd(), "data");
    const dbPath = path.join(dataDir, "app.db");
    const dbData = fs.readFileSync(dbPath);
    const db = new SQL.Database(dbData);
    
    // Test login credentials
    const testEmail = 'ahmed.ali@techsolutions.sa';
    const testPassword = 'hashed_password_123';
    
    console.log(`🔍 Testing login for: ${testEmail}`);
    
    // Query buyer
    const result = db.exec("SELECT * FROM Buyer WHERE Account_email = ?", [testEmail]);
    
    if (result.length === 0 || result[0].values.length === 0) {
      console.log("❌ No buyer found with that email");
      return;
    }
    
    const columns = result[0].columns;
    const values = result[0].values[0];
    
    // Create buyer object
    const buyer = {};
    columns.forEach((col, index) => {
      buyer[col] = values[index];
    });
    
    console.log("✅ Found buyer:", buyer.company_name);
    console.log("📧 Email:", buyer.Account_email);
    console.log("🏢 Company:", buyer.company_name);
    console.log("🌍 City:", buyer.City);
    console.log("🏷️ Domain ID:", buyer.domains_id);
    
    // Check password
    if (buyer.Account_password === testPassword) {
      console.log("✅ Password matches!");
      
      // Get domain name
      const domainResult = db.exec("SELECT Name FROM domains WHERE ID = ?", [buyer.domains_id]);
      if (domainResult.length > 0 && domainResult[0].values.length > 0) {
        const domainName = domainResult[0].values[0][0];
        console.log("🎯 Domain:", domainName);
      }
      
      console.log("🎉 Login test successful!");
    } else {
      console.log("❌ Password doesn't match");
    }
    
  } catch (error) {
    console.error("❌ Login test failed:", error);
  }
}

testBuyerLogin();