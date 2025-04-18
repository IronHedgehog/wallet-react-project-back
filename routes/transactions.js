const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/transactions
router.get("/", authMiddleware, async (req, res) => {
  const transactions = await Transaction.find({ owner: req.user.id });
  res.json(transactions);
});

router.post("/", authMiddleware, async (req, res) => {
  const { type, category, comment, amount, date, balanceAfter } = req.body;

  const transaction = await Transaction.create({
    type,
    category,
    comment,
    amount,
    balanceAfter,
    date,
    owner: req.user.id,
  });

  res.status(201).json(transaction);
});

router.get("/summary", authMiddleware, async (req, res) => {
  const { month, year } = req.query;

  const all = await Transaction.find({ owner: req.user.id });

  const summary = all.filter((t) => {
    const [day, mon, yr] = t.date.split(".");
    return mon === month && yr === year;
  });

  res.json(summary);
});

module.exports = router;
