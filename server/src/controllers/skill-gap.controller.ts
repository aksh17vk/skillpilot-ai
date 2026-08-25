import { Request, Response } from "express";

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import skillGapService from "../services/skill-gap.service.js";

class SkillGapController {
  generate = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = String(
        (req.user as any)._id
      );

      const result =
        await (skillGapService as any).generate(
          userId
        );

      return res.status(200).json(
        new ApiResponse(
          200,
          result,
          "Skill gap generated successfully"
        )
      );
    }
  );
}

export default new SkillGapController();