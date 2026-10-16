
const express = require("express");
const mongoose = require("mongoose");
const JobApplication = require("../models/JobApplication");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All application routes require an authenticated user.
router.use(protect);

// Get only the logged-in user's applications.
router.get("/", async (req, res) => {
  try {
    const applications = await JobApplication.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.json({ success: true, data: applications });
  } catch (error) {
    console.error("Get applications failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to load applications.",
    });
  }
});

// Get one application belonging to the logged-in user.
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    const application = await JobApplication.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.json({ success: true, data: application });
  } catch (error) {
    console.error("Get application failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to load application.",
    });
  }
});

// Create an application owned by the logged-in user.
router.post("/", async (req, res) => {
  try {
    const {
      company,
      jobTitle,
      location,
      applicationDate,
      status,
      jobUrl,
      notes,
    } = req.body;

    const application = await JobApplication.create({
      company,
      jobTitle,
      location,
      applicationDate,
      status,
      jobUrl,
      notes,
      userId: req.user._id,
    });

    return res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create application failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create application.",
    });
  }
});

// Update only an application owned by the logged-in user.
router.patch("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    const allowedFields = [
      "company",
      "jobTitle",
      "location",
      "applicationDate",
      "status",
      "jobUrl",
      "notes",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    const application = await JobApplication.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.json({ success: true, data: application });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update application failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update application.",
    });
  }
});

// Delete only an application owned by the logged-in user.
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID.",
      });
    }

    const application = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    return res.json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    console.error("Delete application failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete application.",
    });
  }
});

module.exports = router;
