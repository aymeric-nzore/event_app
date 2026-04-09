import { Router } from "express";
const router = Router();
import { protect } from "../middlewares/authMiddleware.js";
import { creator } from "../middlewares/creatorMiddelware.js";
import { scanTicket } from "../controllers/ticketController.js";

router.post("/scan", protect, creator, scanTicket);

export default router;
