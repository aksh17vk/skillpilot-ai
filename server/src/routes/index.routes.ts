import { Router } from "express";
import authRoutes from "./auth.routes.js";
import resumeRoutes from "./resume.routes.js";
import jobsRoutes from "./jobs.routes.js";
import skillGapRoutes from "./skill-gap.routes.js";
import roadmapRoutes from "./roadmap.routes.js";
import careerAssistantRoutes from "./career-assistant.routes.js";
import assessmentRoutes from "./assessment.routes.js";
import profileRoutes from "./profile.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/skill-gap", skillGapRoutes);
router.use("/assessment", assessmentRoutes);
router.use("/roadmap", roadmapRoutes);
router.use("/career-assistant", careerAssistantRoutes);

router.use("/resume", resumeRoutes);

router.use("/jobs", jobsRoutes);

router.get("/health", (_, res) => {
  return res.status(200).json({
    success: true,
    message: "SkillPilot AI API is running",
  });
});

export default router;
