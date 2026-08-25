import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware.authenticate,
  authMiddleware.adminOnly,
  (_req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome Admin",
    });
  },
);

export default router;
