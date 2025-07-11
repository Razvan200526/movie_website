import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { resolve } from "path";

export async function openDb() {
  try {
    const dbPath = resolve("./db.sqlite");
    console.log("Opening database at:", dbPath);

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log("Database connection opened successfully");
    return db;
  } catch (error) {
    console.error("Failed to open database:", error);
    throw error;
  }
}

export async function createUserTable() {
  try {
    const db = await openDb();
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("User table created/verified successfully");
    await db.close();
  } catch (error) {
    console.error("Failed to create user table:", error);
    throw error;
  }
}
