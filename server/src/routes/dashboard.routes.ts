import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware.authenticate, dashboardController.getDashboardData);

export default router;
