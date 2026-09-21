import {
  ollama,
  EMBED_MODEL,
  KEEP_ALIVE,
} from "../ai/ollama.client.js";

class EmbedService {
  async embedText(text: string): Promise<number[]> {
    const [embedding] = await this.embedMany([text]);

    return embedding;
  }

  // One request for many chunks: batched on the GPU instead of
  // one HTTP round-trip + one forward pass per chunk.
  async embedMany(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return [];

    const response = await ollama.embed({
      model: EMBED_MODEL,
      input: texts,
      keep_alive: KEEP_ALIVE,
    });

    return response.embeddings;
  }
}

export default new EmbedService();
