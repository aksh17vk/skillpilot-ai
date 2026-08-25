import { Router } from "express";
import roadmapController from "../controllers/roadmap.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/generate",
  authMiddleware.authenticate,
  (req, res) => roadmapController.generate(req, res)
);

router.get(
  "/latest",
  authMiddleware.authenticate,
  (req, res) => roadmapController.getLatestRoadmap(req, res)
);

router.post(
  "/download-pdf",
  authMiddleware.authenticate,
  (req, res) => roadmapController.downloadPDF(req, res)
);

export default router;