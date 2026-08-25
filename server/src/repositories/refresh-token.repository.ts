import RefreshToken from "../models/refresh-token.model.js";

class RefreshTokenRepository {
  async create(userId: string, token: string, expiresAt: Date) {
    return RefreshToken.create({
      user: userId,
      token,
      expiresAt,
    });
  }

  async find(token: string) {
    return RefreshToken.findOne({ token });
  }

  async delete(token: string) {
    return RefreshToken.findOneAndDelete({
      token,
    });
  }

  async deleteByUser(userId: string) {
    return RefreshToken.deleteMany({
      user: userId,
    });
  }

  async findByUser(userId: string) {
    return RefreshToken.findOne({
      user: userId,
    });
  }

  async updateToken(userId: string, token: string, expiresAt: Date) {
    return RefreshToken.findOneAndUpdate(
      { user: userId },
      {
        token,
        expiresAt,
      },
      {
        new: true,
      },
    );
  }
}

export default new RefreshTokenRepository();
