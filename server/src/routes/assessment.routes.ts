import { Router } from "express";
import assessmentController from "../controllers/assessment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/generate/:roadmapId",
  authMiddleware.authenticate,
  (req, res) => assessmentController.generate(req, res)
);

router.get(
  "/day/:day",
  authMiddleware.authenticate,
  (req, res) => assessmentController.getDay(req, res)
);

router.post(
  "/:id/submit",
  authMiddleware.authenticate,
  (req, res) => assessmentController.submit(req, res)
);

router.get(
  "/status",
  authMiddleware.authenticate,
  (req, res) => assessmentController.status(req, res)
);

export default router;