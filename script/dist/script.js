// globals
var CARD_COOKIE_NAME = "cards";
var INSTANT_ANSWERS_COOKIE_NAME = "ia-setting";
var SEARCH_ENGINE_COOKIE_NAME = "search-engine-setting";
var CALENDAR_PROVIDER_COOKIE_NAME = "calendar-provider-setting";
var KNOWN_TLDS = [".com", ".net", ".gov", ".org", ".eud"];
var DEFAULT_PROTOCOL = "https://";
var SUPPORTED_PROTOCOLS = [
    "https://",
    "http://",
    "ftp://",
    "file:///",
    "chrome-extension://",
    "#",
];
// helper functions
var setCookie = function (cookieName, cookieContent, exDays) {
    if (exDays === void 0) { exDays = 365; }
    var dateObject = new Date();
    dateObject.setTime(dateObject.getTime() + exDays * 24 * 60 * 60 * 1000);
    var expires = dateObject.toUTCString();
    document.cookie = cookieName + "=" + cookieContent + ";expires=" + expires + ";path=/";
};
var getCookie = function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
};
var doesExist = function (value) {
    return value !== undefined && value !== null;
};
// search functionality
var search = function () {
    var _a;
    var searchTerm = (_a = document.getElementById("search-box")) === null || _a === void 0 ? void 0 : _a.value;
    var searching = false;
    if (searchTerm !== null) {
        // test if it has a known top level domain
        KNOWN_TLDS.forEach(function (tld) {
            if (searchTerm.includes(tld)) {
                document.location.href = DEFAULT_PROTOCOL + searchTerm;
                searching = true;
            }
        });
        if (searching)
            return;
        // if it includes a protocol
        if (searchTerm.includes("://")) {
            document.location.href = searchTerm;
        }
        else {
            document.location.href = constructSearchQuery(searchTerm);
        }
    }
};
var constructSearchQuery = function (searchTerm) {
    var defaultSearchEngine = "https://www.google.com/search?q=";
    var searchEngineSettingId = "search-engines";
    var searchEngineSetting = document.getElementById(searchEngineSettingId);
    if (doesExist(searchEngineSetting)) {
        return searchEngineSetting.value + searchTerm;
    }
    return defaultSearchEngine + searchTerm;
};
var changeSearchEngine = function () {
    var searchEngineSettingId = "search-engines";
    var searchEngineSetting = document.getElementById(searchEngineSettingId);
    if (doesExist(searchEngineSetting)) {
        setCookie(SEARCH_ENGINE_COOKIE_NAME, searchEngineSetting.selectedIndex.toString());
    }
};
var changeCalendarProvider = function () {
    var calendarProviderSettingId = "calendar-providers";
    var calendarProviderSetting = document.getElementById(calendarProviderSettingId);
    if (doesExist(calendarProviderSetting)) {
        console.log(calendarProviderSetting.selectedIndex);
        setCookie(CALENDAR_PROVIDER_COOKIE_NAME, calendarProviderSetting.selectedIndex.toString());
    }
};
var changeInstantAnswersSetting = function () {
    var instantAnswersSettingId = "show-instant-answers-setting";
    var instantAnswersSettingBox = document.getElementById(instantAnswersSettingId);
    if (doesExist(instantAnswersSettingBox)) {
        setCookie(INSTANT_ANSWERS_COOKIE_NAME, instantAnswersSettingBox.checked ? "1" : "0");
    }
};
var shouldSearch = function (event) {
    var key = event.keyCode || event.which;
    if (key === 13) {
        search();
    }
    else {
        // if the user presses backspace, remove the current instant answer
        if (key === 8) {
            removeInstantAnswer();
        }
        // the user did not press enter
        // we should therefore query the DuckDuckgo API for an instant answer
        queryInstantAnswer();
    }
};
var shouldAddNewCardFromInput = function (event) {
    var key = event.keyCode || event.which;
    // the user pressed enter
    if (key === 13) {
        getAndAddCardFromInput();
    }
};
var getAndAddCardFromInput = function () {
    var newCardUrlInput = document.getElementById("new-card-url-input");
    if (newCardUrlInput !== undefined && newCardUrlInput !== null) {
        if (newCardUrlInput.value !== undefined &&
            newCardUrlInput.value !== null &&
            newCardUrlInput.value !== "") {
            addCard(newCardUrlInput.value);
        }
    }
};
// user defined cards
var addCard = function (newCardURL) {
    // check that the URL is valid
    var foundSupportedProtocol = false;
    SUPPORTED_PROTOCOLS.forEach(function (protocol) {
        if (newCardURL.includes(protocol)) {
            foundSupportedProtocol = true;
        }
    });
    if (!foundSupportedProtocol) {
        newCardURL = DEFAULT_PROTOCOL + newCardURL;
    }
    var existingCards = getCookie(CARD_COOKIE_NAME);
    // check that there are no duplicates
    if (existingCards !== undefined) {
        if (existingCards.split(",").length <= 1) {
            // there is only 1 card
            if (existingCards.includes(newCardURL)) {
                alert("Duplicate Card Found...");
                return;
            }
        }
        else {
            // there are more than 1 card
            if (existingCards.includes("," + newCardURL)) {
                alert("Duplicate Card Found...");
                return;
            }
        }
    }
    setCookie(CARD_COOKIE_NAME, existingCards + "," + newCardURL);
    window.location.reload();
};
var deleteCard = function (id, cardURL) {
    if (doesExist(id)) {
        var cardObj = document.getElementById("" + id);
        if (cardObj !== null) {
            // remove the card visually
            cardObj.remove();
            // remove the card from cookies
            var currentCards = getCookie(CARD_COOKIE_NAME);
            if (currentCards !== undefined) {
                var newCards_1 = currentCards;
                SUPPORTED_PROTOCOLS.forEach(function (protocol) {
                    var scanningContent = "" + protocol + cardURL;
                    console.log(scanningContent);
                    newCards_1 = newCards_1.replace("," + scanningContent, "");
                    newCards_1 = newCards_1.replace(scanningContent, "");
                });
                setCookie(CARD_COOKIE_NAME, newCards_1);
            }
        }
    }
};
var createCard = function (cardURL, img, eventFunction, canRemove) {
    var _a;
    if (img === void 0) { img = undefined; }
    if (eventFunction === void 0) { eventFunction = undefined; }
    if (canRemove === void 0) { canRemove = true; }
    var uniqueId = Math.random() * 1000;
    var faviconURL = "";
    if (img === undefined) {
        faviconURL = "https://" + cardURL.split("/")[2] + "/favicon.ico";
    }
    else {
        faviconURL = img;
    }
    var newCardObj = document.createElement("div");
    newCardObj.id = "" + uniqueId;
    newCardObj.className = "fav draggable";
    var newCardLink = document.createElement("a");
    var foundSupportedProtocol = false;
    SUPPORTED_PROTOCOLS.forEach(function (protocol) {
        if (cardURL.includes(protocol)) {
            foundSupportedProtocol = true;
        }
    });
    if (!foundSupportedProtocol) {
        newCardLink.href = DEFAULT_PROTOCOL + cardURL;
    }
    else {
        newCardLink.href = cardURL;
    }
    if (doesExist(eventFunction)) {
        newCardObj.onclick = function () {
            eventFunction();
        };
    }
    // use the Google favicon service
    if (img === undefined) {
        newCardLink.innerHTML = "<img src=\"https://s2.googleusercontent.com/s2/favicons?domain_url=" + faviconURL + "\" alt=\"" + cardURL.replace("https://", "") + "\">";
    }
    else {
        newCardLink.innerHTML = "<img src=\"" + faviconURL + "\" alt=\"" + cardURL.replace("https://", "") + "\">";
    }
    var removeButton = document.createElement("button");
    if (canRemove) {
        removeButton.id = uniqueId + "-removeBTN";
        removeButton.className = "removeCardButton";
        removeButton.innerText = "X";
        removeButton.addEventListener("click", function handleClick(event) {
            deleteCard(uniqueId, cardURL);
        });
    }
    newCardObj.appendChild(newCardLink);
    if (canRemove)
        newCardObj.appendChild(removeButton);
    (_a = document.getElementById("card-container")) === null || _a === void 0 ? void 0 : _a.appendChild(newCardObj);
};
var createCards = function () {
    var historicalCards = getCookie(CARD_COOKIE_NAME);
    var cards = historicalCards === null || historicalCards === void 0 ? void 0 : historicalCards.split(",");
    if (cards !== undefined && (cards === null || cards === void 0 ? void 0 : cards.length) > 0) {
        cards.forEach(function (cardURL) {
            if (cardURL !== undefined && cardURL !== "undefined") {
                createCard(cardURL);
            }
        });
    }
    // "plus card" card
    createCard("#", "https://cdn.iconscout.com/icon/free/png-256/add-plus-3114469-2598247.png", function () { return showCardInput(); }, false);
};
var setInstantAnswersSettingCheckbox = function (value) {
    var instantAnswersSettingId = "show-instant-answers-setting";
    var instantAnswersBox = document.getElementById(instantAnswersSettingId);
    if (doesExist(instantAnswersBox)) {
        instantAnswersBox.checked = value;
    }
};
var setSearchEngineSettings = function (index) {
    var searchEngineSettingId = "search-engines";
    var searchEngineSetting = document.getElementById(searchEngineSettingId);
    if (doesExist(searchEngineSetting)) {
        searchEngineSetting.selectedIndex = index;
    }
};
var setCalendarProviderSettings = function (index) {
    var calendarProviderSettingId = "calendar-providers";
    var calendarProviderSetting = document.getElementById(calendarProviderSettingId);
    if (doesExist(calendarProviderSetting)) {
        calendarProviderSetting.selectedIndex = index;
    }
};
// saves the user settings through cookies
var initSettings = function () {
    // instant answers settings
    if (getCookie(INSTANT_ANSWERS_COOKIE_NAME) === "0") {
        setInstantAnswersSettingCheckbox(false);
    }
    else {
        setInstantAnswersSettingCheckbox(true);
    }
    // search engine settings
    var selectedSearchEngine = getCookie(SEARCH_ENGINE_COOKIE_NAME);
    if (selectedSearchEngine !== undefined) {
        setSearchEngineSettings(+selectedSearchEngine);
    }
    else {
        setSearchEngineSettings(0);
    }
    // calendar service settings
    var selectedCalendarProvider = getCookie(CALENDAR_PROVIDER_COOKIE_NAME);
    if (selectedCalendarProvider !== undefined) {
        setCalendarProviderSettings(+selectedCalendarProvider);
    }
    else {
        setCalendarProviderSettings(0);
    }
};
var setSettingsPaneDisplayStyle = function (style) {
    var settingsContainerId = "settings-pane";
    var settingsPane = document.getElementById(settingsContainerId);
    if (settingsPane !== undefined && settingsPane !== null) {
        settingsPane.style.display = style;
    }
};
var openSettings = function () {
    setSettingsPaneDisplayStyle("block");
};
var closeSettings = function () {
    setSettingsPaneDisplayStyle("none");
};
// async & event processes
var updateTime = function () {
    var timeElement = document.getElementById("time");
    if (timeElement !== null) {
        var dateObject = new Date();
        var currentTime = (dateObject.getHours() > 12
            ? dateObject.getHours() - 12
            : dateObject.getHours()) + ":" + dateObject.getMinutes();
        // format time correctly by adding leading zeros
        var hour = currentTime.split(":")[0];
        var minute = currentTime.split(":")[1];
        if (hour.length < 2)
            hour = "0" + hour;
        if (minute.length < 2)
            minute = "0" + minute;
        if (hour.length < 2)
            hour = "0" + hour;
        if (minute.length < 2)
            minute = "0" + minute;
        timeElement.innerHTML = hour + ":" + minute;
    }
};
var shouldShowInstantAnswers = function () {
    var defaultReturnValue = true;
    var settingId = "show-instant-answers-setting";
    var settingElement = document.getElementById(settingId);
    if (settingElement !== undefined && settingElement !== null) {
        return settingElement.checked;
    }
    return defaultReturnValue;
};
// instant answers logic
var queryInstantAnswer = function () {
    if (!shouldShowInstantAnswers()) {
        return;
    }
    var inputBox = document.getElementById("search-box");
    if (inputBox !== null && inputBox !== undefined && inputBox.value !== "") {
        var query = inputBox.value;
        var response = fetch("https://api.duckduckgo.com/?q=" + query + "&format=json", {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        })
            .then(function (response) { return response.json(); })
            .then(function (json) {
            var instantAnswer = json.AbstractText;
            if (instantAnswer !== undefined &&
                instantAnswer !== null &&
                instantAnswer !== "") {
                var instantAnswerBox = document.getElementById("instant-answer-box");
                if (instantAnswerBox !== null && instantAnswerBox !== undefined) {
                    console.log(instantAnswer);
                    instantAnswerBox.innerHTML = instantAnswer;
                }
            }
            else {
                var instantAnswerBox = document.getElementById("instant-answer-box");
                if (instantAnswerBox !== null && instantAnswerBox !== undefined) {
                    console.log(instantAnswer);
                    instantAnswerBox.innerHTML = "";
                }
            }
        });
    }
};
var removeInstantAnswer = function () {
    var instantAnswersBox = document.getElementById("instant-answer-box");
    if (instantAnswersBox !== undefined && instantAnswersBox !== null) {
        instantAnswersBox.innerText = "";
    }
};
var updateCardInputDisplay = function (newValue) {
    var commandPallet = document.getElementById("command-pallet-container");
    if (commandPallet !== undefined && commandPallet !== null) {
        commandPallet.style.display = newValue;
    }
    var newCardUrlInput = document.getElementById("new-card-url-input");
    if (newCardUrlInput !== undefined && newCardUrlInput !== null) {
        newCardUrlInput.value = "";
    }
};
var hideCardInput = function () {
    updateCardInputDisplay("none");
};
var showCardInput = function () {
    updateCardInputDisplay("block");
};
// gradient logic
var init = function () {
    var currentDate = new Date().toISOString().slice(0, 10);
    var titleElement = document.getElementById("main-title");
    if (titleElement !== null) {
        titleElement.innerHTML = currentDate;
    }
    createCards();
    initSettings();
    loop();
};
var loop = function () {
    updateTime();
    setTimeout(loop, 1000);
};
init();
