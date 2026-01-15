  import {StartPage} from './startPage.js';
  import {SummaryPage} from './summaryPage.js';
  import {AnimationEngine} from './animationEngine.js';
  import {stockData, updateClock} from './tempData.js';
  import {fetchStockData} from './backendComunication.js'

  // Bind the submit button to the getAllFields method
  document.getElementById("superSubmitButton").addEventListener("click", superCalculate)
  document.getElementById("submitButton").addEventListener("click", calculate)
  document.getElementById("SwitchPage").addEventListener("click", () => {
    goToPage("summaryPage")})
  document.getElementById("backButton").addEventListener("click", () => {
    goToPage("startPage")})
  document.getElementById("fakeFillButton").addEventListener("click", fakeFill)
  // document.getElementById("TestAnimation1").addEventListener("click", playAnimationReval)
  // document.getElementById("TestAnimation2").addEventListener("click", playAnimationHide)

  // Instansiate Classes:
  let start_page = new StartPage();
  let summary_page  = new SummaryPage();
  let animation_engine = new AnimationEngine();

  fetchStockData("APPL");

  function calculate(){
    if (document.querySelector(".entryField").value === ""){
      return
    }
    summary_page.resetBars();
    start_page.getAllFields();
    start_page.clearAllFields(); 
    summary_page.calculateSummary();
    goToPage("summaryPage");
  }

  async function superCalculate() {
    let symbolEl = document.getElementById("superSymbol");
    if (!symbolEl) {
      alert("Symbol element not found on page!");
      return;
    }

    let symbol = symbolEl.textContent.trim();
    if (!symbol) {
      alert("Stock symbol is missing. Please enter a symbol.");
      return;
    }

    let data;
    try {
      data = await fetchStockData(symbol);
    } catch (err) {
      console.error("Failed to fetch stock data:", err);
      alert("Failed to fetch stock data. Please try again.");
      return;
    }

    stockData.symbol = symbol;
    stockData.averageVolume = document.getElementById("superAveVolume").textContent.trim();
    stockData.currentPrice = data.currentPrice;
    stockData.lastClose = data.lastClose;
    stockData.volume = data.currentVolume;
    stockData.float = "0"; 

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
        
    }, 650);
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