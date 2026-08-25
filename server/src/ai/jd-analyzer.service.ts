import ollama from "ollama";

class JDAnalyzerService {
  async analyze(jobDescription: string) {
    const prompt = `
Extract all technical skills, frameworks, programming languages, cloud platforms, databases, DevOps tools, and technologies from this job description.

Return ONLY valid JSON in this format:

{
  "requiredSkills": ["skill1", "skill2"]
}

Job Description:
${jobDescription}
`;

    const response = await ollama.generate({
      model: "llama3.2:3b",
      prompt,
      options: {
        temperature: 0,
        num_predict: 256,
      },
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