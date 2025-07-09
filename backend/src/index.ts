import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createUserTable } from "./db";
import { registerUser, loginUser, verifyToken } from "./auth";
import type { JwtPayload } from "jsonwebtoken";
import { existsSync, readFileSync } from "fs";

// Debug: Show working directory and .env status
console.log("CWD:", process.cwd());
console.log(".env exists:", existsSync(".env"));
if (existsSync(".env")) {
  console.log(".env contents:\n", readFileSync(".env", "utf8"));
}

// Debug: Show PORT from env
console.log("PORT from env after dotenv:", process.env.PORT);

const PORT = Number(process.env.PORT) || 3001;
console.log("PORT variable:", PORT);

const app = express();

app.use(cors());
app.use(bodyParser.json());

createUserTable().then(() => {
  console.log("User table ready");
});

app.post("/api/register", async (req, res) => {
  console.log("Register request received:", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("Registration failed: Missing username or password");
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const user = await registerUser(username, password);
    console.log(`User registered successfully: ${username}`);
    res.status(201).json({ user });
  } catch (err: any) {
    console.error("Registration error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  console.log("Login request received:", req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    console.log("Login failed: Missing username or password");
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    console.log(`Attempting login for user: ${username}`);
    const { token } = await loginUser(username, password);
    console.log(`Login successful for user: ${username}, token generated`);
    res.status(200).json({ token });
  } catch (err: any) {
    console.error("Login error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token: string | undefined = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  const payload: string | null | JwtPayload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid token" });
  }
  res.json({ profile: payload });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
