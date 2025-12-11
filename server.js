const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const transactionRoutes = require("./routes/transactions");
const transactionsSummaryRoutes = require("./routes/transactionsSummary");
const categoriesRoutes = require("./routes/categories");
const currencyRoutes = require("./routes/currency");


// apsdpasdapsdk
dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["https://wallet-site.netlify.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use((err, req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api", transactionsSummaryRoutes);
app.use("/api/transaction-categories", categoriesRoutes);
app.use("/api/currency", currencyRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log(err));
