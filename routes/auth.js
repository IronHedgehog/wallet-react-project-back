const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/sign-up", async (req, res) => {
  const { email, password } = req.body;
  try {
    const exist = await User.findOne({ email });
    if (exist) return res.status(409).json({ message: "Email in use" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hash });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
    res.status(201).json({
      token,
      user: { email: newUser.email, balance: newUser.balance },
    });
  } catch (e) {
    res.status(500).json({ message: "Registration error" });
  }
});

router.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { email: user.email, balance: user.balance } });
  } catch (e) {
    res.status(500).json({ message: "Login error" });
  }
});

router.get("/current", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      email: user.email,
      balance: user.balance,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
