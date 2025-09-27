import path from "path";
import fs from "fs";
import initSqlJs from "sql.js";

const dataDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, "app.db");

// Define database interface for compatibility
interface DatabaseWrapper {
  run(sql: string, params: any[], callback?: (this: any, err: Error | null) => void): { lastID: number };
  get(sql: string, params: any[], callback: (err: Error | null, row?: any) => void): void;
  all(sql: string, params: any[], callback: (err: Error | null, rows?: any[]) => void): void;
  serialize(callback: () => void): void;
}

// exported `db` will be a database wrapper
export let db: DatabaseWrapper;

export async function initDatabase() {
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

  try {
    // Initialize sql.js
    const SQL = await initSqlJs();
    
    // Load existing database file or create new one
    let dbData: Uint8Array | undefined;
    if (fs.existsSync(dbPath)) {
      dbData = fs.readFileSync(dbPath);
      console.log("📖 Loading existing database from", dbPath);
    } else {
      console.log("🆕 Creating new database at", dbPath);
    }
    
    const realDb = new SQL.Database(dbData);
    
    // Create the table
    realDb.run(createTable);
    
    // Save database to file
    const data = realDb.export();
    fs.writeFileSync(dbPath, data);
    
    console.log("✅ SQLite database initialized successfully at", dbPath);
    console.log("📁 Database file created:", fs.existsSync(dbPath) ? "YES" : "NO");
    
    // Create a wrapper object to maintain compatibility with old sqlite3 API
    const dbWrapper: DatabaseWrapper = {
      run(sql: string, params: any[], callback?: (this: any, err: Error | null) => void) {
        try {
          console.log("🔧 SQL run:", sql);
          console.log("🔧 Params:", params);
          
          const stmt = realDb.prepare(sql);
          stmt.bind(params);
          const result = stmt.step();
          
          // Get the last insert rowid
          const lastID = realDb.exec("SELECT last_insert_rowid() as id")[0]?.values[0]?.[0] as number || 0;
          
          console.log("🔧 Insert result - lastID:", lastID);
          
          stmt.free();
          
          // Save database after modification
          const data = realDb.export();
          fs.writeFileSync(dbPath, data);
          console.log("💾 Database saved to file");
          
          if (callback) {
            callback.call({ lastID }, null);
          }
          
          return { lastID };
        } catch (err: any) {
          console.error("🔧 Database run error:", err);
          if (callback) {
            callback.call({}, err);
          }
          throw err;
        }
      },
      
      get(sql: string, params: any[], callback: (err: Error | null, row?: any) => void) {
        try {
          const stmt = realDb.prepare(sql);
          stmt.bind(params);
          
          let row: any = null;
          if (stmt.step()) {
            const columns = stmt.getColumnNames();
            const values = stmt.get();
            row = {};
            columns.forEach((col, index) => {
              row[col] = values[index];
            });
          }
          
          stmt.free();
          callback(null, row);
        } catch (err: any) {
          callback(err, undefined);
        }
      },
      
      all(sql: string, params: any[], callback: (err: Error | null, rows?: any[]) => void) {
        try {
          const stmt = realDb.prepare(sql);
          stmt.bind(params);
          
          const rows: any[] = [];
          const columns = stmt.getColumnNames();
          
          while (stmt.step()) {
            const values = stmt.get();
            const row: any = {};
            columns.forEach((col, index) => {
              row[col] = values[index];
            });
            rows.push(row);
          }
          
          stmt.free();
          callback(null, rows);
        } catch (err: any) {
          callback(err, undefined);
        }
      },
      
      serialize(callback: () => void) {
        callback();
      }
    };
    
    // Assign the wrapper to db
    db = dbWrapper;
    
  } catch (err: any) {
    console.error("❌ Failed to initialize SQLite database:", err.message);
    throw err;
  }

  return db;
}
