import { Router } from "express";
import passport from "passport";

import authController from "../controllers/auth.controller.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import authValidator from "../validators/auth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  validateMiddleware.validate(authValidator.register),
  authController.register,
);
router.post(
  "/login",
  validateMiddleware.validate(authValidator.login),
  authController.login,
);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authMiddleware.authenticate, authController.me);

// GitHub OAuth
router.get(
  "/github",
  passport.authenticate("github", {
    session: false,
  }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=github_oauth_failed`,
  }),
  authController.githubCallback,
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_oauth_failed`,
  }),
  authController.googleCallback,
);
export default router;
