// server.js
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());           // Allow frontend to talk to backend
app.use(express.json());   // Parse JSON body

// Endpoint to receive stock data
app.post("/analyze", (req, res) => {
  console.log("Received stock data:", req.body); // <-- prints in your CLI
  res.json({ status: "success", received: req.body });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
