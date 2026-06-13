import mongoose from "mongoose";

const SisterChannelSchema = new mongoose.Schema(
  {
    logo: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subscriber: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SisterChannel = mongoose.models.SisterChannel || mongoose.model("SisterChannel", SisterChannelSchema);
