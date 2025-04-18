const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Transaction = require("../models/Transaction");

// GET /api/transactions
router.get("/", auth, async (req, res) => {
  const transactions = await Transaction.find({ owner: req.user.id });
  res.json(transactions);
});

// POST /api/transactions
router.post("/", auth, async (req, res) => {
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

// GET /api/transactions-summary?month=04&year=2025
router.get("/summary", auth, async (req, res) => {
  const { month, year } = req.query;

  const all = await Transaction.find({ owner: req.user.id });

  const summary = all.filter((t) => {
    const [day, mon, yr] = t.date.split(".");
    return mon === month && yr === year;
  });

  res.json(summary); // можеш ще по категоріях згрупувати
});

module.exports = router;
