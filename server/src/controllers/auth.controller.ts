import type { Request, Response } from "express";

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import authService from "../services/auth.service.js";
import cookieOptions from "../config/cookie.js";

class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;

    const result = await authService.register(fullName, email, password);

    res.cookie(
      process.env.COOKIE_NAME || "refreshToken",
      result.refreshToken,
      cookieOptions,
    );

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          accessToken: result.accessToken,
          user: {
            _id: result.user._id,
            fullName: result.user.fullName,
            email: result.user.email,
            avatar: result.user.avatar,
            role: result.user.role,
            provider: result.user.provider,
            isEmailVerified: result.user.isEmailVerified,
          },
        },
        "User registered successfully",
      ),
    );
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.cookie(
      process.env.COOKIE_NAME || "refreshToken",
      result.refreshToken,
      cookieOptions,
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: result.accessToken,
          user: {
            _id: result.user._id,
            fullName: result.user.fullName,
            email: result.user.email,
            avatar: result.user.avatar,
            role: result.user.role,
            provider: result.user.provider,
            isEmailVerified: result.user.isEmailVerified,
            lastLogin: result.user.lastLogin,
          },
        },
        "Login successful",
      ),
    );
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies[process.env.COOKIE_NAME || "refreshToken"];

    const result = await authService.refresh(refreshToken);

    res.cookie(
      process.env.COOKIE_NAME || "refreshToken",
      result.refreshToken,
      cookieOptions,
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: result.accessToken,
          user: result.user,
        },
        "Token refreshed successfully",
      ),
    );
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies[process.env.COOKIE_NAME || "refreshToken"];

    await authService.logout(refreshToken);

    res.clearCookie(process.env.COOKIE_NAME || "refreshToken", cookieOptions);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Logout successful"));
  });
  me = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.me(String(req.user!._id));

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Current user fetched"));
  });

  githubCallback = asyncHandler(async (req: Request, res: Response) => {
    const profile = req.user;

    const result = await authService.loginWithGithub(profile);

    res.cookie(
      process.env.COOKIE_NAME || "refreshToken",
      result.refreshToken,
      cookieOptions,
    );

    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/oauth-success?token=${result.accessToken}`;

    return res.redirect(redirectUrl);
  });

  googleCallback = asyncHandler(async (req: Request, res: Response) => {
    const profile = req.user as any;

    const result = await authService.loginWithGoogle(profile);

    res.cookie(
      process.env.COOKIE_NAME || "refreshToken",
      result.refreshToken,
      cookieOptions,
    );

    const redirectUrl = `${
      process.env.FRONTEND_URL
    }/oauth-success?token=${result.accessToken}`;

    return res.redirect(redirectUrl);
  });
}

export default new AuthController();
