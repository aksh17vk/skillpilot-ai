import { Request, Response } from "express";
import ragChatService from "../rag/rag-chat.service.js";

class CareerAssistantController {
  async chat(req: Request, res: Response) {
    try {
      const message = req.body?.message;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }

      const result = await ragChatService.chat(
        message
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error(
        "Career assistant error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to generate response",
      });
    }
  }
}

export default new CareerAssistantController();