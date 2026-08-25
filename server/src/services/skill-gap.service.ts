import { calculateSkillGap } from "../utils/skill-gap.js";
import resumeRepository from "../repositories/resume.repository.js";
import jobsRepository from "../repositories/jobs.repository.js";

class SkillGapService {
  analyze(
    resumeSkills: string[],
    requiredSkills: string[]
  ) {
    return calculateSkillGap(
      resumeSkills,
      requiredSkills
    );
  }

  async generate(userId: string) {
    const latestResume = await resumeRepository.findLatestByUser(userId);
    const latestJob = await jobsRepository.findLatestByUser(userId);

    const resumeSkills = latestResume?.analysis?.skills || [];
    const requiredSkills = (latestJob as any)?.analysis?.requiredSkills || [];

    const skillGap = calculateSkillGap(resumeSkills, requiredSkills);

    return {
      resumeSkills,
      requiredSkills,
      skillGap,
      latestResume,
      latestJob,
    };
  }
}

export default new SkillGapService();