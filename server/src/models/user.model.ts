import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

import type {
  IUser,
  IUserMethods,
} from "../interfaces/user.interface.js";

import {
  AUTH_PROVIDER,
  USER_ROLE,
} from "../constants/auth.constants.js";

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

    avatar: {
      type: String,
      default: "",
    },

    provider: {
      type: String,
      enum: Object.values(AUTH_PROVIDER),
      default: AUTH_PROVIDER.LOCAL,
    },

    providerId: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.USER,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    headline: { type: String, default: "" },
    targetRole: { type: String, default: "" },
    experienceLevel: { type: String, default: "" },
    location: { type: String, default: "" },
    education: { type: String, default: "" },
    college: { type: String, default: "" },
    graduationYear: { type: String, default: "" },
    bio: { type: String, default: "" },

    dailyHours: { type: Number, default: 2 },
    preferredStudyTime: { type: String, default: "Evening" },
    daysPerWeek: { type: Number, default: 5 },
  },
  {
    timestamps: true,
  },

  

  
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }

  return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model<IUser, UserModel>("User", userSchema);

export default User;