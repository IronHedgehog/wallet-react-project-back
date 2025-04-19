const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/transactions
router.get("/", authMiddleware, async (req, res) => {
  const transactions = await Transaction.find({ owner: req.user.userId });
  res.json(transactions);
});

router.post("/", authMiddleware, async (req, res) => {
  const { type, categoryId, comment, amount, transactionDate } = req.body;

  // Дістати попередній баланс:
  const lastTransaction = await Transaction.findOne({
    owner: req.user.userId,
  }).sort({ date: -1 });
  const previousBalance = lastTransaction ? lastTransaction.balanceAfter : 0;
  const balanceAfter = previousBalance + amount;

  const transaction = await Transaction.create({
    type,
    categoryId,
    comment,
    amount,
    balanceAfter,
    transactionDate,
    owner: req.user.userId,
  });

  res.status(201).json(transaction);
});

router.get("/summary", authMiddleware, async (req, res) => {
  const { month, year } = req.query;

  const all = await Transaction.find({ owner: req.user.userId });

  const summary = all.filter((t) => {
    const [day, mon, yr] = t.date.split(".");
    return mon === month && yr === year;
  });

  res.json(summary);
});

module.exports = router;
