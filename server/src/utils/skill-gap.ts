export function calculateSkillGap(
    resumeSkills: string[],
    jobSkills: string[]
  ) {
    const normalize = (arr: string[]) =>
      arr.map((s) => s.toLowerCase().trim());
  
    const resume = normalize(resumeSkills);
    const job = normalize(jobSkills);
  
    const matchedSkills = job.filter((skill) =>
      resume.includes(skill)
    );
  
    const missingSkills = job.filter(
      (skill) => !resume.includes(skill)
    );
  
    const matchPercentage =
      job.length === 0
        ? 0
        : Math.round(
            (matchedSkills.length / job.length) * 100
          );
  
    let readinessScore = "Low";
  
    if (matchPercentage >= 80) readinessScore = "High";
    else if (matchPercentage >= 50)
      readinessScore = "Medium";
  
    return {
      matchPercentage,
      matchedSkills,
      missingSkills,
      readinessScore,
      recommendations: missingSkills.map(
        (skill) => `Learn ${skill}`
      ),
    };
  }