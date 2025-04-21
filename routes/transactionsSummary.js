const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const Transaction = require("../models/Transaction");
const { default: mongoose } = require("mongoose");
const Category = require("../models/Category");
const allCategories = require("../data/categories");

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

// router.get("/transactions-summary", authMiddleware, async (req, res) => {
//   try {
//     const { month, year } = req.query;
//     const userId = req.user.userId;

//     if (!month || !year) {
//       return res.json({
//         categoriesSummary: [],
//         expenseSummary: 0,
//         incomeSummary: 0,
//       });
//     }

//     const paddedMonth = String(month).padStart(2, "0");
//     const startDate = new Date(`${year}-${paddedMonth}-01T00:00:00.000Z`);
//     const endDate = new Date(
//       new Date(startDate).setMonth(startDate.getMonth() + 1)
//     );
//     console.log("USER ID:", req.user.userId);
//     console.log(startDate);
//     console.log(endDate);
//     const transactions = await Transaction.find({
//       owner: new mongoose.Types.ObjectId(userId),
//       transactionDate: {
//         $gte: startDate,
//         $lt: endDate,
//       },
//     });
//     console.log(transactions);
//     const summary = {};
//     let income = 0;
//     let expenses = 0;

//     for (const tx of transactions) {
//       if (!summary[tx.categoryId]) {
//         summary[tx.categoryId] = { total: 0, type: tx.type };
//       }
//       summary[tx.categoryId].total += tx.amount;

//       if (tx.type === "INCOME") income += tx.amount;
//       if (tx.type === "EXPENSE") expenses += tx.amount;
//     }

//     const categoriesSummary = Object.entries(summary).map(
//       ([name, { total, type }]) => ({
//         name,
//         total,
//         type,
//       })
//     );

//     res.json({
//       categoriesSummary,
//       expenseSummary: expenses,
//       incomeSummary: income,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// якщо потрібна назва з id

// router.get("/transactions-summary", authMiddleware, async (req, res) => {
//   try {
//     const { month, year } = req.query;
//     const userId = req.user.userId;

//     if (!month || !year) {
//       return res.json({
//         categoriesSummary: [],
//         expenseSummary: 0,
//         incomeSummary: 0,
//       });
//     }

//     const paddedMonth = String(month).padStart(2, "0");
//     const startDate = new Date(`${year}-${paddedMonth}-01T00:00:00.000Z`);
//     const endDate = new Date(
//       new Date(startDate).setMonth(startDate.getMonth() + 1)
//     );

//     console.log("USER ID:", userId);
//     console.log("Start Date:", startDate);
//     console.log("End Date:", endDate);

//     const transactions = await Transaction.find({
//       owner: new mongoose.Types.ObjectId(userId),
//       transactionDate: {
//         $gte: startDate,
//         $lt: endDate,
//       },
//     });

//     console.log("Found transactions:", transactions.length);

//     const summary = {};
//     let income = 0;
//     let expenses = 0;

//     for (const tx of transactions) {
//       const categoryId = tx.categoryId;
//       const categoryType = tx.type;
//       const amount = tx.amount;

//       if (!summary[categoryId]) {
//         summary[categoryId] = { total: 0, type: categoryType };
//       }

//       summary[categoryId].total += amount;

//       if (categoryType === "INCOME") income += amount;
//       if (categoryType === "EXPENSE") expenses += amount;
//     }

//     // (Опціонально) Замість categoryId знайти назву
//     const categoryIds = Object.keys(summary);
//     const categories = await Category.find({
//       categoryId: { $in: categoryIds },
//     });

//     const categoriesSummary = Object.entries(summary).map(
//       ([categoryId, { total, type }]) => {
//         const categoryData = allCategories.find((cat) => cat.id === categoryId);

//         return {
//           id: categoryId,
//           name: categoryData?.name || "Unknown",
//           total,
//           type,
//           backgroundColor: categoryData?.backgroundColor || "#CCCCCC",
//         };
//       }
//     );

//     res.json({
//       categoriesSummary,
//       expenseSummary: expenses,
//       incomeSummary: income,
//     });
//   } catch (error) {
//     console.error("Error in /transactions-summary:", error);
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

    console.log("USER ID:", userId);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    const transactions = await Transaction.find({
      owner: new mongoose.Types.ObjectId(userId),
      transactionDate: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    console.log("Found transactions:", transactions.length);

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
    console.error("Error in /transactions-summary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
