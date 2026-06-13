import mongoose from "mongoose";

const PartnerInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    institution: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PartnerInquiry =
  mongoose.models.PartnerInquiry ||
  mongoose.model("PartnerInquiry", PartnerInquirySchema);
