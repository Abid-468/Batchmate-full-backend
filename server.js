require("dotenv").config();
const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const constants = require("./constants");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const { ensureAdminUser } = require("./config/seedAdmin");
const app = express();
const port = process.env.PORT || constants.DEFAULT_PORT;

// CORS configuration - allow all origins in development, specific in production
const isProduction = process.env.NODE_ENV === "production";
const fallbackOrigins = [
  "http://127.0.0.1:5501",
  "http://localhost:5501",
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://localhost:5001",
  "http://127.0.0.1:5001",
];
const allowedOrigins = process.env.FRONTEND_ORIGINS
  ? process.env.FRONTEND_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : fallbackOrigins;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Config endpoint for frontend - empty base URL since backend serves frontend
app.get("/config.js", (_req, res) => {
  res.type("application/javascript");
  res.send(`window.BATCHMATE_CONFIG = { API_BASE_URL: "" };`);
});

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/alumni", require("./routes/alumni_Routes"));
app.use("/api/users", require("./routes/user_Routes"));
app.use("/api/profiles", require("./routes/profile_Routes"));
app.use("/api/notices", require("./routes/notice_Routes"));
app.use("/api/updates", require("./routes/updateFeed_Routes"));

// Serve frontend static files
const frontendPath = path.join(__dirname, "..", "Batchmate-full-frontend");
app.use(express.static(frontendPath));

// Serve index.html for all non-API routes (SPA support)
app.get(/\/(?!api\/).*/, (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(errorHandler);

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

const startServer = async () => {
  try {
    await db();
    await ensureAdminUser();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
