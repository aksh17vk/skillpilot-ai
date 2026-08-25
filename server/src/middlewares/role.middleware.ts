import type { Request, Response, NextFunction } from "express";

import ApiError from "../utils/ApiError.js";

const authorize = (...roles: string[]) => {
return (
req: Request,
_res: Response,
next: NextFunction
) => {
// User must already be authenticated
if (!req.user) {
throw new ApiError(401, "Unauthorized");
}

// Check role
if (!roles.includes(req.user.role)) {
  throw new ApiError(403, "Forbidden");
}

next();

};
};

export default authorize;
