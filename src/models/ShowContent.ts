import mongoose from "mongoose";

const CastMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
});

const ShowContentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    dramaType: {
      type: String,
      trim: true,
      default: "",
    },
    showDramaType: {
      type: Boolean,
      default: false,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    awardWinnerCategory: {
      type: String,
      trim: true,
      default: "",
    },
    awardGivenInstitution: {
      type: String,
      trim: true,
      default: "",
    },
    showAwards: {
      type: Boolean,
      default: false,
    },
    imdbScore: {
      type: String,
      trim: true,
      default: "",
    },
    showImdbScore: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    homepageStatus: {
      type: Boolean,
      default: false,
    },
    cast: {
      type: [CastMemberSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent compiling model again if it exists
export const ShowContent = mongoose.models.ShowContent || mongoose.model("ShowContent", ShowContentSchema);

