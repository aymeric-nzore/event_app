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
} from "../controllers/eventController.js";
//POST
router.post("/create", protect, createEvent);
router.post("/:id/join", protect, joinEvents);
//PATCH
router.patch("/:id", protect, creator, updateEvent);
//DELETE
router.delete("/:id", protect, creator, deleteEvent);
//GET
router.get("/:id/usersAttendus", protect, creator, userAttendus);
router.get("/nearby", protect, nearbyEvents);

export default router;
