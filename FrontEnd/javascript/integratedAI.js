
import {generateAIResponse, generateExampleAIResponse} from './backendComunication.js';

export class geminiAI{
  constructor() {
    this.scoreBox = document.getElementById("scoreBox");
    this.classBox = document.getElementById("classBox");
    this.geminiStar = document.getElementById("geminiStar");
    this.titleBoxAI = document.getElementById("titleBoxAI");
    this.rating = document.getElementById("rating");
    this.textBoxAI = document.getElementById("textBoxAI");
    this.progressBarContainers = document.querySelectorAll(".geminiProgressContainer");
    console.log("Found bars:", this.progressBarContainers.length);
    this.dryRun = false; 
    this.response; 
  }

  async start(){
    this.titleBoxAI.textContent = " Gemini Is Working... "

    // Set star animation
    this.geminiStar.classList.remove('spinning');
    this.geminiStar.classList.add('spinning');
    // Set text animation 
    this.setTextAnimationOn();

    if (this.dryRun === true) {this.response = await generateExampleAIResponse();} 
    else {this.response = await generateAIResponse();} 

    this.geminiStar.classList.remove('spinning');
    this.setTextAnimationOff();

    console.log(this.response);

    this.deliverResponse(); 
    this.calculateScore(); 
  }

  // Rank Box Code 
  calculateScore(){
    this.scoreBox.textContent = `${this.response.score}/2000`
    let classRank = ""; 
    let score = Number(this.response.score);

    if (isNaN(score)) {
      classRank = "NO";
    } else if (score > 1750) {
      classRank = "S";
    } else if (score > 1450) {
      classRank = "A";
    } else if (score > 1250) {
      classRank = "B";
    } else if (score > 1100) {
      classRank = "C";
    } else {
      classRank = "D";
    }

    this.classBox.textContent = classRank;
  }

  // Ai writes response into textbox
  deliverResponse(){ 
    this.titleBoxAI.innerHTML = `Gemini Says: <span class="bold">${(this.response.rating).toUpperCase()}</span>`;

    let formattedText = this.response.insight.replace(/[#]/g, '\n');
    formattedText = formattedText.replace(/[:]/g, ':\n');
    formattedText = formattedText.replace(/[&]/g, '\n');
    this.textBoxAI.textContent = formattedText;
  }

  clearFields(){
    this.scoreBox.textContent = "0/2000"
    this.classBox.textContent = "?";
    this.titleBoxAI.textContent = "Google Gemini Summary";
    this.textBoxAI.textContent = "";
  }

  setTextAnimationOn(){
    this.progressBarContainers.forEach((barContainer, index) => {
      const delay = index * 100;

    setTimeout(() => {
      barContainer.style.display = "block";
    }, delay);
    });
  }

  setTextAnimationOff(){
    this.progressBarContainers.forEach(barContainer => {
      barContainer.style.display = "none";
    });
  }

  toggleDryRun(){
    this.dryRun = (this.dryRun === true) ? false : true;
  }

}

