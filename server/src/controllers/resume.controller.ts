import { Request, Response } from "express";

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import resumeService from "../services/resume.service.js";

class ResumeController {
  uploadResume = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const userId = String((req.user as any)._id);

    const result = await resumeService.analyzeResume(userId, req.file);

    return res.status(200).json(
      new ApiResponse(200, result, "Resume analyzed successfully")
    );
  });

  getLatestResume = asyncHandler(async (req: Request, res: Response) => {
    const userId = String((req.user as any)._id);

    const resume = await resumeService.getLatestResume(userId);

    return res.status(200).json(
      new ApiResponse(200, resume, "Latest resume fetched successfully")
    );
  });
}

export default new ResumeController();