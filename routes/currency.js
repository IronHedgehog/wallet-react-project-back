const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11"
    );
    res.json(response.data);
  } catch (err) {
    console.error("Currency fetch error:", err.message);
    res.status(500).json({
      message: "Currency fetch failed",
      error: err.message,
    });
  }
});

module.exports = router;
