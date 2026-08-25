import { Request, Response } from "express";
import jobsService from "../services/jobs.service.js";

class JobsController {
  async analyzeJob(req: Request, res: Response) {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      // body se safely value lo
      const jobDescription =
        req.body?.jobDescription ||
        req.body?.description ||
        req.body?.jd ||
        "";

      if (!jobDescription.trim()) {
        return res.status(400).json({
          success: false,
          message: "Job description is required",
        });
      }

      const result = await jobsService.analyzeJob(
        String(userId),
        jobDescription
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Job analyzed successfully",
        data: result,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Internal Server Error",
      });
    }
  }

  async getLatestJob(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      const job = await jobsService.getLatestJob(String(userId));
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Latest job fetched successfully",
        data: job,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch latest job",
      });
    }
  }
}

export default new JobsController();