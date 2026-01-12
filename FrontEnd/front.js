  import {StartPage} from './startPage.js';
  import {SummaryPage} from './summaryPage.js';
  import {stockData, updateClock} from './tempData.js';

  // Bind the submit button to the getAllFields method
  document.getElementById("submitButton").addEventListener("click", submit)
  document.getElementById("SwitchPage").addEventListener("click", () => {
    goToPage("summaryPage")})
  document.getElementById("backButton").addEventListener("click", () => {
    goToPage("startPage")})
  document.getElementById("fakeFillButton").addEventListener("click", fakeFill)

  // Instansiate Classes:
  let start_page = new StartPage();
  let summary_page  = new SummaryPage();

  function submit(){
    if (document.querySelector(".entryField").value === "")
      return
    start_page.getAllFields();
    start_page.clearAllFields(); 
    summary_page.calculateSummary();
    goToPage("summaryPage");
  }

  setInterval(update, 100);

  function update(){
    // Check if the numerical fields contain value indicators e.g. M (million), K (thousand), ect.
    start_page.update(); 
    updateClock(); 
  }

  function goToPage(targetPageId) {
    document.querySelector('.page.active').classList.remove('active');
    document.getElementById(targetPageId).classList.add('active');
}
  
  function activateButton(buttonID){
    document.getElementById(buttonID).classList.remove('typeDisabled');
    document.getElementById(buttonID).classList.add('typeBuy');
  }

  function fakeFill(){
    document.getElementById("symbol").value = "TEST"
    document.getElementById("currentPrice").value = `${getRandomInt(1, 30)}`
    document.getElementById("lastPrice").value = `${getRandomInt(1, 30)}`
    document.getElementById("volume").value = `${getRandomInt(5000000, 20000000)}`
    document.getElementById("averageVolume").value = `${getRandomInt(1000000, 10000000)}`
    document.getElementById("floatShare").value = `${getRandomInt(2000000, 20000000)}`
  }

  function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
  }