const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
// const categories = [
//   {
//     id: uuidv4(),
//     name: "Main expenses",
//     type: "EXPENSE",
//   },
//   {
//     id: uuidv4(),
//     name: "Products",
//     type: "EXPENSE",
//   },
//   {
//     id: uuidv4(),
//     name: "Car",
//     type: "EXPENSE",
//   },
//   {
//     id: uuidv4(),
//     name: "Entertainment",
//     type: "EXPENSE",
//   },
//   {
//     id: uuidv4(),
//     name: "Income",
//     type: "INCOME",
//   },
//   {
//     id: uuidv4(),
//     name: "Other",
//     type: "EXPENSE",
//   },
// ];
const categories = [
  {
    id: uuidv4(),
    name: "Main expenses 💸",
    type: "EXPENSE",
    backgroundColor: "#FED057",
  },
  {
    id: uuidv4(),
    name: "Products 🛒",
    type: "EXPENSE",
    backgroundColor: "#FFD8D0",
  },
  {
    id: uuidv4(),
    name: "Car 🚗",
    type: "EXPENSE",
    backgroundColor: "#FD9498",
  },
  {
    id: uuidv4(),
    name: "Self care 🧴",
    type: "EXPENSE",
    backgroundColor: "#C5BAFF",
  },
  {
    id: uuidv4(),
    name: "Child care 👶",
    type: "EXPENSE",
    backgroundColor: "#6E78E8",
  },
  {
    id: uuidv4(),
    name: "Household products 🧼",
    type: "EXPENSE",
    backgroundColor: "#4A56E2",
  },
  {
    id: uuidv4(),
    name: "Education 🎓",
    type: "EXPENSE",
    backgroundColor: "#81E1FF",
  },
  {
    id: uuidv4(),
    name: "Leisure 🎮",
    type: "EXPENSE",
    backgroundColor: "#24CCA7",
  },
  {
    id: uuidv4(),
    name: "Other expenses 🧾",
    type: "EXPENSE",
    backgroundColor: "#00AD84",
  },
  {
    id: uuidv4(),
    name: "Entertainment 🎬",
    type: "EXPENSE",
    backgroundColor: "#FFD8D0",
  },
  {
    id: uuidv4(),
    name: "Travel ✈️",
    type: "EXPENSE",
    backgroundColor: "#FD9498",
  },
  {
    id: uuidv4(),
    name: "Salary 💼",
    type: "INCOME",
    backgroundColor: "#24CCA7",
  },
  {
    id: uuidv4(),
    name: "Additional income 💰",
    type: "INCOME",
    backgroundColor: "#81E1FF",
  },
];

router.get("/", (req, res) => {
  res.json(categories);
});

module.exports = router;
