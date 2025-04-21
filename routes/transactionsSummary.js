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

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(`${year}-${month}-31`);

    const transactions = await Transaction.find({
      owner: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    let expenseSummary = 0;
    let incomeSummary = 0;
    const categoriesSummaryMap = {};

    for (const transaction of transactions) {
      const { type, amount, category } = transaction;

      if (!categoriesSummaryMap[category]) {
        categoriesSummaryMap[category] = { name: category, total: 0, type };
      }

      categoriesSummaryMap[category].total += amount;

      if (type === "EXPENSE") {
        expenseSummary += amount;
      } else if (type === "INCOME") {
        incomeSummary += amount;
      }
    }

    const categoriesSummary = Object.values(categoriesSummaryMap);

    res.json({
      categoriesSummary,
      expenseSummary,
      incomeSummary,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
