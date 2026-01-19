require('dotenv').config();  
const express = require("express");
const cors = require("cors");

// YahooFinance Instances
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();


// Google Gemini Instances 
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", // Reverting to the "Long-Term Support" version
  generationConfig: { responseMimeType: "application/json" }
});

// Is AI online? TEST 
(async () => {
    try {
        const result = await model.generateContent("Say 'System Online'");
        console.log("AI Check:", result.response.text());
    } catch (e) { console.error("AI Init Failed:", e.message); }
})();

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

app.post("/generate", async (req, res) => {
  const { stockData } = req.body;
  
  if (!stockData) return res.status(400).json({ error: "Stock Data Required" });

  try {

    const prompt = `
      Act as an expert Day Trading Quantitative Analyst. 
      Analyze the following stock data: ${JSON.stringify(stockData)}.
      
      Assign a 'Breakout Score' from 0 to 1200.
      - 1200: Perfect setup (Low float, high relative volume, significant price gap).
      - 0: High risk, no volume, or "bag holder" setup.

      NOTE: If the stock symbol is STCK that means it is a test stock, this means you should treat it like a 
      test stock. Use phrases like "This would be a high moving stock" when refering to a test stock in the insight 
      section 
      
      Return ONLY a JSON object with these keys:
      {
        "score": number,
        "rating": "Strong Buy" | "Watch" | "Avoid",
        "insight": "In a few sentences explain why the stock is moving or not moving, highlight any recent news 
        that could be affecting the stocks current state"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text()
    console.log(text);

    res.json(JSON.parse(text));

  } catch (err) {
    console.error("Google Gemini Error:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));