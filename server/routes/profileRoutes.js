
const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// Fields users are allowed to update
const allowedFields = [
  "name",
  "phone",
  "location",
  "professionalTitle",
  "profilePhotoUrl",
  "bio",
  "skills",
  "education",
  "workExperience",
  "linkedinUrl",
  "portfolioUrl",
];

// GET /api/profile
// Return the logged-in user's profile
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-passwordHash -__v"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    res.json({
      success: true,
      profile: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load profile.",
    });
  }
});

// PATCH /api/profile
// Update only permitted profile fields
router.patch("/", protect, async (req, res) => {
  try {
    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid profile fields provided.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).select("-passwordHash -__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully.",
      profile: user,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid profile information.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
});

module.exports = router;
