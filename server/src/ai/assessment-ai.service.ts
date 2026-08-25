import ollama from "ollama";

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
      model: "llama3.2:3b",
      prompt,
      options: { temperature: 0.2 },
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