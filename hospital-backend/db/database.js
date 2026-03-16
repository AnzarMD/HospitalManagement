const path = require("path");
const fs   = require("fs");
const initSqlJs = require("sql.js");

const DB_PATH = path.join(__dirname, "hospital.db");

let _db = null;

// Save DB to disk after every write
function persist(db) {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// Wrap sql.js to look like better-sqlite3 (synchronous API)
function createWrapper(sqlDb) {
  return {
    prepare: (sql) => ({
      run: (...params) => {
        // Flatten single object param (named params) into positional
        if (params.length === 1 && typeof params[0] === "object" && !Array.isArray(params[0])) {
          // Extract values in the order of ? placeholders by matching @key patterns
          const obj = params[0];
          const keys = [];
          sql.replace(/@(\w+)/g, (_, k) => keys.push(k));
          params = keys.map(k => obj[k] ?? null);
        }
        sqlDb.run(sql, params);
        persist(sqlDb);
        return { changes: sqlDb.getRowsModified() };
      },
      get: (...params) => {
        if (params.length === 1 && typeof params[0] === "object" && !Array.isArray(params[0])) {
          const obj = params[0];
          const keys = [];
          sql.replace(/@(\w+)/g, (_, k) => keys.push(k));
          params = keys.map(k => obj[k] ?? null);
        }
        const stmt = sqlDb.prepare(sql);
        stmt.bind(params);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        }
        stmt.free();
        return undefined;
      },
      all: (...params) => {
        if (params.length === 1 && typeof params[0] === "object" && !Array.isArray(params[0])) {
          const obj = params[0];
          const keys = [];
          sql.replace(/@(\w+)/g, (_, k) => keys.push(k));
          params = keys.map(k => obj[k] ?? null);
        }
        const results = [];
        const stmt = sqlDb.prepare(sql);
        stmt.bind(params);
        while (stmt.step()) results.push(stmt.getAsObject());
        stmt.free();
        return results;
      },
    }),
    exec: (sql) => { sqlDb.run(sql); persist(sqlDb); },
    run:  (sql, ...params) => { sqlDb.run(sql, params.flat()); persist(sqlDb); },
    pragma: () => {},
    close: () => { persist(sqlDb); sqlDb.close(); },
    getRowsModified: () => sqlDb.getRowsModified(),
  };
}

async function getDb() {
  if (_db) return _db;

  const SQL = await initSqlJs();
  let sqlDb;

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    sqlDb = new SQL.Database(fileBuffer);
  } else {
    sqlDb = new SQL.Database();
  }

  const db = createWrapper(sqlDb);

  // Schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      username   TEXT UNIQUE NOT NULL,
      password   TEXT NOT NULL,
      role       TEXT NOT NULL,
      name       TEXT NOT NULL,
      title      TEXT NOT NULL,
      avatar     TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS patients (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      age         INTEGER,
      gender      TEXT,
      ward        TEXT,
      doctor      TEXT,
      status      TEXT DEFAULT 'Stable',
      admitted    TEXT,
      blood_group TEXT,
      phone       TEXT,
      created_at  TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS staff (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      role       TEXT,
      dept       TEXT,
      shift      TEXT,
      status     TEXT DEFAULT 'Active',
      joined     TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS appointments (
      id         TEXT PRIMARY KEY,
      patient    TEXT NOT NULL,
      doctor     TEXT NOT NULL,
      date       TEXT,
      time       TEXT,
      type       TEXT,
      status     TEXT DEFAULT 'Pending',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS inventory (
      id         TEXT PRIMARY KEY,
      name       TEXT NOT NULL,
      category   TEXT,
      stock      INTEGER DEFAULT 0,
      unit       TEXT,
      threshold  INTEGER DEFAULT 0,
      supplier   TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  _db = db;
  return db;
}

module.exports = { getDb };
