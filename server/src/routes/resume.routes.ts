import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import resumeController from "../controllers/resume.controller.js";

const router = Router();

router.post(
  "/upload",
  authMiddleware.authenticate,
  upload.single("file"),
  resumeController.uploadResume
);

router.get(
  "/latest",
  authMiddleware.authenticate,
  resumeController.getLatestResume
);

export default router;