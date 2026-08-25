import Knowledge from "../models/knowledge.model.js";

class VectorSearchService {
  async search(query: string) {
    const docs = await Knowledge.find({})
      .limit(5)
      .lean();

    console.log("RAG DOCS:", docs);

    return docs.map((doc: any) => ({
      content: doc.content || doc.text || "",
      source: doc.source || "knowledge-base",
    }));
  }
}

export default new VectorSearchService();