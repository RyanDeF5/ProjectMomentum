
import {generateAIResponse} from './backendComunication.js';

export class geminiAI{
  constructor() {
    this.scoreBox = document.getElementById("scoreBox");
    this.classBox = document.getElementById("classBox");
    this.geminiStar = document.getElementById("geminiStar");
    this.titleBoxAI = document.getElementById("titleBoxAI");
    this.textBoxAI = document.getElementById("textBoxAI");
    this.response; 
  }

  async start(){
    this.titleBoxAI.textContent = " Gemini Is Working... "
    this.textBoxAI.textContent = " Generating Response "

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
    this.scoreBox.textContent = `${this.response.score}/1200`
  }

  // Ai writes response into textbox
  deliverResponse(){
    this.titleBoxAI.textContent = `Gemini Says: ${(this.response.rating).toUpperCase()}`;
    this.textBoxAI.textContent = this.response.insight;
  }

}

