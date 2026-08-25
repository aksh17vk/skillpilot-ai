import ApiError from "../utils/ApiError.js";
import jwtService from "./jwt.service.js";
import userRepository from "../repositories/user.repository.js";
import refreshTokenRepository from "../repositories/refresh-token.repository.js";
import { AUTH_PROVIDER, USER_ROLE } from "../constants/auth.constants.js";

class AuthService {
  async register(fullName: string, email: string, password: string) {
    const exists = await userRepository.exists(email);

    if (exists) {
      throw new ApiError(409, "Email already exists");
    }

    const user = await userRepository.create({
      fullName,
      email,
      password,
    });

    const payload = {
      userId: String(user._id),
      email: user.email,
      role: user.role,
    };

    const accessToken = jwtService.generateAccessToken(payload);

    const refreshToken = jwtService.generateRefreshToken(payload);

    await refreshTokenRepository.create(
      String(user._id),
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    console.log("7. Refresh Token Saved");

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (user.provider !== AUTH_PROVIDER.LOCAL) {
      throw new ApiError(400, "Use Google/GitHub login");
    }

    const passwordMatched = await user.comparePassword(password);

    if (!passwordMatched) {
      throw new ApiError(401, "Invalid email or password");
    }

    await refreshTokenRepository.deleteByUser(String(user._id));

    const payload = {
      userId: String(user._id),
      email: user.email,
      role: user.role,
    };

    const accessToken = jwtService.generateAccessToken(payload);

    const refreshToken = jwtService.generateRefreshToken(payload);

    await refreshTokenRepository.create(
      String(user._id),
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    await userRepository.updateLastLogin(String(user._id));

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token missing");
    }

    const payload = jwtService.verifyRefreshToken(refreshToken);

    const savedToken = await refreshTokenRepository.find(refreshToken);

    if (!savedToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const newPayload = {
      userId: String(user._id),
      email: user.email,
      role: user.role,
    };

    const accessToken = jwtService.generateAccessToken(newPayload);

    const newRefreshToken = jwtService.generateRefreshToken(newPayload);

    await refreshTokenRepository.updateToken(
      String(user._id),
      newRefreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    };
  }
  async logout(refreshToken: string) {
    if (!refreshToken) {
      return;
    }

    await refreshTokenRepository.delete(refreshToken);
  }

  async me(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  async loginWithGithub(profile: any) {
    const email =
      profile.emails?.[0]?.value || `${profile.username}@github.local`;

    let user = await userRepository.findByEmail(email);

    if (!user) {
      user = await userRepository.create({
        fullName: profile.displayName || profile.username,
        email,
        avatar: profile.photos?.[0]?.value || "",
        provider: AUTH_PROVIDER.GITHUB,
        providerId: profile.id,
        role: USER_ROLE.USER,
        isEmailVerified: true,
      });
    }

    const payload = {
      userId: String(user._id),
      email: user.email,
      role: user.role,
    };

    const accessToken = jwtService.generateAccessToken(payload);

    const refreshToken = jwtService.generateRefreshToken(payload);

    await refreshTokenRepository.deleteByUser(String(user._id));

    await refreshTokenRepository.create(
      String(user._id),
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
  async loginWithGoogle(profile: any) {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      throw new ApiError(400, "google mail account is not available");
    }

    let user = await userRepository.findByEmail(email);

    if (!user) {
      user = await userRepository.create({
        fullName: profile.displayName,
        email,
        provider: AUTH_PROVIDER.GOOGLE,
        providerId: profile.id,
        role: USER_ROLE.USER,
        isEmailVerified: true,
      });
    }

    const payload = {
      userId: String(user._id),
      email: user.email,
      role: user.role,
    };

    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    await refreshTokenRepository.deleteByUser(String(user._id));

    await refreshTokenRepository.create(
      String(user._id),
      refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}

export default new AuthService();
