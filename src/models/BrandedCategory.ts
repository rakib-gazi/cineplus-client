import mongoose from "mongoose";

const BrandedCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BrandedCategory =
  mongoose.models.BrandedCategory ||
  mongoose.model("BrandedCategory", BrandedCategorySchema);
