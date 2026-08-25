import { z } from "zod";

class AuthValidator {
  // Register
  public register = z.object({
    body: z.object({
      fullName: z
        .string()
        .trim()
        .min(3, "Full name must be at least 3 characters")
        .max(50, "Full name cannot exceed 50 characters"),

      email: z.string().trim().email("Invalid email address").toLowerCase(),

      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password cannot exceed 32 characters")
        .regex(/[A-Z]/, "Password must contain one uppercase letter")
        .regex(/[a-z]/, "Password must contain one lowercase letter")
        .regex(/[0-9]/, "Password must contain one number")
        .regex(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain one special character",
        ),
    }),
  });

  // Login
  public login = z.object({
    body: z.object({
      email: z.string().trim().email("Invalid email address"),

      password: z.string().min(8, "Password is required"),
    }),
  });

  // Forgot Password
  public forgotPassword = z.object({
    body: z.object({
      email: z.string().trim().email("Invalid email address"),
    }),
  });

  // Reset Password
  public resetPassword = z.object({
    body: z.object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(32, "Password cannot exceed 32 characters")
        .regex(/[A-Z]/, "Password must contain one uppercase letter")
        .regex(/[a-z]/, "Password must contain one lowercase letter")
        .regex(/[0-9]/, "Password must contain one number")
        .regex(
          /[!@#$%^&*(),.?":{}|<>]/,
          "Password must contain one special character",
        ),
    }),
  });
}

export default new AuthValidator();
