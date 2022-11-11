// globals
const CARD_COOKIE_NAME = "cards";
const SUPPORTED_PROTOCOLS = ["https://", "http://", "ftp://", "file:///", "chrome-extension://", ""];

// helper functions
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
  const searchEngine: string = "https://www.google.com/search?q=";

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

  // check that the URL is valid
  let foundSupportedProtocol: boolean = false;
  SUPPORTED_PROTOCOLS.forEach((protocol) => {
    if (newCardURL.includes(protocol)) {
      foundSupportedProtocol = true;
    }
  });

  if (!foundSupportedProtocol) {
    alert("Web protocol not supported...");
    return;
  }

  const existingCards = getCookie(CARD_COOKIE_NAME);

  // check that there are no duplicates
  if (existingCards !== undefined) {

    if (existingCards.split(",").length <= 1) {
      // there is only 1 card
      if (existingCards.includes(newCardURL)) {
        alert("Duplicate Card Found...");
        return;
      }
    } else {
      // there are more than 1 card
      if (existingCards.includes(`,${newCardURL}`)) {
        alert("Duplicate Card Found...");
        return;
      }
    }

  }

  setCookie(CARD_COOKIE_NAME, `${existingCards},${newCardURL}`);
  window.location.reload();
}

let deleteCard = (id: number, cardURL: string) => {
  if (id !== null) {
    const cardObj = document.getElementById(`${id}`);
    if (cardObj !== null) {
      // remove the card visually
      cardObj.remove();

      // remove the card from cookies
      const currentCards = getCookie(CARD_COOKIE_NAME);
      if (currentCards !== undefined) {
        let newCards = currentCards;
        
        SUPPORTED_PROTOCOLS.forEach((protocol) => {
          const scanningContent = `${protocol}${cardURL}`;
          console.log(scanningContent);
          newCards = newCards.replace(`,${scanningContent}`, "");
          newCards = newCards.replace(scanningContent, "");  
        });

        setCookie(CARD_COOKIE_NAME, newCards);
      }
    }
  }
}

let createCards = () => {
  const historicalCards = getCookie(CARD_COOKIE_NAME);
  const cards = historicalCards?.split(",");
  
  if (cards !== undefined && cards?.length > 0) {
    cards.forEach((cardURL) => {
      const uniqueId = Math.random() * 1000;

      if (cardURL !== undefined && cardURL !== "undefined") {
        const faviconURL = `https://${cardURL.split("/")[2]}/favicon.ico`;

        const newCardObj = document.createElement("div");
        newCardObj.id = `${uniqueId}`;
        newCardObj.className = "fav";
        const newCardLink = document.createElement("a");
        newCardLink.href = cardURL;
        
        // use the Google favicon service
        newCardLink.innerHTML = `<img src="https://s2.googleusercontent.com/s2/favicons?domain_url=${faviconURL}" alt="${cardURL.replace("https://", "")}">`;

        const removeButton = document.createElement("button");
        removeButton.id = `${uniqueId}-removeBTN`;
        removeButton.className = "removeCardButton";
        removeButton.innerText = "Remove";
        removeButton.addEventListener("click", function handleClick(event) {
          deleteCard(uniqueId, cardURL);
        });

        newCardObj.appendChild(newCardLink);
        newCardObj.appendChild(removeButton);
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
  const plusCardIcon = document.createElement("img");
  plusCardIcon.src = "https://cdn.iconscout.com/icon/free/png-256/add-plus-3114469-2598247.png";
  plusCardObj.appendChild(plusCardIcon);
  document.getElementById("card-container")?.appendChild(plusCardObj);
}

// async processes

let updateTime = () => {
  let timeElement: HTMLElement | null = document.getElementById("time");
  if (timeElement !== null) {
    const dateObject = new Date();
    let currentTime = `${dateObject.getHours() > 12 ? dateObject.getHours() - 12 : dateObject.getHours()}:${dateObject.getMinutes()}`;
    if (currentTime.length < 5) {
      if (currentTime.length < 4) {
        currentTime = `${currentTime.split(":")[0]}:0${currentTime.split(":")[1]}`
      }
      currentTime = `0${currentTime}`;
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
