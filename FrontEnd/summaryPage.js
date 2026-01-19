import {stockData} from './tempData.js';
import {geminiAI} from './integratedAI.js';

export class SummaryPage {
    constructor() {
        this.RVOL;
        this.percentChange;
        this.formatter = Intl.NumberFormat('en', { notation: 'compact' });

        this.summaryPriceBox = document.getElementById("percentUpBox")
        this.summaryPrice = document.getElementById("price")
        this.summaryRVOL = document.getElementById("rvol")
        this.summaryPercentUp = document.getElementById("percentUp")
        this.summaryCurrentVolume = document.getElementById("currentVolume")
        this.summaryCurrentFloat = document.getElementById("currentFloat")
        this.backgroundTicker = document.getElementById("backgroundTicker");
        this.longName = document.getElementById("longName");

        this.percentBar = document.getElementById("percetProgressBar");
        this.rvolBar = document.getElementById("rvolProgressBar");
        this.priceBar = document.getElementById("priceProgressBar");
        this.currentVolumeBar = document.getElementById("curVolumeProgressBar");
        this.floatBar = document.getElementById("curFloatBar");

        // Init AI 
        this.gemini = new geminiAI(); 
    }

    calculateSummary(){

    this.RVOL = (stockData.volume / stockData.averageVolume).toFixed(1)
    this.percentChange = (((stockData.currentPrice - stockData.lastClose) / stockData.lastClose) * 100).toFixed(1);

    let position = (this.percentChange > 0) ? "% UP TODAY" : "% DOWN TODAY" 

    this.summaryPrice.textContent = `$${stockData.currentPrice.toFixed(2)}`; 
    this.summaryRVOL.textContent = `${this.RVOL}X`; 
    this.summaryPercentUp.textContent = `${this.percentChange}%`; 
    this.summaryCurrentVolume.textContent = `${this.formatter.format(stockData.volume)}`; 
    this.summaryCurrentFloat.textContent = `${this.formatter.format(stockData.float)}`
    this.backgroundTicker.textContent = `${stockData.symbol}`;
    this.summaryPriceBox.textContent = position;
    this.longName.textContent = stockData.fullName;
    
    this.setBars();
    
    this.gemini.start(); 
  }

  setBars(){
    this.resetBars();
    let nomralizedPercent = Math.round((((this.percentChange - 0) / (100 - 0)) * 100))
    let nomralizedRVOL = Math.round((((this.RVOL - 0) / (8 - 0)) * 100))
    let nomralizedPrice = Math.round((((stockData.currentPrice - 0) / (30 - 0)) * 100))
    let nomralizedVol = Math.round((((stockData.volume - 0) / (20000000 - 0)) * 100))
    let nomralizedFloat = Math.round((((stockData.float - 0) / (20000000 - 0)) * 100))
    
    setTimeout(() => {
      this.percentBar.style.width = `${nomralizedPercent}%`;
      this.rvolBar.style.width = `${nomralizedRVOL}%`;
      this.priceBar.style.width = `${nomralizedPrice}%`;
      this.currentVolumeBar.style.width = `${nomralizedVol}%`;
      this.floatBar.style.width = `${nomralizedFloat}%`;
    }, 500)
    
  }

  resetBars(){
    const bars = document.querySelectorAll(".progressBar");
    Array.from(bars).forEach(bar => {
    bar.classList.add("no-transition");
    bar.style.width = "0%";
    bar.offsetHeight;
    bar.classList.remove("no-transition");
    });
  }
  
}