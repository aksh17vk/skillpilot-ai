import Resume from "../models/resume.model.js";

class ResumeRepository {
  async create(data: any) {
    return Resume.create(data);
  }

  async findLatestByUser(userId: string) {
    return Resume.findOne({ user: userId }).sort({ createdAt: -1 });
  }
}

export default new ResumeRepository();