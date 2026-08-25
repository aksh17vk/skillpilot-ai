import { Router } from "express";
import profileController from "../controllers/profile.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware.authenticate, profileController.getProfile);
router.put("/", authMiddleware.authenticate, profileController.updateProfile);

export default router;
