
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
    },

    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    professionalTitle: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    profilePhotoUrl: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    education: {
      type: [
        {
          institution: { type: String, trim: true, maxlength: 200 },
          qualification: { type: String, trim: true, maxlength: 200 },
          fieldOfStudy: { type: String, trim: true, maxlength: 200 },
          startDate: { type: String, trim: true, maxlength: 20 },
          endDate: { type: String, trim: true, maxlength: 20 },
          description: { type: String, trim: true, maxlength: 1000 },
        },
      ],
      default: [],
    },

    workExperience: {
      type: [
        {
          company: { type: String, trim: true, maxlength: 200 },
          jobTitle: { type: String, trim: true, maxlength: 200 },
          location: { type: String, trim: true, maxlength: 120 },
          startDate: { type: String, trim: true, maxlength: 20 },
          endDate: { type: String, trim: true, maxlength: 20 },
          current: { type: Boolean, default: false },
          description: { type: String, trim: true, maxlength: 2000 },
        },
      ],
      default: [],
    },

    linkedinUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    portfolioUrl: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
