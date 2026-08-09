import type { UserDocument } from "../interfaces/user.interface.js";

declare global {
  namespace Express {
    interface User extends UserDocument {}
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};

