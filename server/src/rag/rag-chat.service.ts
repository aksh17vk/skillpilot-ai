import {
  ollama,
  CHAT_MODEL,
  KEEP_ALIVE,
  modelOptions,
  clampText,
} from "../ai/ollama.client.js";
import vectorSearchService from "./vector-search.service.js";

class RAGChatService {
  async chat(message: string) {
    try {
      const docs =
        await vectorSearchService.search(message);

      let prompt = "";
      let sources: string[] = [];

      if (docs.length > 0) {
        const context = clampText(
          docs.map((d) => d.content).join("\n\n"),
          8000
        );

        sources = docs.map((d) => d.source);

        prompt = `
You are SkillPilot AI Career Assistant.

Use the provided context to answer the user's question accurately and clearly.

Context:
${context}

Question:
${message}

Answer:
`;
      } else {
        prompt = `
You are SkillPilot AI Career Assistant.

Answer the user's career question professionally and concisely using your own knowledge.

Question:
${message}

Answer:
`;
      }

      const response = await ollama.generate({
        model: CHAT_MODEL,
        prompt,
        keep_alive: KEEP_ALIVE,
        options: modelOptions({
          temperature: 0.2,
          num_predict: 250,
        }),
      });

      return {
        reply:
          response.response?.trim() ||
          "I could not generate a response.",
        sources,
      };
    } catch (error) {
      console.error(
        "RAG chat error:",
        error
      );

      throw new Error(
        "Failed to generate response"
      );
    }
  }
}

export default new RAGChatService();