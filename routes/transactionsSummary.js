const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

router.get("/transactions-summary", authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.userId;
    if (!month || !year) {
      // Якщо немає параметрів — просто повертаємо порожні дані
      return res.json({
        expensesSummary: [],
        incomeSummary: [],
      });
    }

    const transactions = await Transaction.find({
      owner: userId,
      date: {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`),
      },
    });

    const summary = transactions.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = 0;
      acc[item.category] += item.amount;
      return acc;
    }, {});

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
