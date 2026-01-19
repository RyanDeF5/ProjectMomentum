
import {generateAIResponse} from './backendComunication.js';

export class geminiAI{
  constructor() {
    this.scoreBox = document.getElementById("scoreBox");
    this.classBox = document.getElementById("classBox");
    this.geminiStar = document.getElementById("geminiStar");
    this.titleBoxAI = document.getElementById("titleBoxAI");
    this.rating = document.getElementById("rating");
    this.textBoxAI = document.getElementById("textBoxAI");
    this.response; 
  }

  async start(){
    this.titleBoxAI.textContent = " Gemini Is Working... "

    // Set star animation
    this.geminiStar.classList.remove('spinning');
    this.geminiStar.classList.add('spinning');

    this.response = await generateAIResponse(); 
    this.geminiStar.classList.remove('spinning');

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

    console.log(classRank);
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

}

