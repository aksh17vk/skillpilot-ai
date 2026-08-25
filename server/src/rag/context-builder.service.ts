import roadmapRepository from "../repositories/roadmap.repository.js";
import resumeRepository from "../repositories/resume.repository.js";
import jobsRepository from "../repositories/jobs.repository.js";
import { calculateSkillGap } from "../utils/skill-gap.js";

class ContextBuilderService {
  async buildUserContext(userId: string) {
    const roadmap =
      await roadmapRepository.findLatestByUser(userId);

    const resume =
      await resumeRepository.findLatestByUser(userId);

    const job =
      await jobsRepository.findLatestByUser(userId);

    let context = "User career context:\n";

    // Resume
    if (resume) {
      context += `Resume uploaded: Yes\n`;

      const skills =
        resume.analysis?.skills || [];

      context += `Resume skills: ${skills.join(", ")}\n`;
    } else {
      context += `Resume uploaded: No\n`;
    }

    // Job
    if (job) {
      context += `Target role: ${job.title}\n`;

      const required =
        job.analysis?.requiredSkills || [];

      context += `Required skills: ${required.join(", ")}\n`;

      // Skill gap
      if (resume) {
        const gap = calculateSkillGap(
          resume.analysis?.skills || [],
          required
        );

        context += `Current match score: ${gap.matchPercentage}%\n`;

        context += `Missing skills: ${gap.missingSkills.join(", ")}\n`;
      }
    } else {
      context += `Target role: Not analyzed yet\n`;
    }

    // Roadmap
    if (roadmap) {
      context += `Study hours/day: ${roadmap.studyHoursPerDay}\n`;

      context += `Roadmap duration: ${roadmap.durationDays} days\n`;

      context += `Roadmap match score: ${roadmap.matchPercentage}%\n`;

      context += `Roadmap missing skills: ${roadmap.missingSkills.join(
        ", "
      )}\n`;

      // Current day suggestion (simple MVP)
      const todayPlan = roadmap.days?.[0];

      if (todayPlan) {
        context += `Current study focus: Day ${todayPlan.day} - ${todayPlan.skill}\n`;

        context += `Today's topics: ${todayPlan.topics.join(", ")}\n`;
      }
    } else {
      context += `Roadmap generated: No\n`;
    }

    return context;
  }
}

export default new ContextBuilderService();