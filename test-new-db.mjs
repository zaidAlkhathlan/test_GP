import { initDatabase } from './server/db.js';

async function testDatabase() {
  console.log("🧪 Testing database setup...");
  
  try {
    const db = await initDatabase();
    console.log("✅ Database initialized successfully");
    
    // Test querying domains
    db.all("SELECT * FROM domains", [], (err, rows) => {
      if (err) {
        console.error("❌ Error querying domains:", err);
      } else {
        console.log("📊 Domains:", rows);
      }
    });
    
    // Test querying buyers
    db.all("SELECT * FROM Buyer", [], (err, rows) => {
      if (err) {
        console.error("❌ Error querying buyers:", err);
      } else {
        console.log("👤 Buyers:", rows);
      }
    });
    
    // Test querying licenses
    db.all("SELECT * FROM Licenses", [], (err, rows) => {
      if (err) {
        console.error("❌ Error querying licenses:", err);
      } else {
        console.log("📜 Licenses:", rows);
      }
    });
    
    console.log("🎉 Database test completed!");
    
  } catch (error) {
    console.error("❌ Database test failed:", error);
  }
}

testDatabase();