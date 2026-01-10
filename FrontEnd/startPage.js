import {stockData} from './tempData.js';

export class StartPage {
    constructor() {
        // Instansiate all the HTML fields 
        this.symbolField = document.getElementById("symbol")
        this.currentPriceField = document.getElementById("currentPrice")
        this.lastPriceField = document.getElementById("lastPrice")
        this.volumeField = document.getElementById("volume")
        this.averageVolumeField = document.getElementById("averageVolume")
        this.floatField = document.getElementById("float")
    }

    // Gets all fields off of the website and stores them within the stock data object 
  getAllFields(){
    stockData.symbol = this.symbolField.value.trim().toUpperCase(); 
    stockData.currentPrice = Number(this.currentPriceField.value);
    stockData.lastClose = Number(this.lastPriceField.value);
    stockData.volume = Number(this.volumeField.value.replace(/,/g, ""));
    stockData.averageVolume = Number(this.averageVolumeField.value.replace(/,/g, "")); 
    stockData.float =  String(this.floatField.value);
  }

  clearAllFields(){
    this.symbolField.value = "";
    this.currentPriceField.value = "";
    this.lastPriceField.value = "";
    this.volumeField.value = "";
    this.averageVolumeField.value = "";
    this.floatField.value = "";
  }

  update(){
    // Check if the numerical fields contain value indicators e.g. M (million), K (thousand), ect.
    const fields = document.querySelectorAll('.entryFieldNumber');
    fields.forEach((field, index) => {
      if (field.value.toLowerCase().includes("k")){
        field.value = field.value.replaceAll("k", ""); 
        this.autoAdjust(field, 1000);
        this.flashIndicateField(field);
      }
      else if (field.value.toLowerCase().includes("m")){
        field.value = field.value.replaceAll("m", ""); 
        this.autoAdjust(field, 1000000);
        this.flashIndicateField(field);
      }
      else if (field.value.toLowerCase().includes("b")) {
        field.value = field.value.replaceAll("b", ""); 
        this.autoAdjust(field, 1000000000);
        this.flashIndicateField(field);
      }
    })
  }

  // If so then auto adjust the field to the actual value fully written out e.g. 2.5M --> 2,500,000
    autoAdjust(field, number){
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

    flashIndicateField(field){
      field.style.backgroundColor = "#a2ffa3ff"; 
      setTimeout(()=>{
        field.style.transition = "background-color 0.5s ease-out"
        field.style.backgroundColor = "white"; 
      }, 200)

      setTimeout(()=>{
        field.style.transition = "background-color 0.0s ease-out"
      }, 750)
    }

}
