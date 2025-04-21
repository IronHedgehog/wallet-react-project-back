const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const allCategories = require("../data/categories");

router.get("/transactions-summary", authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.userId;

    if (!month || !year) {
      return res.json({
        categoriesSummary: [],
        expenseSummary: 0,
        incomeSummary: 0,
      });
    }

    const paddedMonth = String(month).padStart(2, "0");
    const startDate = new Date(`${year}-${paddedMonth}-01T00:00:00.000Z`);
    const endDate = new Date(
      new Date(startDate).setMonth(startDate.getMonth() + 1)
    );

    const transactions = await Transaction.find({
      owner: new mongoose.Types.ObjectId(userId),
      transactionDate: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const summary = {};
    let income = 0;
    let expenses = 0;

    for (const tx of transactions) {
      const categoryId = tx.categoryId;
      const categoryType = tx.type;
      const amount = tx.amount;

      if (!summary[categoryId]) {
        summary[categoryId] = { total: 0, type: categoryType };
      }

      summary[categoryId].total += amount;

      if (categoryType === "INCOME") income += amount;
      if (categoryType === "EXPENSE") expenses += amount;
    }

    const categoriesSummary = Object.entries(summary).map(
      ([categoryId, { total, type }]) => {
        const categoryData = allCategories.find((cat) => cat.id === categoryId);

        return {
          id: categoryId,
          name: categoryData?.name || "Unknown",
          total,
          type,
          backgroundColor: categoryData?.backgroundColor || "#CCCCCC",
        };
      }
    );

    res.json({
      categoriesSummary,
      expenseSummary: expenses,
      incomeSummary: income,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
