const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");

// router.get("/transactions-summary", authMiddleware, async (req, res) => {
//   try {
//     const { month, year } = req.query;
//     const userId = req.user.userId;
//     if (!month || !year) {
//       // Якщо немає параметрів — просто повертаємо порожні дані
//       return res.json({
//         categoriesSummary: [],
//         expensesSummary: 0,
//         incomeSummary: 0,
//       });
//     }

//     const transactions = await Transaction.find({
//       owner: userId,
//       date: {
//         $gte: new Date(`${year}-${month}-01`),
//         $lte: new Date(`${year}-${month}-31`),
//       },
//     });

//     const summary = transactions.reduce((acc, item) => {
//       if (!acc[item.category]) acc[item.category] = 0;
//       acc[item.category] += item.amount;
//       return acc;
//     }, {});

//     res.json(summary);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

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
      owner: userId,
      transactionDate: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const summary = {};
    let income = 0;
    let expenses = 0;

    for (const tx of transactions) {
      if (!summary[tx.categoryId]) {
        summary[tx.categoryId] = { total: 0, type: tx.type };
      }
      summary[tx.categoryId].total += tx.amount;

      if (tx.type === "INCOME") income += tx.amount;
      if (tx.type === "EXPENSE") expenses += tx.amount;
    }

    const categoriesSummary = Object.entries(summary).map(
      ([name, { total, type }]) => ({
        name,
        total,
        type,
      })
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
