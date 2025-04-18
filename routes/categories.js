const express = require("express");
const router = express.Router();

const categories = [
  { name: "Main expenses", type: "EXPENSE" },
  { name: "Products", type: "EXPENSE" },
  { name: "Car", type: "EXPENSE" },
  { name: "Entertainment", type: "EXPENSE" },
  { name: "Income", type: "INCOME" },
  { name: "Other", type: "EXPENSE" },
];

router.get("/", (req, res) => {
  res.json(categories);
});

module.exports = router;
