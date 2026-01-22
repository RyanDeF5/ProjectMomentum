// Establish stock data package 
export const stockData = {
symbol: '',
fullName: '',
currentPrice: 0,
lastClose: 0,
volume: 0,
averageVolume: 0,
float: 0
}

export const marketData = {
  marketState: ''
}

export const clockData = {
  hours: '',
  minutes: '', 
  seconds: '',
  militaryTime: '',
  anteMeridiem: ''
}

let dayOfWeek;

export function updateClock() {
    const now = new Date();
    
    // Get hours, minutes, and seconds
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Convert to military time 
    clockData.militaryTime = (now.getHours() * 100) + now.getMinutes();

    // Determine Market State
    // marketData.marketState = "PRE-MARKET"
    if (dayOfWeek !== "Saturday" && dayOfWeek !== "Sunday") {
      if (clockData.militaryTime >= 400 && clockData.militaryTime < 930) 
        marketData.marketState = "PRE-MARKET";
      else if (clockData.militaryTime >= 930 && clockData.militaryTime <= 1600)
        marketData.marketState = "MARKET OPEN"
      else if (clockData.militaryTime > 1600 && clockData.militaryTime <= 2000)
        marketData.marketState = "AFTER HOURS"
      else
        marketData.marketState = "MARKET CLOSED"
    } 
    else {
      marketData.marketState = "MARKET CLOSED"
    }


    let date = getDate(now); 

    let timeOfDay = (hours >= 12) ? " Good Evening " : " Good Morning "

    clockData.anteMeridiem = (hours >= 12) ? "PM" : " AM"

    // Add a leading zero to numbers less than 10 (e.g., "05" instead of "5")
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // Convert Hours
    hours = (hours > 12) ? Math.abs(hours - 12) : hours;

    clockData.hours = `${hours}`;
    clockData.minutes = `${minutes}`
    clockData.seconds = `${seconds}`;
    
    // Push the time to your HTML element
    document.getElementById("hours").textContent = `${clockData.hours}:`;
    document.getElementById("minutes").textContent = `${clockData.minutes}:`;
    document.getElementById("seconds").textContent = clockData.seconds;
    document.getElementById("date").textContent = date;
    document.getElementById("timeOfDay").textContent = timeOfDay;
}


// Function that gets full date made by ChatGPT
function getDate(now){
  // 1. Get the Month Name (e.g., "January")
  const month = now.toLocaleString('default', { month: 'long' });

  // 2. Get the Year (e.g., 2026)
  const year = now.getFullYear();

  // 3. Get the Day and add the suffix (st, nd, rd, th)
  const dateNum = now.getDate();
  let suffix = "th";

  if (dateNum === 1 || dateNum === 21 || dateNum === 31) suffix = "st";
  else if (dateNum === 2 || dateNum === 22) suffix = "nd";
  else if (dateNum === 3 || dateNum === 23) suffix = "rd";

  dayOfWeek = now.toLocaleString('default', { weekday: 'long' });

  // 4. Combine them into your string
  let day = `It is ${dayOfWeek}, ${month} ${dateNum}${suffix}, ${year}`;

  return day; 
}