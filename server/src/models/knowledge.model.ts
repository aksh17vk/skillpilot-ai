import mongoose, { Schema } from "mongoose";

const knowledgeSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },

    skill: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["concept", "interview", "resume", "roadmap"],
      default: "concept",
    },

    source: {
      type: String,
      default: "manual",
    },

    embedding: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Knowledge = mongoose.model(
  "Knowledge",
  knowledgeSchema,
  "knowledges"
);
export default Knowledge;