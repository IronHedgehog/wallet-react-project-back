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

  // 3. Перераховуємо balanceAfter для кожної транзакції
  let currentBalance = 0;

  for (const tx of allTransactions) {
    const value = tx.type === "EXPENSE" ? -tx.amount : tx.amount;
    currentBalance += value;
    tx.balanceAfter = currentBalance;
  }

  // 4. Зберігаємо нову транзакцію (вже з обрахованим балансом)
  const savedTransaction = await Transaction.create(newTransaction);

  // 5. Оновлюємо баланс юзера на основі останньої транзакції
  const latestBalance = allTransactions.at(-1).balanceAfter;
  await User.findByIdAndUpdate(owner, { balance: latestBalance });

  res.status(201).json(savedTransaction);
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
