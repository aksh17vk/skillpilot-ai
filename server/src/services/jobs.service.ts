import jobsRepository from "../repositories/jobs.repository.js";
import resumeRepository from "../repositories/resume.repository.js";
import jdAnalyzerService from "../ai/jd-analyzer.service.js";
import { calculateSkillGap } from "../utils/skill-gap.js";

class JobsService {
  async analyzeJob(
    userId: string,
    jobDescription: string
  ) {
    // Get latest uploaded resume
    const latestResume =
      await resumeRepository.findLatestByUser(
        userId
      );

    if (!latestResume) {
      throw new Error(
        "Please upload a resume before analyzing a job description."
      );
    }

    // AI-based JD analysis
    const jdAnalysis =
      await jdAnalyzerService.analyze(
        jobDescription
      );

    // Resume skills from latest AI analysis
    const resumeSkills =
      latestResume.analysis?.skills || [];

    // Normalize semantic JD skills
    const normalizedJD =
      jdAnalysis.requiredSkills.map(
        (skill: string) => {
          const s = skill.toLowerCase();

          if (
            s.includes(
              "server-side javascript"
            )
          )
            return "Node.js";

          if (
            s.includes(
              "container orchestration"
            )
          )
            return "Kubernetes";

          if (s.includes("ci pipelines"))
            return "CI/CD";

          return skill;
        }
      );

    // Real skill gap calculation
    const skillGap = calculateSkillGap(
      resumeSkills,
      normalizedJD
    );

    // Final response object
    const finalAnalysis = {
      requiredSkills: normalizedJD,
      resumeSkills,
      skillGap,
    };

    // Save in DB
    await jobsRepository.create({
      user: userId,
      description: jobDescription,
      analysis: finalAnalysis,
    });

    // IMPORTANT: return final object directly
    return {
      analysis: finalAnalysis,
    };
  }

  async getLatestJob(userId: string) {
    return jobsRepository.findLatestByUser(userId);
  }
}

export default new JobsService();