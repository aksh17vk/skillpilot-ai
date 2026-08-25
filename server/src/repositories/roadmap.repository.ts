import Roadmap from "../models/roadmap.model.js";

class RoadmapRepository {
  async create(data: any) {
    return Roadmap.create(data);
  }

  async findLatestByUser(userId: string) {
    return Roadmap.findOne({ user: userId })
      .sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return Roadmap.findById(id);
  }
}

export default new RoadmapRepository();