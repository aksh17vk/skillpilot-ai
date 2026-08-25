import { Router } from "express";
import jobsController from "../controllers/jobs.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// Analyze job description
router.post(
  "/analyze",
  authMiddleware.authenticate,
  (req, res) => jobsController.analyzeJob(req, res),
);

// Get latest job analysis
router.get(
  "/latest",
  authMiddleware.authenticate,
  (req, res) => jobsController.getLatestJob(req, res),
);

// Get all analyzed jobs (optional)
router.get(
  "/history",
  authMiddleware.authenticate,
  (req, res) => {
    res.json({
      success: true,
      message: "Job history endpoint working",
    });
  },
);

export default router;