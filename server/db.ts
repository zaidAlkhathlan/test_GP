import path from "path";
import fs from "fs";
import initSqlJs, { Database } from 'sql.js';

const dbPath = path.resolve(process.cwd(), "data", "app.db");

export let db: any;

/**
 * Initializes and exports a connection to the pre-built SQLite database.
 */
export async function initDatabase(): Promise<Database> {
  if (db) {
    return db;
  }

  console.log("📖 Loading database from", dbPath);

  if (!fs.existsSync(dbPath)) {
    throw new Error(
      `Database file not found at ${dbPath}. Run 'npm run db:build' to create it.`
    );
  }

  try {
    const SQL = await initSqlJs({
      locateFile: file => `node_modules/sql.js/dist/${file}`
    });

    const dbData = fs.readFileSync(dbPath);
    const loadedDb = new SQL.Database(dbData);

    // Create a complete wrapper for compatibility with all existing route files.
    db = {
      /**
       * Fetches a single row.
       */
      get: (sql: string, params: any[], callback: (err: Error | null, row?: any) => void) => {
        try {
          const stmt = loadedDb.prepare(sql, params);
          let row: any = null;
          if (stmt.step()) {
            row = stmt.getAsObject();
          }
          stmt.free();
          callback(null, row);
        } catch (err: any) {
          callback(err, undefined);
        }
      },

      /**
       * Fetches all rows.
       */
      all: (sql: string, params: any[], callback: (err: Error | null, rows?: any[]) => void) => {
        try {
          const stmt = loadedDb.prepare(sql, params);
          const rows: any[] = [];
          while (stmt.step()) {
            rows.push(stmt.getAsObject());
          }
          stmt.free();
          callback(null, rows);
        } catch (err: any) {
          callback(err, undefined);
        }
      },

      /**
       * Runs a command that does not return rows (e.g., INSERT, UPDATE, DELETE).
       */
      run: (sql: string, params: any[], callback?: (err: Error | null) => void) => {
        try {
          loadedDb.run(sql, params);
          if (callback) {
            callback(null);
          }
        } catch (err: any) {
          if (callback) {
            callback(err);
          }
        }
      },
    };

    console.log("✅ Database loaded and ready.");
    return db;
  } catch (error) {
    console.error("❌ Failed to load database:", error);
    throw error;
  }
}