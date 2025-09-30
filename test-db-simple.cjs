// Simple database test script
const path = require("path");
const fs = require("fs");

async function testDatabase() {
  console.log("🧪 Testing database setup directly...");
  
  try {
    // Import the database module
    const { initDatabase } = await import('./dist/server/node-build.mjs');
    
    console.log("✅ Database module loaded");
    
    const db = await initDatabase();
    console.log("✅ Database initialized successfully");
    
    // Test a simple query
    db.all("SELECT COUNT(*) as count FROM domains", [], (err, rows) => {
      if (err) {
        console.error("❌ Error querying domains:", err);
      } else {
        console.log("📊 Domains count:", rows);
      }
    });
    
    console.log("🎉 Database test completed!");
    
  } catch (error) {
    console.error("❌ Database test failed:", error);
  }
}

testDatabase();