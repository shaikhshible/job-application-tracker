const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

// All routes in this file require an authenticated administrator.
router.use(protect, requireAdmin);

// GET /api/admin/users
// Return a paginated list of registered users.
router.get("/users", async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    );
    const search = String(req.query.search || "").trim();

    const filter = {};

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { name: { $regex: escapedSearch, $options: "i" } },
        { email: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("_id name email role status createdAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin user listing failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users.",
    });
  }
});

/**
 * PATCH /api/admin/users/:id/status
 * Suspend or reactivate a user account.
 */
router.patch("/users/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "suspended"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be "active" or "suspended".',
      });
    }

    // Prevent an administrator from accidentally suspending
    // or changing their own account through this endpoint.
    if (req.params.id === String(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own account status here.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Protect administrator accounts from this operation.
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Administrator accounts cannot be changed here.",
      });
    }

    user.status = status;
    await user.save();

    return res.json({
      success: true,
      message:
        status === "suspended"
          ? "User suspended successfully."
          : "User reactivated successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    console.error("Admin status update failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update account status.",
    });
  }
});

module.exports = router;
