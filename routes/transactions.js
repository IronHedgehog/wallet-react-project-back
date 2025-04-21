const express = require("express");
const router = express.Router();

const Transaction = require("../models/Transaction");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET /api/transactions
router.get("/", authMiddleware, async (req, res) => {
  const transactions = await Transaction.find({ owner: req.user.userId });
  res.json(transactions);
});

router.post("/", authMiddleware, async (req, res) => {
  const { type, categoryId, comment, amount, transactionDate } = req.body;
  const owner = req.user.userId;

  // 1. Створюємо нову транзакцію (але ще не зберігаємо)
  const newTransaction = new Transaction({
    type,
    categoryId,
    comment,
    amount,
    transactionDate,
    owner,
  });

  // 2. Отримуємо всі транзакції + нову, сортуємо за датою
  const existingTransactions = await Transaction.find({ owner });

  const allTransactions = [...existingTransactions, newTransaction].sort(
    (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate)
  );

  // 3. Перерахунок балансів
  let currentBalance = 0;

  for (const tx of allTransactions) {
    const value =
      tx.type === "EXPENSE" ? -Math.abs(tx.amount) : Math.abs(tx.amount);
    currentBalance += value;
    tx.balanceAfter = currentBalance;
  }

  // 4. Зберігаємо всі оновлені транзакції (включно з новою)
  await Promise.all(allTransactions.map((tx) => tx.save())); // <-- save() замість create()

  // 5. Оновлення балансу юзера
  const latestBalance = allTransactions.at(-1).balanceAfter;
  await User.findByIdAndUpdate(owner, { balance: latestBalance });

  res.status(201).json(newTransaction);
});

// router.get("/summary", authMiddleware, async (req, res) => {
//   const { month, year } = req.query;

//   const all = await Transaction.find({ owner: req.user.userId });

//   const summary = all.filter((t) => {
//     const [day, mon, yr] = t.date.split(".");
//     return mon === month && yr === year;
//   });

//   res.json(summary);
// });
router.get("/transactions-summary", authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;
    const owner = req.user.userId;

    const transactions = await Transaction.find({ owner }).populate(
      "categoryId"
    );

    const filtered = transactions.filter((t) => {
      const date = new Date(t.transactionDate);
      return (
        (!month || date.getMonth() + 1 === Number(month)) &&
        (!year || date.getFullYear() === Number(year))
      );
    });

    let expenseSummary = 0;
    let incomeSummary = 0;
    const expenseByCategory = {};

    filtered.forEach((t) => {
      if (t.type === "EXPENSE") {
        expenseSummary += t.amount;

        const categoryName = t.categoryId?.name || "Uncategorized";
        if (!expenseByCategory[categoryName]) {
          expenseByCategory[categoryName] = 0;
        }
        expenseByCategory[categoryName] += t.amount;
      } else if (t.type === "INCOME") {
        incomeSummary += t.amount;
      }
    });

    const newExpenseSummary = Object.entries(expenseByCategory).map(
      ([name, total]) => ({ name, total })
    );

    res.json({
      incomeSummary,
      expenseSummary,
      newExpenseSummary,
    });
  } catch (error) {
    console.error("Summary error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
