import roadmapAIService from "../ai/roadmap-ai.service.js";
import resumeRepository from "../repositories/resume.repository.js";
import jobsRepository from "../repositories/jobs.repository.js";
import roadmapRepository from "../repositories/roadmap.repository.js";

class RoadmapService {
  async generateRoadmap(
    userId: string,
    data: any
  ) {
    let currentSkills: string[] = [];
    let missingSkills: string[] = [];

    // 🚨 Target role MUST come from user
    const targetRole = data.targetRole;

    if (!targetRole) {
      throw new Error(
        "Target role is required."
      );
    }

    if (data.mode === "auto") {
      const latestResume =
        await resumeRepository.findLatestByUser(
          userId
        );

      const latestJob =
        await jobsRepository.findLatestByUser(
          userId
        );

      if (!latestResume) {
        throw new Error(
          "Please analyze your resume first."
        );
      }

      if (!latestJob) {
        throw new Error(
          "Please analyze a job description first."
        );
      }

      currentSkills =
        latestResume.analysis?.skills || [];

      missingSkills =
        latestJob.analysis?.requiredSkills ||
        [];
    } else {
      currentSkills = data.currentSkills || [];
      missingSkills = data.missingSkills || [];
    }

    if (missingSkills.length === 0) {
      throw new Error(
        "No missing skills found. Please analyze a job description again."
      );
    }

    const roadmap =
      await roadmapAIService.generate({
        currentSkills,
        missingSkills,
        targetRole,
        dailyHours: data.dailyHours || 2,
        preferredStudyTime:
          data.preferredStudyTime ||
          "Evening",
        daysPerWeek: data.daysPerWeek || 5,
        durationDays: data.durationDays || 30,
      });

    // Save generated roadmap in MongoDB
    try {
      await roadmapRepository.create({
        user: userId,
        targetRole,
        studyHoursPerDay: data.dailyHours || 2,
        durationDays: data.durationDays || 30,
        missingSkills,
        days: roadmap?.days || roadmap?.schedule || [],
      });
    } catch (e) {
      console.error("Failed to persist roadmap:", e);
    }

    return {
      generatedFrom:
        data.mode === "auto"
          ? "latest_resume_and_jd_analysis"
          : "manual_input",
      targetRole,
      currentSkills,
      missingSkills,
      roadmap,
    };
  }

  async getLatestRoadmap(userId: string) {
    return roadmapRepository.findLatestByUser(userId);
  }
}

export default new RoadmapService();