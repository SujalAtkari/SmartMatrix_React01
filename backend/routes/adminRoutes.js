const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();
//@route get/api/admin/users
//@desc get all users(Admin only)
//@access private/Admin

router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route post/api/admin/user
//@desc add a new user(admin only)
//@access private/Admin
router.post("/", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    user = new User({
      name,
      email,
      password,
      role: role || "user",
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route PUT /api/admin/user/:id
//@desc Update a user (Admin only) - name, email, role
//@access Private/Admin

router.put("/:id", protect, admin, async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    user.name = name || user.name;
    user.email = email || user.email;

    // Allow only valid roles
    if (role && ["user", "admin"].includes(role)) {
      user.role = role;
    }

    const updatedUser = await user.save();

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route DELETE /api/admin/users/:id
//@desc Delete a user (Admin only)
//@access Private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user._id;
    await user.deleteOne();

    res.json({ message: "User deleted successfully", _id: userId });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
