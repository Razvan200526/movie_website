import { openDb } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function registerUser(username: string, password: string) {
  const db = await openDb();
  const existing = await db.get("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  if (existing) {
    throw new Error("Username already exists");
  }
  const hashed = await bcrypt.hash(password, 10);
  await db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    username,
    hashed,
  );
  return { username };
}

export async function loginUser(username: string, password: string) {
  const db = await openDb();
  const user = await db.get("SELECT * FROM users WHERE username = ?", username);
  if (!user) {
    throw new Error("Invalid username or password");
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Invalid username or password");
  }
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return { token };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error: any) {
    return null;
  }
}
