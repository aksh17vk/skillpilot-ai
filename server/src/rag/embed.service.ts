import ollama from "ollama";

class EmbedService {
  async embedText(text: string): Promise<number[]> {
    const response = await ollama.embeddings({
      model: "nomic-embed-text",
      prompt: text,
    });

    return response.embedding;
  }
}

export default new EmbedService();