import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'fintrack.db');
const db = new Database(dbPath);

// Initialize tables
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

// Insert initial categories if empty
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
