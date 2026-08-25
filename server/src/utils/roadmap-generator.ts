import { CURRICULUM } from "./curriculum.js";

interface RoadmapDay {
  day: number;
  hours: number;
  skill: string;
  topics: string[];
  task: string;
}

export function generateRoadmap(
  missingSkills: string[],
  studyHoursPerDay: number,
  durationDays: number
): RoadmapDay[] {
  const days: RoadmapDay[] = [];

  // If no missing skills
  if (missingSkills.length === 0) {
    return [
      {
        day: 1,
        hours: studyHoursPerDay,
        skill: "career-growth",
        topics: [
          "System design basics",
          "DSA practice",
          "Portfolio improvement",
        ],
        task: "Improve portfolio and practice one coding problem.",
      },
    ];
  }

  const daysPerSkill = Math.max(
    1,
    Math.floor(durationDays / missingSkills.length)
  );

  let currentDay = 1;

  for (const skill of missingSkills) {
    const data = CURRICULUM[skill.toLowerCase()];

    if (!data) continue;

    const topics = [
      ...data.beginner,
      ...data.intermediate,
      ...data.advanced,
      ...data.project,
    ];

    for (
      let i = 0;
      i < daysPerSkill && currentDay <= durationDays;
      i++
    ) {
      const topic = topics[i % topics.length];

      let phase = "Practice";

      if (i < 5) phase = "Beginner";
      else if (i < 10) phase = "Intermediate";
      else if (i < 15) phase = "Advanced";
      else phase = "Project";

      days.push({
        day: currentDay,
        hours: studyHoursPerDay,
        skill,
        topics: [topic],
        task: `${phase}: Complete notes and practical implementation for ${topic}.`,
      });

      currentDay++;
    }
  }

  // Fill remaining days
  while (currentDay <= durationDays) {
    days.push({
      day: currentDay,
      hours: studyHoursPerDay,
      skill: "revision",
      topics: [
        "Revision",
        "Mini Project",
        "Interview Questions",
      ],
      task: "Revise all previous topics and build a small project.",
    });

    currentDay++;
  }

  return days;
}