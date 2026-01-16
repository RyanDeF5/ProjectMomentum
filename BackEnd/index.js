require('dotenv').config();  
const express = require("express");
const cors = require("cors");

// 1. Import the Class
const YahooFinance = require('yahoo-finance2').default;
// 2. Create the instance (This fixes your error!)
const yahooFinance = new YahooFinance();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { symbol } = req.body;
  if (!symbol) return res.status(400).json({ error: "Symbol required" });

  try {
    // Now this call will work because 'yahooFinance' is initialized!
    const quote = await yahooFinance.quote(symbol.toUpperCase());

    res.json({
      symbol: symbol.toUpperCase(),
      fullName: quote.longName || quote.shortName,
      currentPrice: quote.regularMarketPrice,
      lastClose: quote.regularMarketPreviousClose,
      currentVolume: quote.regularMarketVolume,
      averageVolume: quote.averageDailyVolume3Month
    });
  } catch (err) {
    console.error("Yahoo Finance Error:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));