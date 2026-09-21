import {
  ollama,
  CHAT_MODEL,
  KEEP_ALIVE,
  modelOptions,
  clampText,
} from "./ollama.client.js";

const JD_SCHEMA = {
  type: "object",
  properties: {
    requiredSkills: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["requiredSkills"],
};

class JDAnalyzerService {
  async analyze(jobDescription: string) {
    const prompt = `
Extract all technical skills, frameworks, programming languages, cloud platforms, databases, DevOps tools, and technologies from this job description.

Return ONLY valid JSON in this format:

{
  "requiredSkills": ["skill1", "skill2"]
}

Job Description:
${clampText(jobDescription, 10000)}
`;

    const response = await ollama.generate({
      model: CHAT_MODEL,
      prompt,
      format: JD_SCHEMA,
      keep_alive: KEEP_ALIVE,
      options: modelOptions({
        temperature: 0,
        num_predict: 400,
      }),
    });

    let text = response.response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1);
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      console.error(
        "JD Analyzer JSON parse error:",
        text
      );

      return {
        requiredSkills: [],
      };
    }
  }
}

export default new JDAnalyzerService();