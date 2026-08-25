import { Request, Response } from "express";
import roadmapService from "../services/roadmap.service.js";
import pdfService from "../services/pdf.service.js";

class RoadmapController {
  async generate(req: Request, res: Response) {
    try {
      const userId = String(req.user?._id);

      const result =
        await roadmapService.generateRoadmap(
          userId,
          req.body
        );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message:
          "Roadmap generated successfully",
        data: result,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to generate roadmap",
      });
    }
  }

  async downloadPDF(
    req: Request,
    res: Response
  ) {
    try {
      const userId = String(req.user?._id);

      const result =
        await roadmapService.generateRoadmap(
          userId,
          req.body
        );

      const pdfBuffer =
        await pdfService.generateRoadmapPDF(
          result
        );

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=skillpilot-roadmap.pdf"
      );

      return res.send(pdfBuffer);
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to generate PDF",
      });
    }
  }

  async getLatestRoadmap(req: Request, res: Response) {
    try {
      const userId = String(req.user?._id);
      const result = await roadmapService.getLatestRoadmap(userId);
      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Latest roadmap fetched successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch latest roadmap",
      });
    }
  }
}

export default new RoadmapController();