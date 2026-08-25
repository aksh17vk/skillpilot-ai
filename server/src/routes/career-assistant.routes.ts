import { Router } from "express";
import careerAssistantController from "../controllers/career-assistant.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/chat",
  (authMiddleware).authenticate,
  careerAssistantController.chat
);

export default router;