const express = require("express");
const router = express.Router();
import { v4 as uuidv4 } from "uuid";
const categories = [
  {
    id: uuidv4(),
    name: "Main expenses",
    type: "EXPENSE",
  },
  {
    id: uuidv4(),
    name: "Products",
    type: "EXPENSE",
  },
  {
    id: uuidv4(),
    name: "Car",
    type: "EXPENSE",
  },
  {
    id: uuidv4(),
    name: "Entertainment",
    type: "EXPENSE",
  },
  {
    id: uuidv4(),
    name: "Income",
    type: "INCOME",
  },
  {
    id: uuidv4(),
    name: "Other",
    type: "EXPENSE",
  },
];

router.get("/", (req, res) => {
  res.json(categories);
});

module.exports = router;
