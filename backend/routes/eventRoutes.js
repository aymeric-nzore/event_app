import { Router } from "express";
const router = Router();
import { protect } from "../middlewares/authMiddleware.js";
import { creator } from "../middlewares/creatorMiddelware.js";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  nearbyEvents,
  joinEvents,
  userAttendus,
  dashboardStats,
} from "../controllers/eventController.js";
//POST
router.post("/create", protect, createEvent);
router.post("/:id/join", protect, joinEvents);
//PATCH
router.patch("/:id", protect, creator, updateEvent);
//DELETE
router.delete("/:id", protect, creator, deleteEvent);
//GET
router.get("/dashboard-stats", protect, creator, dashboardStats);
router.get("/nearby", protect, nearbyEvents);
router.get("/:id/usersAttendus", protect, creator, userAttendus);

export default router;
