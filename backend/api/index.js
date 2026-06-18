import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "../config/dbConfig.js";

import authRoutes from "../routes/authRoutes.js";
import eventRoutes from "../routes/eventRoutes.js";
import ticketRoutes from "../routes/ticketRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/ticket", ticketRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default serverless(app);