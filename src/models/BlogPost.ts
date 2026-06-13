import mongoose from "mongoose";

const BlogPostSchema = new mongoose.Schema(
  {
    banner: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    blogdate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);
