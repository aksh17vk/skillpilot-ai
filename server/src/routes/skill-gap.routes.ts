import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import skillGapController from "../controllers/skill-gap.controller.js";

const router = Router();

router.get(
  "/analyze",
  authMiddleware.authenticate,
  skillGapController.generate
);

export default router;