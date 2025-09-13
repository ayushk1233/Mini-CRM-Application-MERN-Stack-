// app.js
require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Import routes
const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customers");
const analyticsRoutes = require("./routes/analytics");

// Import middleware
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security middleware
app.use(helmet());

// ✅ CORS config: allow local + deployed frontend
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5173", // fallback for dev
    ],
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Mini CRM Backend",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
