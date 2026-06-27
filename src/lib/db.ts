import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "hub.sqlite");

declare global {
  var __hubDb: DatabaseSync | undefined;
}

function init(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      recurring INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      amount_gross REAL NOT NULL,
      amount_net REAL NOT NULL,
      payment_plan TEXT NOT NULL DEFAULT 'comptant',
      installments_paid INTEGER NOT NULL DEFAULT 1,
      installments_total INTEGER NOT NULL DEFAULT 1,
      sold_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT,
      spent_at TEXT NOT NULL DEFAULT (datetime('now')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL UNIQUE,
      target_amount REAL NOT NULL
    );
  `);
}

export function getDb(): DatabaseSync {
  if (!global.__hubDb) {
    const db = new DatabaseSync(dbPath);
    init(db);
    global.__hubDb = db;
  }
  return global.__hubDb;
}
