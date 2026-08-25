import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";

class ProfileController {
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const user = await User.findById(userId).select("-password -refreshToken -passwordResetToken -passwordResetExpires");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(200, user, "Profile fetched successfully")
    );
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const {
      fullName,
      headline,
      targetRole,
      experienceLevel,
      location,
      education,
      college,
      graduationYear,
      bio,
      dailyHours,
      preferredStudyTime,
      daysPerWeek,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(fullName !== undefined && { fullName }),
          ...(headline !== undefined && { headline }),
          ...(targetRole !== undefined && { targetRole }),
          ...(experienceLevel !== undefined && { experienceLevel }),
          ...(location !== undefined && { location }),
          ...(education !== undefined && { education }),
          ...(college !== undefined && { college }),
          ...(graduationYear !== undefined && { graduationYear }),
          ...(bio !== undefined && { bio }),
          ...(dailyHours !== undefined && { dailyHours: Number(dailyHours) }),
          ...(preferredStudyTime !== undefined && { preferredStudyTime }),
          ...(daysPerWeek !== undefined && { daysPerWeek: Number(daysPerWeek) }),
        },
      },
      { new: true, runValidators: true }
    ).select("-password -refreshToken -passwordResetToken -passwordResetExpires");

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(200, updatedUser, "Profile updated successfully")
    );
  });
}

export default new ProfileController();
