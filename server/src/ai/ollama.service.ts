import {
  ollama,
  CHAT_MODEL,
  KEEP_ALIVE,
  modelOptions,
  clampText,
} from "./ollama.client.js";

const stringArray = {
  type: "array",
  items: { type: "string" },
};

// Constrains decoding to this shape: no markdown, no preamble tokens
const RESUME_SCHEMA = {
  type: "object",
  properties: {
    atsScore: { type: "number" },
    skills: stringArray,
    strengths: stringArray,
    weaknesses: stringArray,
    missingSkills: stringArray,
    suggestions: stringArray,
  },
  required: [
    "atsScore",
    "skills",
    "strengths",
    "weaknesses",
    "missingSkills",
    "suggestions",
  ],
};

class OllamaService {
  async analyzeResume(resumeText: string) {
    const response = await ollama.chat({
      model: CHAT_MODEL,
      format: RESUME_SCHEMA,
      keep_alive: KEEP_ALIVE,
      messages: [
        {
          role: "system",
          content:
            "You are an ATS and career expert. Always return ONLY valid JSON. Do not add explanations, markdown, or extra text.",
        },
        {
          role: "user",
          content: `
Analyze this resume and return STRICT JSON only.

Return exactly this structure:
{
  "atsScore": number,
  "skills": [],
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}

Keep every list item short (one sentence max).

Resume:
${clampText(resumeText, 9000)}
`,
        },
      ],
      options: modelOptions({
        temperature: 0.1,
        num_predict: 700,
      }),
    });

    let text = response.message.content.trim();

    // Remove markdown code fences
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON object from response
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1);
    }

    try {
      JSON.parse(text);
      return text;
    } catch (error) {
      console.error(
        "Invalid Ollama JSON response:",
        text
      );

      // Safe fallback
      return JSON.stringify({
        atsScore: 0,
        skills: [],
        strengths: [],
        weaknesses: [
          "AI returned invalid JSON format",
        ],
        missingSkills: [],
        suggestions: [
          "Please try uploading the resume again",
        ],
      });
    }
  }
}

export default new OllamaService();