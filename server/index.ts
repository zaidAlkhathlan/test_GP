import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { initDatabase } from "./db";
import { createBuyer } from "./routes/buyers";
import { loginBuyer } from "./routes/buyer-auth";
import { loginSupplier } from "./routes/supplier-auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  
  // Mount routes first, initialize DB in background
  app.post("/api/buyers", createBuyer);
  app.post("/api/auth/login", loginBuyer);
  app.post("/api/auth/supplier/login", loginSupplier);
  
  // Initialize DB in background
  initDatabase().catch((error) => {
    console.error("Failed to initialize database:", error);
  });

  return app;
}
