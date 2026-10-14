
const express = require("express");
const JobApplication = require("../models/JobApplication");

const router = express.Router();

// GET: Retrieve all job applications
router.get("/", async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve job applications",
    });
  }
});

// GET: Retrieve one job application
router.get("/:id", async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Job application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid job application ID",
    });
  }
});

// POST: Create a job application
router.post("/", async (req, res) => {
  try {
    const application = await JobApplication.create(req.body);

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// PATCH: Update a job application
router.patch("/:id", async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Job application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE: Delete a job application
router.delete("/:id", async (req, res) => {
  try {
    const application = await JobApplication.findByIdAndDelete(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Job application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job application deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid job application ID",
    });
  }
});

module.exports = router;
