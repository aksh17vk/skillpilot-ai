import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import resumeRepository from "../repositories/resume.repository.js";
import jobsRepository from "../repositories/jobs.repository.js";
import roadmapRepository from "../repositories/roadmap.repository.js";
import { calculateSkillGap } from "../utils/skill-gap.js";

class DashboardController {
  getDashboardData = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(401, "Authentication required");
    }

    const userIdStr = String(userId);

    const [user, latestResume, latestJob, latestRoadmap] = await Promise.all([
      User.findById(userId).select("-password -refreshToken -passwordResetToken -passwordResetExpires"),
      resumeRepository.findLatestByUser(userIdStr),
      jobsRepository.findLatestByUser(userIdStr),
      roadmapRepository.findLatestByUser(userIdStr),
    ]);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const dashboardData = {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
      },
      profile: {
        headline: user.headline || "",
        targetRole: user.targetRole || (latestRoadmap?.targetRole ?? ""),
        experienceLevel: user.experienceLevel || "",
        location: user.location || "",
        education: user.education || "",
        bio: user.bio || "",
        dailyHours: user.dailyHours || 2,
        preferredStudyTime: user.preferredStudyTime || "Evening",
        daysPerWeek: user.daysPerWeek || 5,
      },
      resume: latestResume
        ? {
            id: latestResume._id,
            fileName: latestResume.fileName,
            atsScore: latestResume.analysis?.atsScore ?? 0,
            skills: latestResume.analysis?.skills || [],
            strengths: latestResume.analysis?.strengths || [],
            weaknesses: latestResume.analysis?.weaknesses || [],
            missingSkills: latestResume.analysis?.missingSkills || [],
            suggestions: latestResume.analysis?.suggestions || [],
            createdAt: (latestResume as any).createdAt,
          }
        : null,
      jobAnalysis: latestJob
        ? (() => {
            const analysis = (latestJob as any).analysis || {};
            const requiredSkills = analysis.requiredSkills || [];
            const resumeSkills =
              analysis.resumeSkills || latestResume?.analysis?.skills || [];
            const skillGap =
              analysis.skillGap || calculateSkillGap(resumeSkills, requiredSkills);

            return {
              id: (latestJob as any)._id,
              description: (latestJob as any).description,
              requiredSkills,
              resumeSkills,
              matchedSkills: skillGap.matchedSkills || [],
              missingSkills: skillGap.missingSkills || [],
              matchPercentage: skillGap.matchPercentage ?? 0,
              createdAt: (latestJob as any).createdAt,
            };
          })()
        : null,
      roadmap: latestRoadmap
        ? {
            id: latestRoadmap._id,
            targetRole: latestRoadmap.targetRole,
            studyHoursPerDay: latestRoadmap.studyHoursPerDay,
            durationDays: latestRoadmap.durationDays,
            days: latestRoadmap.days || [],
            createdAt: (latestRoadmap as any).createdAt,
          }
        : null,
    };

    return res.status(200).json(
      new ApiResponse(200, dashboardData, "Dashboard data fetched successfully")
    );
  });
}

export default new DashboardController();
