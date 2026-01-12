import {stockData} from './tempData.js';

export class SummaryPage {
    constructor() {
        this.RVOL;
        this.percentChange;
        this.formatter = Intl.NumberFormat('en', { notation: 'compact' });

        this.summaryPriceBox = document.getElementById("percentUpBox")
        this.summaryPrice = document.getElementById("price")
        this.summaryRVOL = document.getElementById("rvol")
        this.summaryPercentUp = document.getElementById("percentUp")
        this.summaryFloat = document.getElementById("float")
        this.backgroundTicker = document.getElementById("backgroundTicker");

        this.percentBar = document.getElementById("percetProgressBar");
        this.rvolBar = document.getElementById("rvolProgressBar");
        this.priceBar = document.getElementById("priceProgressBar");
        this.floatBar = document.getElementById("floatProgressBar");
    }

    calculateSummary(){
    this.resetBars();

    this.RVOL = (stockData.volume / stockData.averageVolume).toFixed(1)
    this.percentChange = (((stockData.currentPrice - stockData.lastClose) / stockData.lastClose) * 100).toFixed(1);

    let position = (this.percentChange > 0) ? "% UP TODAY" : "% DOWN TODAY" 

    this.summaryPrice.textContent = `$${stockData.currentPrice}`; 
    this.summaryRVOL.textContent = `${this.RVOL}X`; 
    this.summaryPercentUp.textContent = `${this.percentChange}%`; 
    this.summaryFloat.textContent = `${this.formatter.format(stockData.float)}`; 
    this.backgroundTicker.textContent = `${stockData.symbol}`;
    this.summaryPriceBox.textContent = position

    this.setBars(); 
  }

  resetBars(){
    this.percentBar.style.width = "0%";
    this.rvolBar.style.width = "0%";
    this.priceBar.style.width = "0%";
    this.floatBar.style.width = "0%";
  }

  setBars(){
    let nomralizedPercent = Math.round((((this.percentChange - 0) / (100 - 0)) * 100), 0)
    let nomralizedRVOL = Math.round((((this.RVOL - 0) / (8 - 0)) * 100), 0)
    let nomralizedPrice = Math.round((((stockData.currentPrice - 0) / (30 - 0)) * 100), 0)
    let nomralizedFloat = Math.round((((stockData.float - 0) / (20000000 - 0)) * 100), 0)
    
    this.percentBar.style.width = `${nomralizedPercent}%`;
    this.rvolBar.style.width = `${nomralizedRVOL}%`;
    this.priceBar.style.width = `${nomralizedPrice}%`;
    this.floatBar.style.width = `${nomralizedFloat}%`;
  }

}