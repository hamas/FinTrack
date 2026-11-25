/**
 * Local SQLite database connection initialization.
 * 
 * Configures the primary connection to the local database file and 
 * ensures the foundational schema (Categories, Transactions, Recurring) is built.
 * 
 * @module data/data-sources/sqlite
 */

import Database from 'better-sqlite3';
import path from 'path';

// Resolve the database against the project root for consistent access
const dbPath = path.resolve(process.cwd(), 'data/fintrack.db');
const db = new Database(dbPath);

// Execute foundational schema setup synchronously on startup

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    iconName TEXT NOT NULL,
    color TEXT NOT NULL,
    type TEXT NOT NULL,
    budget REAL
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    categoryId TEXT NOT NULL,
    isRecurring INTEGER NOT NULL DEFAULT 0,
    frequency TEXT,
    recurringId TEXT,
    FOREIGN KEY (categoryId) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS recurring_transactions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    categoryId TEXT NOT NULL,
    frequency TEXT NOT NULL,
    nextDate TEXT NOT NULL,
    endDate TEXT,
    metadata TEXT,
    FOREIGN KEY (categoryId) REFERENCES categories(id)
  );
`);

// Seed the database with default categories if it is completely empty
const count = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare('INSERT INTO categories (id, name, iconName, color, type, budget) VALUES (?, ?, ?, ?, ?, ?)');
  insert.run('1', 'Food & Dining', 'Coffee', '#10b981', 'expense', 600);
  insert.run('2', 'Entertainment', 'PieChart', '#f59e0b', 'expense', 300);
  insert.run('3', 'Shopping', 'ShoppingBag', '#3b82f6', 'expense', 1000);
  insert.run('4', 'Transport', 'Car', '#f43f5e', 'expense', 200);
  insert.run('5', 'Salary', 'ArrowUpRight', '#10b981', 'income', null);
}

export default db;
