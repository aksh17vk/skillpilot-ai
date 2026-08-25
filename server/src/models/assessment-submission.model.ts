import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        questionIndex: Number,
        selectedAnswer: String,
      },
    ],
    score: Number,
    passed: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model(
  "AssessmentSubmission",
  submissionSchema
);