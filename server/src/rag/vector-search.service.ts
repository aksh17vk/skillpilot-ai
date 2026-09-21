import Knowledge from "../models/knowledge.model.js";

class VectorSearchService {
  async search(query: string) {
    // Exclude the embedding vectors - they are large and unused here
    const docs = await Knowledge.find({})
      .select("content text source")
      .limit(5)
      .lean();

    return docs.map((doc: any) => ({
      content: doc.content || doc.text || "",
      source: doc.source || "knowledge-base",
    }));
  }
}

export default new VectorSearchService();