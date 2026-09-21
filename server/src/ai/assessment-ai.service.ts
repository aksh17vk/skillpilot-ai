import {
  ollama,
  CHAT_MODEL,
  KEEP_ALIVE,
  modelOptions,
} from "./ollama.client.js";

const ASSESSMENT_SCHEMA = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          options: {
            type: "array",
            items: { type: "string" },
          },
          correctAnswer: { type: "string" },
        },
        required: [
          "question",
          "options",
          "correctAnswer",
        ],
      },
    },
  },
  required: ["questions"],
};

class AssessmentAIService {
  async generate(
    focus: string,
    targetRole: string
  ) {
    const prompt = `
Generate 5 UNIQUE multiple-choice assessment questions for the topic "${focus}" for a ${targetRole} learner.

IMPORTANT:
- Do not repeat questions from previous attempts.
- Create different scenarios, examples, and options.
- Use practical and interview-style questions.

Return ONLY valid JSON:

{
  "questions": [
    {
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    }
  ]
}`;

    const response = await ollama.generate({
      model: CHAT_MODEL,
      prompt,
      format: ASSESSMENT_SCHEMA,
      keep_alive: KEEP_ALIVE,
      options: modelOptions({
        temperature: 0.2,
        num_predict: 900,
      }),
    });

    let text = response.response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    text = text.substring(start, end + 1);

    return JSON.parse(text);
  }
}

export default new AssessmentAIService();