  import {StartPage} from './startPage.js';
  import {SummaryPage} from './summaryPage.js';
  import {AnimationEngine} from './animationEngine.js';
  import {marketData, stockData, updateClock} from './tempData.js';
  import {fetchStockData} from './backendComunication.js'

  // Bind the submit button to the getAllFields method
  document.getElementById("superSubmitButton").addEventListener("click", superCalculate)
  document.getElementById("submitButton").addEventListener("click", calculate)
  document.getElementById("SwitchPage").addEventListener("click", () => {
    goToPage("summaryPage")})
  document.getElementById("backButton").addEventListener("click", () => {
    goToPage("startPage")
  setTimeout (() => {start_page.enableBuyTypeButtons();}, 1000)
})
  document.getElementById("fakeFillButton").addEventListener("click", fakeFill)

  // Instansiate Classes:
  let start_page = new StartPage();
  let summary_page  = new SummaryPage();
  let animation_engine = new AnimationEngine();

  // document.getElementById("rating").textContent = " TEST "; 

  goToPageNoAnimation("summaryPage");

  function calculate(){
    if (document.querySelector(".entryField").value === ""){
      return
    }
    stockData.fullName = "Not Identified";
    summary_page.resetBars();
    start_page.getAllFields();
    start_page.clearAllFields(); 
    summary_page.calculateSummary();
    goToPage("summaryPage");
  }

  async function superCalculate() {

    let symbol = document.getElementById("superSymbol").value.trim();
    let volumeFromField = document.getElementById("superAverageVolume");
    volumeFromField = Number(volumeFromField.value.replaceAll(",", "")); 

    if (symbol === "") {
      alert("Please enter a Stock Ticker/Symbol");
      return;
    } 

    start_page.disableBuyTypeButtons();
    let data;
    try {
      data = await fetchStockData(symbol);
    } catch (err) {
      console.error("Failed to fetch stock data:", err);
      alert("Failed to fetch stock data. Please try again.");
      return;
    }

    console.log(data); 
    stockData.symbol = symbol;
    stockData.averageVolume = data.averageVolume;
    stockData.currentPrice = data.currentPrice;
    stockData.lastClose = data.lastClose;
    stockData.volume = (marketData.marketState === "PRE-MARKET") ? volumeFromField : data.currentVolume;
    stockData.float = data.float; 
    stockData.fullName = data.fullName;

    summary_page.resetBars();
    start_page.clearAllFields(); 
    summary_page.calculateSummary();
    goToPage("summaryPage");
  }


  setInterval(update, 100);

  function update(){
    start_page.update(); 
    updateClock(); 
  }

  function goToPage(targetPageId) {
    const currentPage = document.querySelector('.page.active');
    const targetPage = document.getElementById(targetPageId);

    animation_engine.HidePage(currentPage);

    setTimeout(() => {
        currentPage.classList.remove('active');
        targetPage.classList.add('active');

        animation_engine.RevealPage(targetPage);
    }, 575);
  } 

  function goToPageNoAnimation(targetPageId) {
    const currentPage = document.querySelector('.page.active');
    const targetPage = document.getElementById(targetPageId);

    setTimeout(() => {
        currentPage.classList.remove('active');
        targetPage.classList.add('active');
    }, 0);
  } 
  
  function activateButton(buttonID){
    document.getElementById(buttonID).classList.remove('typeDisabled');
    document.getElementById(buttonID).classList.add('typeBuy');
  }

  function fakeFill(){
    document.getElementById("symbol").value = "TEST"
    document.getElementById("currentPrice").value = `${getRandomInt(30, 35)}`
    document.getElementById("lastPrice").value = `${getRandomInt(25, 30)}`
    document.getElementById("volume").value = `${getRandomInt(5000000, 20000000)}`
    document.getElementById("averageVolume").value = `${getRandomInt(1000000, 10000000)}`
    document.getElementById("floatShare").value = `${getRandomInt(2000000, 20000000)}`
  }

  function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function playAnimationReval(pageID){
    animation_engine.HidePage(pageID);
  }
  function playAnimationHide(pageID){
    animation_engine.RevealPage(pageID);
  }