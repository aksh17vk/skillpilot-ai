

import { Request, Response } from "express";
import assessmentService from "../services/assessment.service.js";

class AssessmentController {
  [x: string]: any;

  // Generate assessments for a roadmap
  async generate(req: Request, res: Response) {
    try {
      const userId = String(req.user?._id);
      const roadmapId = String(req.params.roadmapId);

      const assessments =
        await assessmentService.generateForRoadmap(
          userId,
          roadmapId
        );

      return res.status(201).json({
        success: true,
        message: "Assessments generated successfully",
        data: {
          count: assessments.length,
          assessments,
        },
      });

    } catch (error: any) {
      console.error(
        "Assessment generation error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to generate assessments",
      });
    }
  }


  // Get assessment for a specific day
  async getDay(req: Request, res: Response) {
    try {
      const userId = String(req.user?._id);
      const day = Number(req.params.day);

      const assessment =
        await assessmentService.getDayAssessment(
          userId,
          day
        );

      return res.status(200).json({
        success: true,
        data: assessment,
      });

    } catch (error: any) {
      console.error(
        "Get assessment error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to get assessment",
      });
    }
  }


  // Submit assessment
  async submit(req: Request, res: Response) {
    try {
      const userId = String(req.user?._id);
      const assessmentId =
        String(req.params.id);

      const answers = req.body.answers;

      const result =
        await assessmentService.submitAssessment(
          userId,
          assessmentId,
          answers
        );

      return res.status(200).json({
        success: true,
        data: result,
      });

    } catch (error: any) {
      console.error(
        "Submit assessment error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to submit assessment",
      });
    }
  }


  // Get assessment status
  async status(req: Request, res: Response) {
    try {
      const userId = String(req.user?._id);

      const assessments =
        await assessmentService.getStatus(
          userId
        );

      return res.status(200).json({
        success: true,
        data: assessments,
      });

    } catch (error: any) {
      console.error(
        "Assessment status error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to get assessment status",
      });
    }
  }
}

export default new AssessmentController();