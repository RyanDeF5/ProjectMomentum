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
  model: "gemini-2.5-flash-lite", // gemini-3-flash-preview, gemini-2.5-flash, gemini-2.5-flash-lite
  generationConfig: { responseMimeType: "application/json" }
});

// Is AI online? TEST 
// (async () => {
//     try {
//         const result = await model.generateContent("Say 'System Online'");
//         console.log("AI Check:", result.response.text());
//     } catch (e) { console.error("AI Init Failed:", e.message); }
// })();

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
      
      Assign a 'Breakout Score' from 0 to 2000.
      - 2000: Perfect setup (Low float, high relative volume, significant price gap).
      - 0: High risk, no volume, or "bag holder" setup.

      if stock ticker is STCK treat it like a test stock
      
      Return ONLY a JSON object with these keys:
      {
        "score": number,
        "rating": "Strong Buy" | "Watch" | "Avoid",
        "insight": If there is any recent news that could be driving the stock higher please list them otherwise list a few 
        sentences explaining why (add in-text newlines when appropriate)"
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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.post("/generateExample", async (req, res) => {
  const { stockData } = req.body;
  
  if (!stockData) {
    return res.status(400).json({ error: "Stock Data Required" });
  }

  try {
    await sleep(5000);

    res.json({
      score: 0,
      rating: "Example Generation",
      insight:"The unanimous Declaration of the thirteen united States of America, When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature’s God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness. — That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed, — That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it, and to institute new Government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their Safety and Happiness. Prudence, indeed, will dictate that Governments long established should not be changed for light and transient causes; and accordingly all experience hath shewn, that mankind are more disposed to suffer, while evils are sufferable, than to right themselves by abolishing the forms to which they are accustomed. But when a long train of abuses and usurpations, pursuing invariably the same Object evinces a design to reduce them under absolute Despotism, it is their right, it is their duty, to throw off such Government, and to provide new Guards for their future security. — Such has been the patient sufferance of these Colonies; and such is now the necessity which constrains them to alter their former Systems of Government. The history of the present King of Great Britain is a history of repeated injuries and usurpations, all having in direct object the establishment of an absolute Tyranny over these States. To prove this, let Facts be submitted to a candid world.He has refused his Assent to Laws, the most wholesome and necessary for the public good.He has forbidden his Governors to pass Laws of immediate and pressing importance, unless suspended in their operation till his Assent should be obtained; and when so suspended, he has utterly neglected to attend to them.He has refused to pass other Laws for the accommodation of large districts of people, unless those people would relinquish the right of Representation in the Legislature, a right inestimable to them and formidable to tyrants only. He has called together legislative bodies at places unusual, uncomfortable, and distant from the depository of their public Records, for the sole purpose of fatiguing them into compliance with his measures.He has dissolved Representative Houses repeatedly, for opposing with manly firmness his invasions on the rights of the people. He has refused for a long time, after such dissolutions, to cause others to be elected; whereby the Legislative powers, incapable of Annihilation, have returned to the People at large for their exercise; the State remaining in the mean time exposed to all the dangers of invasion from without, and convulsions within.He has endeavoured to prevent the population of these States; for that purpose obstructing the Laws for Naturalization of Foreigners; refusing to pass others to encourage their migrations hither, and raising the conditions of new Appropriations of Lands.He has obstructed the Administration of Justice, by refusing his Assent to Laws for establishing Judiciary powers.He has made Judges dependent on his Will alone, for the tenure of their offices, and the amount and payment of their salaries.He has erected a multitude of New Offices, and sent hither swarms of Officers to harrass our people, and eat out their substance.He has kept among us, in times of peace, Standing Armies without the Consent of our legislatures.He has affected to render the Military independent of and superior to the Civil power.He has combined with others to subject us to a jurisdiction foreign to our constitution, and unacknowledged by our laws; giving his Assent to their Acts of pretended Legislation:For Quartering large bodies of armed troops among us:For protecting them, by a mock Trial, from punishment for any Murders which they should commit on the Inhabitants of these States:For cutting off our Trade with all parts of the world:For imposing Taxes on us without our Consent:For depriving us in many cases, of the benefits of Trial by Jury:For transporting us beyond Seas to be tried for pretended offences:For abolishing the free System of English Laws in a neighbouring Province, establishing therein an Arbitrary government, and enlarging its Boundaries so as to render it at once an example and fit instrument for introducing the same absolute rule into these Colonies: For taking away our Charters, abolishing our most valuable Laws, and altering fundamentally the Forms of our Governments: For suspending our own Legislatures, and declaring themselves invested with power to legislate for us in all cases whatsoever. He has abdicated Government here, by declaring us out of his Protection and waging War against us. He has plundered our seas, ravaged our Coasts, burnt our towns, and destroyed the lives of our people. He is at this time transporting large Armies of foreign Mercenaries to compleat the works of death, desolation and tyranny, already begun with circumstances of Cruelty & perfidy scarcely paralleled in the most barbarous ages, and totally unworthy the Head of a civilized nation. He has constrained our fellow Citizens taken Captive on the high Seas to bear Arms against their Country, to become the executioners of their friends and Brethren, or to fall themselves by their Hands. He has excited domestic insurrections amongst us, and has endeavoured to bring on the inhabitants of our frontiers, the merciless Indian Savages, whose known rule of warfare, is an undistinguished destruction of all ages, sexes and conditions. In every stage of these Oppressions We have Petitioned for Redress in the most humble terms: Our repeated Petitions have been answered only by repeated injury. A Prince whose character is thus marked by every act which may define a Tyrant, is unfit to be the ruler of a free people. Nor have We been wanting in attentions to our British brethren. We have warned them from time to time of attempts by their legislature to extend an unwarrantable jurisdiction over us. We have reminded them of the circumstances of our emigration and settlement here. We have appealed to their native justice and magnanimity, and we have conjured them by the ties of our common kindred to disavow these usurpations, which, would inevitably interrupt our connections and correspondence. They too have been deaf to the voice of justice and of consanguinity. We must, therefore, acquiesce in the necessity, which denounces our Separation, and hold them, as we hold the rest of mankind, Enemies in War, in Peace Friends. We, therefore, the Representatives of the united States of America, in General Congress, Assembled, appealing to the Supreme Judge of the world for the rectitude of our intentions, do, in the Name, and by Authority of the good People of these Colonies, solemnly publish and declare, That these United Colonies are, and of Right ought to be Free and Independent States; that they are Absolved from all Allegiance to the British Crown, and that all political connection between them and the State of Great Britain, is and ought to be totally dissolved; and that as Free and Independent States, they have full Power to levy War, conclude Peace, contract Alliances, establish Commerce, and to do all other Acts and Things which Independent States may of right do. And for the support of this Declaration, with a firm reliance on the protection of divine Providence, we mutually pledge to each other our Lives, our Fortunes and our sacred Honor."
    });

  } catch (err) {
    console.error("Simulation Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate example" });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

