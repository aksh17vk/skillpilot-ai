import User from "../models/user.model.js";
import type { IUser } from "../interfaces/user.interface.js";

class UserRepository {
  async create(userData: Partial<IUser>) {
    return User.create(userData);
  }

  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async exists(email: string): Promise<boolean> {
    const user = await User.exists({ email });
    return !!user;
  }

  async findByProvider(provider: string, providerId: string) {
    return User.findOne({ provider, providerId });
  }

  async updateLastLogin(id: string) {
    return User.findByIdAndUpdate(
      id,
      {
        lastLogin: new Date(),
      },
      {
        new: true,
      },
    );
  }
  async findByPasswordResetToken(token: string) {
    return User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    });
  }

  async updatePassword(userId: string, password: string) {
    const user = await User.findById(userId);
    if (!user) return null;

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    return user.save();
  }
}

export default new UserRepository();
