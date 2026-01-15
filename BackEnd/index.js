require('dotenv').config();  
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");  

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;
if (!API_KEY) throw new Error("API_KEY not set");

// POST /analyze
app.post("/analyze", async (req, res) => {
  const { symbol } = req.body;

  if (!symbol || typeof symbol !== "string") {
    return res.status(400).json({ error: "Stock symbol is required" });
  }

  try {
    const quoteRes = await fetch(
      `https://api.stockdata.org/v1/data/quote?symbols=${symbol.toUpperCase()}&api_token=${API_KEY}`
    );
    const json = await quoteRes.json();

    if (!json.data || !json.data.length) {
      return res.status(404).json({ error: "Symbol not found" });
    }

    const quote = json.data[0];

    res.json({
      symbol: symbol.toUpperCase(),
      fullName: quote.name,
      currentPrice: quote.price,
      lastClose: quote.previous_close_price,
      currentVolume: quote.volume
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
