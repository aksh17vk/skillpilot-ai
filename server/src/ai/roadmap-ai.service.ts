import {
  ollama,
  CHAT_MODEL,
  KEEP_ALIVE,
  modelOptions,
} from "./ollama.client.js";

// The model writes at most this many unique days; longer roadmaps
// are filled by cycling them (see below). Keeps generation inside
// the token budget instead of truncating into invalid JSON.
const MAX_GENERATED_DAYS = 14;

const ROADMAP_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    days: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          focus: { type: "string" },
          tasks: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
  },
  required: ["title", "days"],
};

class RoadmapAIService {
  async generate(data: {
    currentSkills: string[];
    missingSkills: string[];
    targetRole: string;
    dailyHours: number;
    preferredStudyTime: string;
    daysPerWeek: number;
    durationDays: number;
  }) {
    const generatedDays = Math.max(
      1,
      Math.min(data.durationDays, MAX_GENERATED_DAYS)
    );

    const prompt = `
You are an expert career mentor.

Generate a personalized learning roadmap for the role:
${data.targetRole}

Current skills: ${data.currentSkills.join(", ")}
Missing skills: ${data.missingSkills.join(", ")}
Daily study time: ${data.dailyHours} hours
Preferred study time: ${data.preferredStudyTime}
Study days per week: ${data.daysPerWeek}
Duration: ${data.durationDays} days

Return ONLY valid JSON with this exact structure:

{
  "title": "Roadmap title",
  "days": [
    {
      "day": 1,
      "focus": "Topic name",
      "tasks": ["Task 1", "Task 2"]
    }
  ]
}

Generate exactly ${generatedDays} days with 2-3 concise tasks each.`;

    try {
      const response = await ollama.generate({
        model: CHAT_MODEL,
        prompt,
        format: ROADMAP_SCHEMA,
        keep_alive: KEEP_ALIVE,
        options: modelOptions({
          temperature: 0.2,
          num_predict: 1500,
        }),
      });

      let text = response.response || "";

      // Remove markdown fences
      text = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // Extract JSON safely
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");

      if (start !== -1 && end !== -1) {
        text = text.substring(start, end + 1);
      }

      const parsed = JSON.parse(text);

      const generated: any[] = Array.isArray(parsed.days)
        ? parsed.days.filter((d: any) => d?.focus)
        : [];

      // Guarantee at least one day
      if (generated.length === 0) {
        generated.push({
          focus:
            data.missingSkills[0] || "Career Preparation",
          tasks: [
            "Study fundamentals",
            "Complete one practical exercise",
          ],
        });
      }

      // Ensure exact number of days (cycle the generated ones).
      // schedule/hours are constants, so they are filled here
      // instead of making the model repeat them for every day.
      const days = [];

      for (let i = 1; i <= data.durationDays; i++) {
        const template =
          generated[(i - 1) % generated.length];

        days.push({
          day: i,
          focus: template.focus,
          schedule: data.preferredStudyTime,
          tasks: Array.isArray(template.tasks)
            ? template.tasks
            : [],
          hours: data.dailyHours,
        });
      }

      return {
        title:
          parsed.title ||
          `${data.durationDays}-Day Roadmap for ${data.targetRole}`,
        dailyHours: data.dailyHours,
        preferredStudyTime: data.preferredStudyTime,
        daysPerWeek: data.daysPerWeek,
        days,
      };
    } catch (error) {
      console.error(
        "Roadmap generation error:",
        error
      );

      // Fallback roadmap (always works)
      return {
        title: `${data.durationDays}-Day Roadmap for ${data.targetRole}`,
        dailyHours: data.dailyHours,
        preferredStudyTime:
          data.preferredStudyTime,
        daysPerWeek: data.daysPerWeek,
        days: [
          {
            day: 1,
            focus:
              data.missingSkills[0] ||
              "Career Preparation",
            schedule: data.preferredStudyTime,
            tasks: [
              "Study fundamentals",
              "Complete one practical exercise",
            ],
            hours: data.dailyHours,
          },
          {
            day: 2,
            focus:
              data.missingSkills[1] ||
              "Practice & Revision",
            schedule: data.preferredStudyTime,
            tasks: [
              "Practice problems",
              "Revise previous topic",
            ],
            hours: data.dailyHours,
          },
        ],
      };
    }
  }
}

export default new RoadmapAIService();