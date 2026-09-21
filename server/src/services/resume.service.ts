import ollamaService from "../ai/ollama.service.js";
// import ollamaService from "../ai/ollama.service.js";
import resumeRepository from "../repositories/resume.repository.js";
import { extractResumeText } from "../utils/resume.parser.js";

class ResumeService {
  async analyzeResume(userId: string, file: Express.Multer.File) {
    // 1. Extract text from PDF/DOCX
    const extractedText = await extractResumeText(file.path);

    if (!extractedText || extractedText.trim().length < 20) {
      throw new Error(
        "Resume text extraction failed. Please upload a valid resume."
      );
    }

    // 2. Debug preview (temporary)
    console.log("===== EXTRACTED RESUME PREVIEW =====");
    console.log(extractedText.slice(0, 1000));
    console.log("====================================");

    // 3. AI analysis
    const rawAnalysis =
      await ollamaService.analyzeResume(extractedText);

    // 4. Clean Ollama response
    const cleaned = rawAnalysis
      ?.replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // 5. Parse JSON safely
    let analysis: any = {};

    try {
      analysis = JSON.parse(cleaned || "{}");
      // Dynamic ATS score calculation
const skillsCount =
  analysis.skills?.length || 0;

const strengthsCount =
  analysis.strengths?.length || 0;

const missingCount =
  analysis.missingSkills?.length || 0;

const weaknessCount =
  analysis.weaknesses?.length || 0;

let score = 50;

// Skills: max +30
score += Math.min(skillsCount * 2, 30);

// Strengths: max +15
score += Math.min(strengthsCount * 2, 15);

// Missing skills penalty: max -20
score -= Math.min(missingCount * 3, 20);

// Weakness penalty: max -10
score -= Math.min(weaknessCount * 2, 10);

// Keep score realistic
score = Math.max(35, Math.min(95, score));

// Force update ATS score
analysis.atsScore = score;

// Infer weaknesses if AI did not provide any
if (
  !analysis.weaknesses ||
  analysis.weaknesses.length === 0
) {
  analysis.weaknesses = [];

  // Infer from missing skills
  if (
    analysis.missingSkills?.includes(
      "Cloud computing"
    )
  ) {
    analysis.weaknesses.push(
      "Limited exposure to cloud platforms such as AWS, Azure, or GCP."
    );
  }

  if (
    analysis.missingSkills?.includes("DevOps")
  ) {
    analysis.weaknesses.push(
      "Hands-on DevOps practices such as CI/CD, Docker orchestration, and deployment automation are not highlighted."
    );
  }

  if (
    analysis.missingSkills?.includes(
      "Cybersecurity"
    )
  ) {
    analysis.weaknesses.push(
      "Security-focused development practices are not clearly demonstrated."
    );
  }

  if (
    analysis.missingSkills?.includes(
      "Data science"
    )
  ) {
    analysis.weaknesses.push(
      "Data analysis and machine learning experience is not evident from the resume."
    );
  }

  // Generic fallback
  if (analysis.weaknesses.length === 0) {
    analysis.weaknesses.push(
      "Resume could include more measurable achievements and project impact metrics."
    );
  }
}
    } catch (error) {
      console.error("Ollama JSON Parse Error:", cleaned);

      throw new Error(
        "AI returned an invalid response. Please try again."
      );
    }

    // 6. Save in MongoDB
    const resume = await resumeRepository.create({
      user: userId,
      fileName: file.originalname, // keep original uploaded name
      filePath: file.path,
      extractedText,
      analysis,
    });

    // 7. Return response
    return {
      resumeId: resume._id,
      fileName: file.originalname,
      analysis,
    };
  }

  async getLatestResume(userId: string) {
    return resumeRepository.findLatestByUser(userId);
  }
}

export default new ResumeService();