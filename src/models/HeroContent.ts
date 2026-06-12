import mongoose from "mongoose";

const HeroContentSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    currentActiveOnLiveSite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent compiling model again if it exists
export const HeroContent = mongoose.models.HeroContent || mongoose.model("HeroContent", HeroContentSchema);
