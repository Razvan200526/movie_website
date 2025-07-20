import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { registerUser, loginUser, verifyToken } from "./auth";
import type { JwtPayload } from "jsonwebtoken";
import { existsSync, readFileSync } from "fs";
import {
  createUserTable,
  createUserListTable,
  getUserList,
  addToUserList,
  removeFromUserList,
  isInUserList,
} from "./db";

console.log("PORT from env after dotenv:", process.env.PORT);

const PORT = Number(process.env.PORT) || 3001;
console.log("PORT variable:", PORT);

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    optionsSuccessStatus: 200,
  }),
);
app.use(bodyParser.json());

async function initializeDatabase() {
  try {
    await createUserTable();
    await createUserListTable();
    console.log("Database tables ready");
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

app.get("/api/tmdb/movie/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    if (!TMDB_API_KEY) {
      return res.status(500).json({ error: "TMDB API key not configured" });
    }
    if (!id) {
      return res.status(400).json({ error: "Movie ID is required" });
    }
    console.log("Fetching movie details from ID: ", id);
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "TMDB movie details API error:",
        response.status,
        errorText,
      );
      throw new Error(`TMDB API error: ${response.status} - ${errorText}`);
    }
    const data: any = await response.json();
    console.log("Successfully fetched movie details for ID:", id);
    res.json(data);
  } catch (error: any) {
    console.error("TMDB movie details error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch movie details", details: error.message });
  }
});

app.get("/api/tmdb/movie/:id/videos", async (req, res) => {
  try {
    const { id } = req.params;
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    if (!TMDB_API_KEY) {
      return res.status(500).json({ error: "TMDB API key not configured" });
    }
    if (!id) {
      return res.status(400).json({ error: "Movie ID is required" });
    }
    console.log("Fetching movie videos for ID:", id);
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDB movie videos API error:", response.status, errorText);
      throw new Error(`TMDB API error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("TMDB movie videos error:", error);
    res.status(500).json({
      error: "Failed to fetch movie videos",
      details: error instanceof Error ? error.message : error,
    });
  }
});

app.get("/api/tmdb/discover/tv", async (req, res) => {
  try {
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    if (!TMDB_API_KEY) {
      console.error("Api key not found");
      return res.status(500).json({ error: "TMDB API key not configured" });
    }

    const response = await fetch(`https://api.themoviedb.org/3/discover/tv`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error("Error fetching TV Shows");
    }

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("TMDB discover/tv error : ", error);
    res
      .status(500)
      .json({ error: "Failed to fetch TV shows", details: error.message });
  }
});

// Endpoint to fetch TV show details
app.get("/api/tmdb/tv/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    if (!TMDB_API_KEY) {
      return res.status(500).json({ error: "TMDB API key not configured" });
    }
    if (!id) {
      return res.status(400).json({ error: "TV Show ID is required" });
    }
    console.log("Fetching TV show details from ID:", id);
    const response = await fetch(`https://api.themoviedb.org/3/tv/${id}`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "TMDB TV show details API error:",
        response.status,
        errorText,
      );
      throw new Error(`TMDB API error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    console.log("Successfully fetched TV show details for ID:", id);
    res.json(data);
  } catch (error) {
    console.error("TMDB TV show details error:", error);
    res.status(500).json({
      error: "Failed to fetch TV show details",
      details: error instanceof Error ? error.message : error,
    });
  }
});

// Endpoint to fetch TV show videos (trailers)
app.get("/api/tmdb/tv/:id/videos", async (req, res) => {
  try {
    const { id } = req.params;
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    if (!TMDB_API_KEY) {
      return res.status(500).json({ error: "TMDB API key not configured" });
    }
    if (!id) {
      return res.status(400).json({ error: "TV Show ID is required" });
    }
    console.log("Fetching TV show videos for ID:", id);
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/videos`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_API_KEY}`,
        },
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDB TV videos API error:", response.status, errorText);
      throw new Error(`TMDB API error: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("TMDB TV videos error:", error);
    res.status(500).json({
      error: "Failed to fetch TV show videos",
      details: error instanceof Error ? error.message : error,
    });
  }
});

// My List endpoints
app.get("/api/list", async (req, res) => {

  const authHeader = req.headers.authorization;
  console.log("[GET /api/list] Authorization header:", authHeader);
  if (!authHeader) {
    console.log("[GET /api/list] No Authorization header provided");
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("[GET /api/list] Token extracted:", token);
  if (!token) {
    console.log("[GET /api/list] No token extracted from Authorization header");
    return res.status(401).json({ error: "No token provided" });
  }

  const payload = verifyToken(token);
  console.log("[GET /api/list] Token payload:", payload);
  if (!payload || typeof payload === "string") {
    console.log("[GET /api/list] Invalid token or payload");
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    const items = await getUserList(payload.id);
    res.json({ results: items });
  } catch (error) {
    console.error("Get user list error:", error);
    res.status(500).json({ error: "Failed to fetch user list" });
  }
});

app.post("/api/list/add", async (req, res) => {

  const authHeader = req.headers.authorization;
  console.log("[POST /api/list/add] Authorization header:", authHeader);
  if (!authHeader) {
    console.log("[POST /api/list/add] No Authorization header provided");
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("[POST /api/list/add] Token extracted:", token);
  if (!token) {
    console.log("[POST /api/list/add] No token extracted from Authorization header");
    return res.status(401).json({ error: "No token provided" });
  }

  const payload = verifyToken(token) as any;
  console.log("[POST /api/list/add] Token payload:", payload);
  if (!payload || typeof payload === "string" || !payload.id) {
    console.log("[POST /api/list/add] Invalid token or payload");
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    console.log("POST /api/list/add - req.body:", req.body); // Add this debug line
    console.log("POST /api/list/add - req.body type:", typeof req.body); // Add this debug line
    console.log(
      "POST /api/list/add - Content-Type:",
      req.headers["content-type"],
    ); // Add this debug line

    const mediaItem = req.body;

    if (!mediaItem) {
      console.error("req.body is empty or undefined");
      return res
        .status(400)
        .json({ error: "No media item provided in request body" });
    }
    console.log("debug - req.body: ", req.body);
    await addToUserList(payload.id, mediaItem);
    res.json({ success: true, message: "Added to your list" });
  } catch (error) {
    console.error("Add to user list error:", error);
    res.status(500).json({ error: "Failed to add to your list" });
  }
});

app.delete("/api/list/remove/:mediaId", async (req, res) => {

  const authHeader = req.headers.authorization;
  console.log("[DELETE /api/list/remove] Authorization header:", authHeader);
  if (!authHeader) {
    console.log("[DELETE /api/list/remove] No Authorization header provided");
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("[DELETE /api/list/remove] Token extracted:", token);
  if (!token) {
    console.log("[DELETE /api/list/remove] No token extracted from Authorization header");
    return res.status(401).json({ error: "No token provided" });
  }

  const payload = verifyToken(token);
  console.log("[DELETE /api/list/remove] Token payload:", payload);
  if (!payload || typeof payload === "string") {
    console.log("[DELETE /api/list/remove] Invalid token or payload");
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    const mediaId = parseInt(req.params.mediaId);
    await removeFromUserList(payload.id, mediaId);
    res.json({ success: true, message: "Removed from your list" });
  } catch (error) {
    console.error("Remove from user list error:", error);
    res.status(500).json({ error: "Failed to remove from your list" });
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
