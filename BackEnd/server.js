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

// Init some variables 
let livePrice;

app.post("/analyze", async (req, res) => {
  const { symbol, state } = req.body;
  if (!symbol) return res.status(400).json({ error: "Symbol required" });

  try {
    const quote = await yahooFinance.quote(symbol.toUpperCase());

    // Determine the "True" live price based on whether the market is open or in pre/post sessions
    if (state === "Pre-Market"){livePrice = quote.preMarketPrice}
    else if (state === "Market Open") {livePrice = quote.regularMarketPrice}
    else {livePrice = quote.regularMarketPrice}

    const summary = await yahooFinance.quoteSummary(symbol, { 
      modules: [ "defaultKeyStatistics" ] 
    });
    const float = summary.defaultKeyStatistics?.floatShares;

    res.json({
      symbol: symbol.toUpperCase(),
      fullName: quote.longName,
      currentPrice: livePrice, 
      lastClose: quote.regularMarketPreviousClose,
      currentVolume: quote.regularMarketVolume,
      averageVolume: quote.averageDailyVolume3Month,
      float: float
    });

    console.log(`${symbol.toUpperCase()} 
    fullName: ${quote.longName},
    currentPrice: ${livePrice}, 
    lastClose: ${quote.regularMarketPreviousClose},
    currentVolume: ${quote.regularMarketVolume},
    averageVolume: ${quote.averageDailyVolume3Month},
    float: ${float}`);

  } catch (err) {
    console.error("Yahoo Finance Error:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));