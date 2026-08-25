import type { HydratedDocument } from "mongoose";
import { AUTH_PROVIDER, USER_ROLE } from "../constants/auth.constants.js";

export interface IUser {
  fullName: string;
  email: string;
  password?: string;

  avatar?: string;

  provider: (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];

  providerId?: string;

  role: (typeof USER_ROLE)[keyof typeof USER_ROLE];

  isEmailVerified: boolean;

  refreshToken?: string;

  lastLogin?: Date;

  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;

  headline?: string;
  targetRole?: string;
  experienceLevel?: string;
  location?: string;
  education?: string;
  college?: string;
  graduationYear?: string;
  bio?: string;

  dailyHours?: number;
  preferredStudyTime?: string;
  daysPerWeek?: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;