import type { Request, Response, NextFunction } from "express";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwtService from "../services/jwt.service.js";
import userRepository from "../repositories/user.repository.js";
import { USER_ROLE } from "../constants/auth.constants.js";

class AuthMiddleware {
  // Verify JWT
  authenticate = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
      const authorization = req.headers.authorization;

      if (!authorization || !authorization.startsWith("Bearer ")) {
        throw new ApiError(401, "Access token missing");
      }

      const token = authorization.split(" ")[1];

      const payload = jwtService.verifyAccessToken(token);

      const user = await userRepository.findById(payload.userId);

      if (!user) {
        throw new ApiError(401, "User not found");
      }

      req.user = user;

      next();
    },
  );

  // Role-based authorization
  authorize(...roles: string[]) {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new ApiError(401, "Authentication required"));
      }

      if (!roles.includes(req.user.role)) {
        return next(
          new ApiError(
            403,
            "You do not have permission to access this resource",
          ),
        );
      }

      next();
    };
  }

  // Shortcut for admin-only routes
  adminOnly = this.authorize(USER_ROLE.ADMIN);
}

export default new AuthMiddleware();
