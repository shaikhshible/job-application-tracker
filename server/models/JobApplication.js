
const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },

    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    applicationDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Interview",
        "Offer",
        "Rejected",
        "Withdrawn",
      ],
      default: "Applied",
    },

    jobUrl: {
      type: String,
      trim: true,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);
