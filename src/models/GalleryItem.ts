import mongoose from "mongoose";

const GalleryItemSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const GalleryItem = mongoose.models.GalleryItem || mongoose.model("GalleryItem", GalleryItemSchema);
