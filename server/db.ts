import path from "path";
import fs from "fs";

const dataDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, "app.db");

// exported `db` will be assigned either to a sqlite3 Database or to an in-memory fallback
export let db: any;

export function initDatabase() {
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
    // Try to load native sqlite3. If it fails (missing binding), fall back.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sqlite3 = require("sqlite3");
    const sqlite = sqlite3.verbose();
    db = new sqlite.Database(dbPath);
    db.serialize(() => {
      db.run(createTable);
    });
    console.log("SQLite database initialized at", dbPath);
  } catch (err) {
    console.warn("sqlite3 native bindings not available — falling back to in-memory DB for development.");

    // Simple in-memory fallback implementing run(sql, params..., cb) and get(sql, params..., cb)
    const rows: any[] = [];
    let autoId = 1;

    db = {
      run(sql: string, params: any[], cb?: (err: Error | null) => void) {
        try {
          // Very naive INSERT parsing for the expected query shape used in routes
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
            // simulate this.lastID via callback context
            if (cb) cb(null as any);
          } else {
            if (cb) cb(null as any);
          }
        } catch (e: any) {
          if (cb) cb(e);
        }
        // return an object with lastID for compatibility when caller uses function's this
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
      serialize(cb: () => void) {
        cb();
      },
    };
  }

  return db;
}
