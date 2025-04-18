const express = require("express");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { type, category, amount, date, comment } = req.body;
  try {
    const newTransaction = new Transaction({
      userId: req.user.userId,
      type,
      category,
      amount,
      date,
      comment
    });
    await newTransaction.save();

    const user = await User.findById(req.user.userId);
    user.balance += type === "income" ? amount : -amount;
    await user.save();

    res.status(201).json({ transaction: newTransaction, newBalance: user.balance });
  } catch (err) {
    res.status(500).json({ message: "Failed to add transaction" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });
    res.json(transactions);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

module.exports = router;
