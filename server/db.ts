import path from "path";
import fs from "fs";

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
  const createInquiriesTable = `
    CREATE TABLE IF NOT EXISTS Inquiry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tender_id TEXT NOT NULL,
      supplier_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createAnswersTable = `
    CREATE TABLE IF NOT EXISTS InquiryAnswer (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      inquiry_id INTEGER NOT NULL,
      buyer_id INTEGER NOT NULL,
      answer_text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (inquiry_id) REFERENCES Inquiry(id)
    );
  `;

  try {
    // Dynamically import sql.js to avoid bundler resolving it at config time
    let initSqlJs: any;
    try {
      const mod = await import("sql.js");
      initSqlJs = mod.default ?? mod;
    } catch (e) {
      // Will be handled below by falling back to in-memory
      initSqlJs = null;
    }

    if (initSqlJs) {
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
    
    // Create the tables
    realDb.run(createTable);
    realDb.run(createInquiriesTable);
    realDb.run(createAnswersTable);
    
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
      return db;
    }
  } catch (err: any) {
    console.warn("sql.js not available or failed to initialize — falling back to in-memory DB.");
    // fall through to in-memory fallback below
  }

  // In-memory fallback when sql.js is unavailable
  const rows: any[] = [];
  let autoId = 1;

  db = {
    run(sql: string, params: any[], cb?: (this: any, err: Error | null) => void) {
      try {
        if (/INSERT INTO Buyer/i.test(sql)) {
          const [
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
            certificates,
          ] = params;

          const row = {
            id: autoId++,
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
            certificates,
            created_at: new Date().toISOString(),
            updated_at: null,
          };
          rows.push(row);
          if (cb) cb.call({ lastID: row.id }, null as any);
        } else {
          if (cb) cb(null as any);
        }
      } catch (e: any) {
        if (cb) cb(e);
      }
      return { lastID: autoId - 1 };
    },
    get(sql: string, params: any[], cb: (err: Error | null, row?: any) => void) {
      try {
        const m = sql.match(/WHERE id = \?/i);
        if (m) {
          const id = params[0];
          const found = rows.find((r) => r.id === id);
          cb(null, found || null);
          return;
        }
        cb(null, null);
      } catch (e: any) {
        cb(e, undefined);
      }
    },
    all(_sql: string, _params: any[], cb: (err: Error | null, rows?: any[]) => void) {
      cb(null, rows.slice());
    },
    serialize(cb: () => void) {
      cb();
    },
  };

  return db;
}
