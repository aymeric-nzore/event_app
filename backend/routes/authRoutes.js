import { Router } from "express";
const router = Router();
import {
  register,
  login,
  logout,
  deleteAccount,
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
//POST
router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);
//DELETE
router.delete("/:id", protect, deleteAccount);

export default router;