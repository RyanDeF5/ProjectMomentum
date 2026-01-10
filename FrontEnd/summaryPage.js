import {stockData} from './tempData.js';

export class SummaryPage {
    constructor() {
        this.summaryPrice = document.getElementById("priceBox")
        this.summaryRVOL = document.getElementById("rvolBox")
        this.summaryPercentUp = document.getElementById("percentUpBox")
        this.summaryFloat = document.getElementById("floatBox")
        this.backgroundTicker = document.getElementById("backgroundTicker");
    }

    calculateSummary(){

    let RVOL = (stockData.volume / stockData.averageVolume).toFixed(1)
    let percentChange = (((stockData.currentPrice - stockData.lastClose) / stockData.lastClose) * 100).toFixed(1);

    let position = (percentChange > 0) ? "up" : "down" 

    this.summaryPrice.textContent = `Price: $${stockData.currentPrice}`; 
    this.summaryRVOL.textContent = `Rel Volume: ${RVOL}x above average`; 
    this.summaryPercentUp.textContent = `${stockData.symbol} is ${percentChange}% ${position} for the day`; 
    this.summaryFloat.textContent = `${stockData.float} Shares`; 
    this.backgroundTicker.textContent = `${stockData.symbol}`;
  }

}