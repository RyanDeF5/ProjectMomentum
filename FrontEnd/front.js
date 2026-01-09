  // Establish stock data package 
  const stockData = {
    symbol: null,
    currentPrice: 0,
    lastClose: 0,
    volume: 0,
    averageVolume: 0,
    float: 0
  }

  // Bind the submit button to the getAllFields method
  document.getElementById("submitButton").addEventListener("click", submit)

  // Instansiate all the HTML fields 
  let symbolField = document.getElementById("symbol")
  let currentPriceField = document.getElementById("currentPrice")
  let lastPriceField = document.getElementById("lastPrice")
  let volumeField = document.getElementById("volume")
  let averageVolumeField = document.getElementById("averageVolume")
  let floatField = document.getElementById("float")

  let summaryPrice = document.getElementById("priceBox")
  let summaryRVOL = document.getElementById("rvolBox")
  let summaryPercentUp = document.getElementById("percentUpBox")
  let summaryFloat = document.getElementById("floatBox")


  function submit(){
    if (document.querySelector(".entryField").value === "")
      return
    getAllFields();
    sendToBackend(stockData); 
    // clearAllFields(); 
    calculateSummary();
  }

  // Gets all fields off of the website and stores them within the stock data object 
  function getAllFields(){
    stockData.symbol = symbolField.value.trim().toUpperCase(); 
    stockData.currentPrice = Number(currentPriceField.value);
    stockData.lastClose = Number(lastPriceField.value);
    stockData.volume = Number(volumeField.value.replace(/,/g, ""));
    stockData.averageVolume = Number(averageVolumeField.value.replace(/,/g, "")); 
    stockData.float =  String(floatField.value);
  }

  function clearAllFields(){
    symbolField.value = "";
    currentPriceField.value = "";
    lastPriceField.value = "";
    volumeField.value = "";
    averageVolumeField.value = "";
    floatField.value = "";
  }

  function calculateSummary(){

    let RVOL = (stockData.volume / stockData.averageVolume).toFixed(1)
    let percentChange = (((stockData.currentPrice - stockData.lastClose) / stockData.lastClose) * 100).toFixed(1);

    let position = (percentChange > 0) ? "up" : "down" 

    summaryPrice.textContent = `Price: $${stockData.currentPrice}`; 
    summaryRVOL.textContent = `The relative volume is ${RVOL}x above average`; 
    summaryPercentUp.textContent = `${stockData.symbol} is ${percentChange}% ${position} for the day`; 
    summaryFloat.textContent = `${stockData.float} Shares`; 
  }

  function sendToBackend(data){
    console.log("Sending to backend:", data);

    fetch("http://localhost:3000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log("Backend response:", data);
    })
    .catch(err => console.error("Error sending data:", err));
  }
