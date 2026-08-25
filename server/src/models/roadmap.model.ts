import mongoose, { Schema } from "mongoose";

const roadmapDaySchema = new Schema(
  {
    day: Number,
    hours: Number,
    skill: String,
    topics: [String],
    task: String,
  },
  { _id: false }
);

const roadmapSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetRole: {
      type: String,
      required: true,
    },

    studyHoursPerDay: {
      type: Number,
      required: true,
    },

    durationDays: {
      type: Number,
      default: 30,
    },

    matchPercentage: Number,

    missingSkills: [String],

    days: [roadmapDaySchema],
  },
  {
    timestamps: true,
  }
);

const Roadmap = mongoose.model(
  "Roadmap",
  roadmapSchema
);

export default Roadmap;