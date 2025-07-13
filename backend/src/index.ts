import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createUserTable } from "./db";
import { registerUser, loginUser, verifyToken } from "./auth";
import type { JwtPayload } from "jsonwebtoken";
import { existsSync, readFileSync } from "fs";

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

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  }),
);
app.use(bodyParser.json());

async function initializeDatabase() {
  try {
    await createUserTable();
    console.log("User table ready");
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
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

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/tmdb/discover", async (req, res) => {
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    console.log("TMDB_API_KEY exists:", !!TMDB_API_KEY);

    if (!TMDB_API_KEY) {
      console.error("TMDB API key not found in environment variables");
      return res.status(500).json({ error: "TMDB API key not configured" });
    }

    console.log("Fetching movies from TMDB API...");
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      },
    );

    console.log("TMDB API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDB API error:", response.status, errorText);
      throw new Error(`TMDB API error: ${response.status} - ${errorText}`);
    }

    const data: any = await response.json();
    console.log("Successfully fetched", data.results?.length || 0, "movies");
    res.json(data);
  } catch (error: any) {
    console.error("TMDB discover error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch movies", details: error.message });
  }
});

app.get("/api/tmdb/search", async (req, res) => {
  try {
    const { query } = req.query;
    const TMDB_API_KEY = process.env.TMDB_API_KEY;

    if (!TMDB_API_KEY) {
      return res.status(500).json({ error: "TMDB API key not configured" });
    }

    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    console.log("Searching TMDB for:", query);
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query as string)}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDB search API error:", response.status, errorText);
      throw new Error(`TMDB API error: ${response.status} - ${errorText}`);
    }

    const data: any = await response.json();
    console.log("Search results:", data.results?.length || 0, "movies");
    res.json(data);
  } catch (error: any) {
    console.error("TMDB search error:", error);
    res
      .status(500)
      .json({ error: "Failed to search movies", details: error.message });
  }
});

async function startServer() {
  try {
    await initializeDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(
        `Health check available at http://localhost:${PORT}/api/health`,
      );
    });

    server.on("error", (error) => {
      console.error("Server error:", error);
      process.exit(1);
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received, shutting down");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
