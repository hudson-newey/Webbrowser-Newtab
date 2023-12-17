// globals
const CARD_COOKIE_NAME = "cards";
const INSTANT_ANSWERS_COOKIE_NAME = "ia-setting";
const SEARCH_ENGINE_COOKIE_NAME = "search-engine-setting";
const CALENDAR_PROVIDER_COOKIE_NAME = "calendar-provider-setting";

const KNOWN_TLDS = [".com", ".net", ".gov", ".org", ".eud"];

const DEFAULT_PROTOCOL = "https://";
const SUPPORTED_PROTOCOLS = [
  "https://",
  "http://",
  "ftp://",
  "file:///",
  "chrome-extension://",
  "#",
];

// helper functions
const setCookie = (
  cookieName: string,
  cookieContent: string,
  exDays: number = 365
): void => {
  const dateObject = new Date();
  dateObject.setTime(dateObject.getTime() + exDays * 24 * 60 * 60 * 1000);
  let expires = dateObject.toUTCString();
  document.cookie = `${cookieName}=${cookieContent};expires=${expires};path=/`;
};

const getCookie = (cname: string): string | undefined => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
};

const removeCookie = (cookieName: string): void => {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const doesExist = (value: any): boolean =>
  value !== undefined && value !== null;

// search functionality
const search = (): void => {
  const searchTerm: string | null = (
    document.getElementById("search-box") as HTMLInputElement
  )?.value;

  addToSearchHistory(searchTerm);

  let searching = false;

  if (searchTerm) {
    // test if it has a known top level domain
    KNOWN_TLDS.forEach((tld) => {
      if (searchTerm.includes(tld)) {
        searching = true;
        if (searchTerm.includes("://")) {
          document.location.href = searchTerm;
        } else {
          document.location.href = DEFAULT_PROTOCOL + searchTerm;
        }
      }
    });

    if (searching) return;

    // if it includes a protocol
    if (searchTerm.includes("://")) {
      document.location.href = searchTerm;
    } else {
      document.location.href = constructSearchQuery(searchTerm);
    }
  }
};

const constructSearchQuery = (searchTerm: string): string => {
  const defaultSearchEngine = "https://www.google.com/search?q=";
  const searchEngineSettingId = "search-engines";

  const searchEngineSetting = document.getElementById(
    searchEngineSettingId
  ) as HTMLSelectElement;

  if (doesExist(searchEngineSetting)) {
    return searchEngineSetting.value + searchTerm;
  }

  return defaultSearchEngine + searchTerm;
};

const changeSearchEngine = (): void => {
  const searchEngineSettingId = "search-engines";

  const searchEngineSetting = document.getElementById(
    searchEngineSettingId
  ) as HTMLSelectElement;

  if (doesExist(searchEngineSetting)) {
    setCookie(
      SEARCH_ENGINE_COOKIE_NAME,
      searchEngineSetting.selectedIndex.toString()
    );
  }
};

const changeCalendarProvider = (): void => {
  const calendarProviderSettingId = "calendar-providers";

  const calendarProviderSetting = document.getElementById(
    calendarProviderSettingId
  ) as HTMLSelectElement;

  if (doesExist(calendarProviderSetting)) {
    setCookie(
      CALENDAR_PROVIDER_COOKIE_NAME,
      calendarProviderSetting.selectedIndex.toString()
    );

    const timeElement: any = document.getElementById("calendar-link");
    if (timeElement !== null) {
      timeElement.href = calendarProviderSetting.value;
    }
  }
};

const changeInstantAnswersSetting = (): void => {
  const instantAnswersSettingId = "show-instant-answers-setting";

  const instantAnswersSettingBox = document.getElementById(
    instantAnswersSettingId
  ) as HTMLInputElement;

  if (doesExist(instantAnswersSettingBox)) {
    setCookie(
      INSTANT_ANSWERS_COOKIE_NAME,
      instantAnswersSettingBox.checked ? "1" : "0"
    );
  }
};

const shouldSearch = (event: KeyboardEvent): void => {
  const key = event.keyCode || event.which;
  if (key === 13) {
    search();
  } else {
    // if the user presses backspace, remove the current instant answer

    if (key === 8) {
      removeInstantAnswer();
    }

    // the user did not press enter
    // we should therefore query the DuckDuckgo API for an instant answer
    const inputVal = (document.getElementById(
      "search-box"
    ) as HTMLInputElement).value;

    if (inputVal) {
      queryInstantAnswer();
    } else {
      clearHistory();
    }
  }
};

const shouldAddNewCardFromInput = (event: KeyboardEvent): void => {
  const key = event.keyCode || event.which;

  // the user pressed enter
  if (key === 13) {
    getAndAddCardFromInput();
  }
};

const getAndAddCardFromInput = (): void => {
  const newCardUrlInput = document.getElementById(
    "new-card-url-input"
  ) as HTMLInputElement;

  if (newCardUrlInput !== undefined && newCardUrlInput !== null) {
    if (
      newCardUrlInput.value !== undefined &&
      newCardUrlInput.value !== null &&
      newCardUrlInput.value !== ""
    ) {
      addCard(newCardUrlInput.value);
    }
  }
};

// user defined cards
const addCard = (newCardURL: string): void => {
  // check that the URL is valid
  let foundSupportedProtocol: boolean = false;
  SUPPORTED_PROTOCOLS.forEach((protocol) => {
    if (newCardURL.includes(protocol)) {
      foundSupportedProtocol = true;
    }
  });

  if (!foundSupportedProtocol) {
    newCardURL = DEFAULT_PROTOCOL + newCardURL;
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
};

const deleteCard = (id: number, cardURL: string): void => {
  if (doesExist(id)) {
    const cardObj = document.getElementById(`${id}`);
    if (cardObj !== null) {
      // remove the card visually
      cardObj.remove();

      // remove the card from cookies
      const currentCards = getCookie(CARD_COOKIE_NAME);
      if (currentCards !== undefined) {
        let newCards = currentCards;

        [...SUPPORTED_PROTOCOLS, ""].forEach((protocol) => {
          const scanningContent = `${protocol}${cardURL}`;
          newCards = newCards.replace(`,${scanningContent}`, "");
        });

        removeCookie(CARD_COOKIE_NAME);
        setCookie(CARD_COOKIE_NAME, newCards);
      }
    }
  }
};

const createCard = (
  cardURL: string,
  img: string | undefined = undefined,
  eventFunction: any = undefined,
  canRemove: boolean = true
): void => {
  const uniqueId = Math.random() * 1000;

  let faviconURL = "";

  if (img === undefined) {
    faviconURL = `https://${cardURL.split("/")[2]}/favicon.ico`;
  } else {
    faviconURL = img;
  }

  const newCardObj = document.createElement("div");
  newCardObj.id = `${uniqueId}`;
  newCardObj.className = "fav draggable";
  const newCardLink = document.createElement("a");

  let foundSupportedProtocol: boolean = false;
  SUPPORTED_PROTOCOLS.forEach((protocol) => {
    if (cardURL.includes(protocol)) {
      foundSupportedProtocol = true;
    }
  });

  if (!foundSupportedProtocol) {
    newCardLink.href = DEFAULT_PROTOCOL + cardURL;
  } else {
    newCardLink.href = cardURL;
  }

  if (doesExist(eventFunction)) {
    newCardObj.onclick = function () {
      eventFunction();
    };
  }

  // use the Google favicon service
  if (img === undefined) {
    newCardLink.innerHTML = `<img src="https://s2.googleusercontent.com/s2/favicons?domain_url=${faviconURL}" alt="${cardURL.replace(
      "https://",
      ""
    )}">`;
  } else {
    newCardLink.innerHTML = `<img src="${faviconURL}" alt="${cardURL.replace(
      "https://",
      ""
    )}">`;
  }

  const removeButton: HTMLElement = document.createElement("button");
  if (canRemove) {
    removeButton.id = `${uniqueId}-removeBTN`;
    removeButton.className = "removeCardButton";
    removeButton.innerText = "X";
    removeButton.addEventListener("click", function handleClick(event) {
      deleteCard(uniqueId, cardURL);
    });
  }

  newCardObj.appendChild(newCardLink);
  if (canRemove) newCardObj.appendChild(removeButton);
  document.getElementById("card-container")?.appendChild(newCardObj);
};

const createCards = (): void => {
  const historicalCards = getCookie(CARD_COOKIE_NAME);
  const cards = historicalCards?.split(",");

  if (cards !== undefined && cards?.length > 0) {
    cards.forEach((cardURL) => {
      if (cardURL !== undefined && cardURL !== "undefined") {
        createCard(cardURL);
      }
    });
  }

  // "plus card" card
  createCard(
    "#",
    "https://cdn.iconscout.com/icon/free/png-256/add-plus-3114469-2598247.png",
    () => showCardInput(),
    false
  );
};

const setInstantAnswersSettingCheckbox = (value: boolean): void => {
  const instantAnswersSettingId = "show-instant-answers-setting";

  const instantAnswersBox = document.getElementById(
    instantAnswersSettingId
  ) as HTMLInputElement;

  if (doesExist(instantAnswersBox)) {
    instantAnswersBox.checked = value;
  }
};

const setSearchEngineSettings = (index: number): void => {
  const searchEngineSettingId = "search-engines";

  const searchEngineSetting = document.getElementById(
    searchEngineSettingId
  ) as HTMLSelectElement;

  if (doesExist(searchEngineSetting)) {
    searchEngineSetting.selectedIndex = index;
  }
};

const setCalendarProviderSettings = (index: number): void => {
  const calendarProviderSettingId = "calendar-providers";

  const calendarProviderSetting = document.getElementById(
    calendarProviderSettingId
  ) as HTMLSelectElement;

  if (doesExist(calendarProviderSetting)) {
    calendarProviderSetting.selectedIndex = index;
  }
};

// saves the user settings through cookies
const initSettings = (): void => {
  // instant answers settings
  if (getCookie(INSTANT_ANSWERS_COOKIE_NAME) === "0") {
    setInstantAnswersSettingCheckbox(false);
  } else {
    setInstantAnswersSettingCheckbox(true);
  }

  // search engine settings
  const selectedSearchEngine = getCookie(SEARCH_ENGINE_COOKIE_NAME);
  if (selectedSearchEngine !== undefined) {
    setSearchEngineSettings(+selectedSearchEngine);
  } else {
    setSearchEngineSettings(0);
  }

  // calendar service settings
  const selectedCalendarProvider = getCookie(CALENDAR_PROVIDER_COOKIE_NAME);
  if (selectedCalendarProvider !== undefined) {
    setCalendarProviderSettings(+selectedCalendarProvider);
  } else {
    setCalendarProviderSettings(0);
  }

  const calendarProviderSetting = document.getElementById(
    "calendar-providers"
  ) as HTMLSelectElement;

  const timeElement: any = document.getElementById("calendar-link");
  if (timeElement !== null) {
    timeElement.href = calendarProviderSetting.value;
  }
};

const setSettingsPaneDisplayStyle = (shown: boolean): void => {
  const settingsContainerId = "settings-pane";
  const shownClass = "active";

  const settingsPane = document.getElementById(settingsContainerId);

  if (settingsPane !== undefined && settingsPane !== null) {
    if (settingsPane.classList.contains(shownClass)) {
      settingsPane.classList.remove(shownClass);
    } else {
      settingsPane.classList.add(shownClass);
    }
  }
};

let openSettings = (): void => {
  setSettingsPaneDisplayStyle(true);
};

let closeSettings = (): void => {
  setSettingsPaneDisplayStyle(false);
};

// async & event processes

const updateTime = (): void => {
  let timeElement: HTMLElement | null = document.getElementById("time");
  if (timeElement !== null) {
    const dateObject = new Date();
    let currentTime = `${
      dateObject.getHours() > 12
        ? dateObject.getHours() - 12
        : dateObject.getHours()
    }:${dateObject.getMinutes()}`;

    // format time correctly by adding leading zeros
    let hour = currentTime.split(":")[0];
    let minute = currentTime.split(":")[1];

    if (hour.length < 2) hour = `0${hour}`;
    if (minute.length < 2) minute = `0${minute}`;
    if (hour.length < 2) hour = `0${hour}`;
    if (minute.length < 2) minute = `0${minute}`;

    timeElement.innerHTML = `${hour}:${minute}`;
  }
};

const shouldShowInstantAnswers = (): boolean => {
  const defaultReturnValue = true;
  const settingId = "show-instant-answers-setting";

  const settingElement = document.getElementById(settingId) as HTMLInputElement;

  if (settingElement !== undefined && settingElement !== null) {
    return settingElement.checked;
  }

  return defaultReturnValue;
};

// instant answers logic
const queryInstantAnswer = (): void => {
  if (!shouldShowInstantAnswers()) {
    return;
  }

  let inputBox = document.getElementById("search-box") as HTMLInputElement;

  if (inputBox !== null && inputBox !== undefined && inputBox.value !== "") {
    const query = inputBox.value;

    const response = fetch(
      `https://api.duckduckgo.com/?q=${query}&format=json`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        const instantAnswer = json.AbstractText;

        if (
          instantAnswer !== undefined &&
          instantAnswer !== null &&
          instantAnswer !== ""
        ) {
          const instantAnswerBox = document.getElementById(
            "instant-answer-box"
          ) as HTMLElement;

          if (instantAnswerBox !== null && instantAnswerBox !== undefined) {
            instantAnswerBox.innerHTML = instantAnswer;
          }
        } else {
          const instantAnswerBox = document.getElementById(
            "instant-answer-box"
          ) as HTMLElement;

          if (instantAnswerBox !== null && instantAnswerBox !== undefined) {
            instantAnswerBox.innerHTML = "";
          }
        }
      });
  }
};

const removeInstantAnswer = (): void => {
  const instantAnswersBox = document.getElementById("instant-answer-box");

  if (instantAnswersBox !== undefined && instantAnswersBox !== null) {
    instantAnswersBox.innerText = "";
  }
};

const updateCardInputDisplay = (newValue: string): void => {
  const commandPallet = document.getElementById("command-pallet-container");

  if (commandPallet !== undefined && commandPallet !== null) {
    commandPallet.style.display = newValue;
  }

  const newCardUrlInput = document.getElementById(
    "new-card-url-input"
  ) as HTMLInputElement;

  if (newCardUrlInput !== undefined && newCardUrlInput !== null) {
    newCardUrlInput.value = "";
  }
};

const hideCardInput = (): void => {
  updateCardInputDisplay("none");
};

const showCardInput = (): void => {
  updateCardInputDisplay("block");
};

const updateBackground = (): void => {
  const inputElement: HTMLInputElement | null = document.getElementById(
    "background-image-input"
  ) as HTMLInputElement;
  const value = inputElement?.value;

  if (value) {
    localStorage.setItem("background-image", value);
  } else {
    localStorage.removeItem("background-image");
  }

  updateBackgroundElements();
  window.location.reload();
};

const updateBackgroundElements = (): void => {
  const value = localStorage.getItem("background-image");

  if (value) {
    const inputElement: HTMLElement | null = document.getElementById(
      "background-image-input"
    );
    const backgroundElement: any = document.getElementById("gradient");

    if (inputElement !== null) {
      inputElement.innerText = value;
    }

    backgroundElement.id = "background-image";
    backgroundElement.style.backgroundImage = `url(${value})`;
  }
};

// gradient logic
const init = (): void => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const titleElement: HTMLElement | null =
    document.getElementById("main-title");

  if (titleElement !== null) {
    titleElement.innerHTML = currentDate;
  }

  createCards();
  initSettings();

  updateBackgroundElements();

  loop();
};

const loop = (): void => {
  updateTime();
  setTimeout(loop, 1000);
};

init();
