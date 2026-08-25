import ollama from "ollama";

class OllamaService {
  async analyzeResume(resumeText: string) {
    const response = await ollama.chat({
      model: "llama3.2:3b",
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

Resume:
${resumeText}
`,
        },
      ],
      options: {
        temperature: 0.1,
      },
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