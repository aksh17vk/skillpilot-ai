import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ZodObject, ZodError } from "zod";

import ApiError from "../utils/ApiError.js";

class ValidateMiddleware {
  validate(schema: ZodObject<any>) {
    return async (
      req: Request,
      _res: Response,
      next: NextFunction
    ) => {
      try {
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        });

        next();
      } catch (error) {
        if (error instanceof ZodError) {
          return next(
            new ApiError(
              400,
              "Validation Failed",
              error.issues
            )
          );
        }

        next(error);
      }
    };
  }
}

export default new ValidateMiddleware();