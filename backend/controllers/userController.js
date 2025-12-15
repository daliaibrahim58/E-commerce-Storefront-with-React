import User from "../models/User.js";
import process from "process";

// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    // Helpful debug: log incoming payload when troubleshooting client 400s
    console.debug("UpdateUser payload:", {
      params: req.params,
      body: req.body,
      user: req.user ? { id: req.user.id, role: req.user.role } : null,
    });
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is updating themselves or is admin
    if (req.user.id !== req.params.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this user" });
    }

    // Only admin can change roles
    if (role && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can change user roles" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role && req.user.role === "admin") {
      if (role === "admin" || role === "client") {
        user.role = role;
      } else {
        return res
          .status(400)
          .json({ message: "Invalid role. Must be admin or client" });
      }
    }

    await user.save();

    // Generate new token if role changed
    let token = null;
    if (role && req.user.id === req.params.id) {
      const jwt = (await import("jsonwebtoken")).default;
      const payload = { id: user._id, role: user.role, email: user.email };
      token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token || undefined,
    });
  } catch (error) {
    // Handle Mongoose validation errors and duplicate key (unique) errors with 400
    if (error.name === "ValidationError") {
      const details = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation error", details });
    }

    if (error.code && error.code === 11000) {
      // Duplicate key error (e.g. email already exists)
      const field = Object.keys(error.keyValue || {})[0];
      return res
        .status(400)
        .json({ message: `Duplicate value for field '${field}'` });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only admin can delete users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can delete users" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
