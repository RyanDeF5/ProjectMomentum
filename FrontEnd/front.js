  import {StartPage} from './startPage.js';
  import {SummaryPage} from './summaryPage.js';
  import {stockData, updateClock} from './tempData.js';

  // Bind the submit button to the getAllFields method
  document.getElementById("submitButton").addEventListener("click", submit)
  document.getElementById("SwitchPage").addEventListener("click", () => {
    goToPage("summaryPage")})
  document.getElementById("backButton").addEventListener("click", () => {
    goToPage("startPage")})

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
    // 1. Remove 'active' from the current page
    document.querySelector('.page.active').classList.remove('active');
    
    // 2. Add 'active' to the new page
    document.getElementById(targetPageId).classList.add('active');
}
  
  function activateButton(buttonID){
    document.getElementById(buttonID).classList.remove('typeDisabled');
    document.getElementById(buttonID).classList.add('typeBuy');
  }
