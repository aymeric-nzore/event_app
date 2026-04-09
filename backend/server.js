import express from "express";
import cors from "cors";
import connectDB from "./config/dbConfig.js";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());

//ROUTES
//Route pour l'auth
app.use("/api/auth", authRoutes);
//Route pour les events
app.use("/api/events", eventRoutes);
//Route pour les tickets
app.use("/api/ticket", ticketRoutes);
//Route health pour vérifier si le server marche
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server démarré sur le port ${PORT}`);
});
