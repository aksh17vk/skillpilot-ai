import type { HydratedDocument, Types } from "mongoose";

export interface IRefreshToken {
  user: Types.ObjectId;

  token: string;

  expiresAt: Date;
}

export type RefreshTokenDocument =
  HydratedDocument<IRefreshToken>;