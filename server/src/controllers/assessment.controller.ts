// src/controllers/assessment.controller.ts
import { Request, Response } from "express";
import assessmentService from "../services/assessment.service.js";

class AssessmentController {
  async generate(req: Request, res: Response) {
    try {
      const { roadmapId } = req.params;
      const assessment = await assessmentService.generateAssessment(
        String(req.user?._id),
        roadmapId
      );

      return res.json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Server error in generate",
      });
    }
  }

  async getDay(req: Request, res: Response) {
    try {
      const assessment = await assessmentService.getDayAssessment(
        String(req.user?._id),
        Number(req.params.day)
      );

      return res.json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Server error in getDay",
      });
    }
  }

  async submit(req: Request, res: Response) {
    try {
      const result = await assessmentService.submitAssessment(
        String(req.user?._id),
        String(req.params.id),
        req.body.answers
      );

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Server error in submit",
      });
    }
  }

  async status(req: Request, res: Response) {
    try {
      const data = await assessmentService.getStatus(
        String(req.user?._id)
      );

      return res.json({
        success: true,
        data,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Server error in status",
      });
    }
  }
}

export default new AssessmentController();
