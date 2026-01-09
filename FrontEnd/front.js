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
  let backgroundTicker = document.getElementById("backgroundTicker");


  function submit(){
    if (document.querySelector(".entryField").value === "")
      return
    getAllFields();
    sendToBackend(stockData); 
    clearAllFields(); 
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
    backgroundTicker.textContent = `${stockData.symbol}`;
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

  setInterval(update, 100);

  function update(){
    // Check if the numerical fields contain value indicators e.g. M (million), K (thousand), ect.
    const fields = document.querySelectorAll('.entryFieldNumber');
    fields.forEach((field, index) => {
      if (field.value.toLowerCase().includes("k")){
        field.value = field.value.replaceAll("k", ""); 
        autoAdjust(field, 1000);
        flashIndicateField(field);
      }
      else if (field.value.toLowerCase().includes("m")){
        field.value = field.value.replaceAll("m", ""); 
        autoAdjust(field, 1000000);
        flashIndicateField(field);
      }
      else if (field.value.toLowerCase().includes("b")) {
        field.value = field.value.replaceAll("b", ""); 
        autoAdjust(field, 1000000000);
        flashIndicateField(field);
      }
    })
    // If so then auto adjust the field to the actual value fully written out e.g. 2.5M --> 2,500,000

    function autoAdjust(field, number){
      // Initiate factor and length to 0
      let factor = 0; 
      let length = 0; 
      // If the field passed in includes a dot, then check how many numbers are behind the dot 
      if (field.value.includes(".")) {
        const splitNumber = field.value.split(".");
        length = splitNumber[1].length; // Store that number here
      }
      console.log(`The length behind the dot: ${length}`);
      // Check if the length is 1 or 2
      switch (length) {
        case 1: // if the length is 1 then divide by a factor of 10 once 
          factor = (number / 10)
          break
        case 2:
          factor = ((number / 10) / 10) // if the length is 2 then divide by a factor of 10 twice
          break
        default:
          factor = number
          break
      }
      // Remove the period from the string before math 
      field.value = field.value.replaceAll(".", ""); 
      // Adjust the number with the factor calculated ealier 
      const changedNumber = Number(field.value) * factor;
      // Set it back to a string and format the commas 
      field.value = changedNumber.toLocaleString();
      // Idicate to the user that the field was changed
    }

    function flashIndicateField(field){
      field.style.color = "#02a02cff"; 
      setTimeout(()=>{
        field.style.transition = "color 0.5s ease-out"
        field.style.color = "black"; 
      }, 500)
    }
  }
