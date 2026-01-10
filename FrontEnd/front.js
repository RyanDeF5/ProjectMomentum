  import {StartPage} from './startPage.js';
  import {SummaryPage} from './summaryPage.js';
  import {stockData} from './tempData.js';

  // Bind the submit button to the getAllFields method
  document.getElementById("submitButton").addEventListener("click", submit)
  document.getElementById("backButton").addEventListener("click", back)

  // Instansiate Classes:
  let start_page = new StartPage();
  let summary_page  = new SummaryPage();

  function submit(){
    if (document.querySelector(".entryField").value === "")
      return
    document.getElementById("startPage").style.opacity = 0; 
    document.getElementById("summaryPage").style.opacity = 100; 
    start_page.getAllFields();
    start_page.clearAllFields(); 
    summary_page.calculateSummary();
  }

  function back(){
    document.getElementById("startPage").style.opacity = 100; 
    document.getElementById("summaryPage").style.opacity = 0;
  }

  setInterval(update, 100);

  function update(){
    // Check if the numerical fields contain value indicators e.g. M (million), K (thousand), ect.
    start_page.update(); 
  }
  
