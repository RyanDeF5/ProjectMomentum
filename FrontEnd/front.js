document.getElementById("submitButton").addEventListener("click", () => {
  const stockData = {
    symbol: document.getElementById("symbol").value.trim().toUpperCase(),
    currentPrice: Number(document.getElementById("currentPrice").value),
    lastClose: Number(document.getElementById("lastPrice").value),
    volume: Number(document.getElementById("volume").value),
    averageVolume: Number(document.getElementById("averageVolume").value),
    float: Number(document.getElementById("float").value)
  };

  console.log("Sending to backend:", stockData);

  fetch("http://localhost:3000/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(stockData)
  })
  .then(response => response.json())
  .then(data => {
    console.log("Backend response:", data);
  })
  .catch(err => console.error("Error sending data:", err));
});
