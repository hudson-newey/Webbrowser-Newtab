// globals
const CARD_COOKIE_NAME = "cards";

// helper functions

let deleteCookie = (cookieName: string): string =>
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

let setCookie = (cookieName: string, cookieContent: string, exDays: number = 365): void => {
  const dateObject = new Date();
  dateObject.setTime(dateObject.getTime() + (exDays*24*60*60*1000));
  let expires = dateObject.toUTCString();
  document.cookie = `${cookieName}=${cookieContent};expires=${expires};path=/`;
}

function getCookie(cname: string): string | undefined {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
}

// search functionality
let search = () => {
  const searchTerm: string | null = (document.getElementById("search-box") as HTMLInputElement)?.value;
  const searchEngine: string = "https://search.brave.com/search?q=";

  if (searchTerm !== null) {
    if (searchTerm.includes("://")) {
      document.location.href = searchTerm;
    } else {
      document.location.href = `${searchEngine}${searchTerm}`;
    }
  }
}

let shouldSearch = (event: KeyboardEvent) => {
  const key=event.keyCode || event.which;
  if (key==13){
    search();
  }
}

// user defined cards

let addCard = () => {
  const newCardURL: string | null = prompt("Website URL", "https://www.google.com/");

  if (newCardURL === null || newCardURL === undefined || newCardURL === "") { return; }

  console.log(newCardURL);
  const existingCards = getCookie(CARD_COOKIE_NAME);
  setCookie(CARD_COOKIE_NAME, `${existingCards},${newCardURL}`);
  window.location.reload();
}

let createCards = () => {
  const historicalCards = getCookie(CARD_COOKIE_NAME);
  const cards = historicalCards?.split(",");
  
  if (cards !== undefined && cards?.length > 0) {
    cards.forEach((card) => {

      if (card !== undefined && card !== "undefined") {
        const faviconURL = `https://${card.split("/")[2]}/favicon.ico`;

        const newCardObj = document.createElement("a");
        newCardObj.href = card;
        newCardObj.className = "fav";
        newCardObj.innerHTML = `<img  src="${faviconURL}">`;
        document.getElementById("card-container")?.appendChild(newCardObj);
      }

    });
  }

  // "plus card" card
  const plusCardObj = document.createElement("a");
  plusCardObj.onclick = function() { addCard(); }
  plusCardObj.id = "add-card-icon";
  plusCardObj.href = "#";
  plusCardObj.className = "fav";
  plusCardObj.innerHTML = "+";
  document.getElementById("card-container")?.appendChild(plusCardObj);
}

// async processes

let updateTime = () => {
  let timeElement: HTMLElement | null = document.getElementById("time");
  if (timeElement !== null) {
    const dateObject = new Date();
    let currentTime = `${dateObject.getHours() > 12 ? dateObject.getHours() - 12 : dateObject.getHours()}:${dateObject.getMinutes()}`;
    if (currentTime.length < 5) {
      currentTime = "0" + currentTime;
    }
    timeElement.innerHTML = currentTime;
  }
}

let init = () => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const titleElement: HTMLElement | null = document.getElementById("main-title");

  if (titleElement !== null) {
    titleElement.innerHTML = currentDate;
  }

  createCards();

  loop();
}

let loop = () => {
  updateTime();
  setTimeout(loop, 1000);
}

init();
