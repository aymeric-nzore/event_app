import { Router } from "express";
const router = Router();
import { protect } from "../middlewares/authMiddleware.js";
import { creator } from "../middlewares/creatorMiddelware.js";
import { scanTicket, renderQrCode } from "../controllers/ticketController.js";

router.post("/scan", protect, creator, scanTicket);
router.get("/render-qr/:token", renderQrCode);

export default router;
