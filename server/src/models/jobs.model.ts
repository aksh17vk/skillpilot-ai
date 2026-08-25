import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: String,

    description: {
      type: String,
      required: true,
    },

    analysis: {
      requiredSkills: [String],
      resumeSkills: [String],
      keywords: [String],
      experienceLevel: String,
      responsibilities: [String],
      skillGap: {
        matchedSkills: [String],
        missingSkills: [String],
        matchPercentage: Number,
        readinessScore: String,
        recommendations: [String],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;