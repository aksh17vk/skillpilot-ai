import jwt, { SignOptions } from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

class JwtService {
  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      } as SignOptions
    );
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      } as SignOptions
    );
  }

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET as string
    ) as JwtPayload;
  }

  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as JwtPayload;
  }
}

export default new JwtService();