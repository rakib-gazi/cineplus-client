import mongoose from "mongoose";

const BrandedBrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BrandedCategory",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BrandedBrand =
  mongoose.models.BrandedBrand ||
  mongoose.model("BrandedBrand", BrandedBrandSchema);
