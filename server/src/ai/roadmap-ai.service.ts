import ollama from "ollama";

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
  "dailyHours": ${data.dailyHours},
  "preferredStudyTime": "${data.preferredStudyTime}",
  "daysPerWeek": ${data.daysPerWeek},
  "days": [
    {
      "day": 1,
      "focus": "Topic name",
      "schedule": "${data.preferredStudyTime}",
      "tasks": ["Task 1", "Task 2"],
      "hours": ${data.dailyHours}
    }
  ]
}

Generate concise tasks.`;

    try {
      const response = await ollama.generate({
        model: "llama3.2:3b",
        prompt,
        options: {
          temperature: 0.2,
          num_predict: 1200,
        },
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

      // Ensure exact number of days
const requestedDays = data.durationDays;

if (parsed.days.length < requestedDays) {
  const existing = [...parsed.days];

  for (
    let i = existing.length + 1;
    i <= requestedDays;
    i++
  ) {
    const template =
      existing[(i - 1) % existing.length];

    parsed.days.push({
      day: i,
      focus: template.focus,
      schedule: template.schedule,
      tasks: template.tasks,
      hours: template.hours,
    });
  }
}

// Trim if AI generated extra days
parsed.days = parsed.days.slice(
  0,
  requestedDays
);

      // Ensure required fields exist
      parsed.title =
        parsed.title ||
        `${data.durationDays}-Day Roadmap for ${data.targetRole}`;

      parsed.dailyHours =
        parsed.dailyHours || data.dailyHours;

      parsed.preferredStudyTime =
        parsed.preferredStudyTime ||
        data.preferredStudyTime;

      parsed.daysPerWeek =
        parsed.daysPerWeek || data.daysPerWeek;

      parsed.days = Array.isArray(parsed.days)
        ? parsed.days
        : [];

      // Guarantee at least one day
      if (parsed.days.length === 0) {
        parsed.days.push({
          day: 1,
          focus: data.missingSkills[0] || "Career Preparation",
          schedule: data.preferredStudyTime,
          tasks: [
            "Study fundamentals",
            "Complete one practical exercise",
          ],
          hours: data.dailyHours,
        });
      }

      return parsed;
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