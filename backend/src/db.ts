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

export async function createUserListTable() {
  try {
    const db = await openDb();
    await db.exec(`
      CREATE TABLE IF NOT EXISTS user_lists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        media_id INTEGER NOT NULL,
        media_type TEXT NOT NULL,
        title TEXT NOT NULL,
        overview TEXT,
        poster_path TEXT,
        backdrop_path TEXT,
        release_date TEXT,
        vote_average REAL,
        added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        UNIQUE(user_id, media_id, media_type)
      )
    `);
    console.log("User list table created/verified successfully");
    await db.close();
  } catch (error) {
    console.error("Failed to create user list table:", error);
    throw error;
  }
}

export async function getUserList(userId: number) {
  try {
    const db = await openDb();
    const items = await db.all(
      `SELECT * FROM user_lists WHERE user_id = ? ORDER BY added_at DESC`,
      [userId],
    );
    await db.close();
    return items;
  } catch (error: any) {
    console.error("Failed to get user list : ", error);
    throw error;
  }
}

export async function addToUserList(userId: number, mediaItem: any) {
  try {
    const db = await openDb();

    // Debug what we received
    console.log(
      "addToUserList - received mediaItem:",
      JSON.stringify(mediaItem, null, 2),
    );
    console.log("addToUserList - available keys:", Object.keys(mediaItem));

    // Handle different possible ID fields
    const mediaId =
      mediaItem.id ||
      mediaItem.tmdb_id ||
      mediaItem.movie_id ||
      mediaItem.tv_id;
    console.log("addToUserList - resolved mediaId:", mediaId);

    if (!mediaId) {
      console.error("No ID found in mediaItem:", mediaItem);
      throw new Error(
        "Media item missing ID field. Available fields: " +
          Object.keys(mediaItem).join(", "),
      );
    }

    await db.run(
      `INSERT OR REPLACE INTO user_lists
      (user_id, media_id, media_type, title, overview, poster_path, backdrop_path, release_date, vote_average)
      VALUES(?, ? ,? ,? ,? ,? ,? ,? ,?)`,
      [
        userId,
        mediaId,
        mediaItem.media_type || "movie",
        mediaItem.title || mediaItem.name || "Unknown Title",
        mediaItem.overview || "",
        mediaItem.poster_path || "",
        mediaItem.backdrop_path || "",
        mediaItem.release_date || mediaItem.first_air_date || "",
        mediaItem.vote_average || 0,
      ],
    );
    await db.close();
    console.log("Successfully added to user list:", mediaId);
  } catch (error) {
    console.error("Failed to add to user list: ", error);
    throw error;
  }
}

export async function removeFromUserList(userId: number, mediaId: number) {
  try {
    const db = await openDb();
    await db.run(`DELETE FROM user_lists WHERE user_id = ? AND media_id = ?`, [
      userId,
      mediaId,
    ]);
    await db.close();
  } catch (error) {
    console.error("Failed to remove from user list:", error);
    throw error;
  }
}

export async function isInUserList(
  userId: number,
  mediaId: number,
): Promise<boolean> {
  try {
    const db = await openDb();
    const result = await db.get(
      `SELECT 1 FROM user_lists WHERE user_id = ? AND media_id = ? LIMIT 1`,
      [userId, mediaId],
    );
    await db.close();
    return !!result;
  } catch (error) {
    console.error("Failed to check if item is in user list:", error);
    throw error;
  }
}
