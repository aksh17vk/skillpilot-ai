import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const assessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },
    day: {
      type: Number,
      required: true,
    },
    focus: String,
    questions: [questionSchema],
    attemptNumber: {
        type: Number,
        default: 1,
      },
    isActive: {
    type: Boolean,
    default: true,
    },
    isUnlocked: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Assessment",
  assessmentSchema
);