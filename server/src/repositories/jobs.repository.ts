import Job from "../models/jobs.model.js";

class JobsRepository {
  async create(data: any) {
    return Job.create(data);
  }

  async findLatestByUser(userId: string) {
    return Job.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .lean();
  }
}

export default new JobsRepository();