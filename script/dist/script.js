// globals
var CARD_COOKIE_NAME = "cards";
var SUPPORTED_PROTOCOLS = ["https://", "http://", "ftp://", "file:///", "chrome-extension://", ""];
// helper functions
var setCookie = function (cookieName, cookieContent, exDays) {
    if (exDays === void 0) { exDays = 365; }
    var dateObject = new Date();
    dateObject.setTime(dateObject.getTime() + (exDays * 24 * 60 * 60 * 1000));
    var expires = dateObject.toUTCString();
    document.cookie = cookieName + "=" + cookieContent + ";expires=" + expires + ";path=/";
};
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
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
var search = function () {
    var _a;
    var searchTerm = (_a = document.getElementById("search-box")) === null || _a === void 0 ? void 0 : _a.value;
    var searchEngine = "https://www.google.com/search?q=";
    if (searchTerm !== null) {
        if (searchTerm.includes("://")) {
            document.location.href = searchTerm;
        }
        else {
            document.location.href = "" + searchEngine + searchTerm;
        }
    }
};
var shouldSearch = function (event) {
    var key = event.keyCode || event.which;
    if (key == 13) {
        search();
    }
};
// user defined cards
var addCard = function () {
    var newCardURL = prompt("Website URL", "https://www.google.com/");
    if (newCardURL === null || newCardURL === undefined || newCardURL === "") {
        return;
    }
    // check that the URL is valid
    var foundSupportedProtocol = false;
    SUPPORTED_PROTOCOLS.forEach(function (protocol) {
        if (newCardURL.includes(protocol)) {
            foundSupportedProtocol = true;
        }
    });
    if (!foundSupportedProtocol) {
        alert("Web protocol not supported...");
        return;
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
    if (id !== null) {
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
    newCardObj.className = "fav";
    var newCardLink = document.createElement("a");
    newCardLink.href = cardURL;
    if (eventFunction !== undefined) {
        newCardObj.onclick = function () { eventFunction(); };
    }
    // use the Google favicon service
    if (img === undefined) {
        newCardLink.innerHTML = "<img src=\"https://s2.googleusercontent.com/s2/favicons?domain_url=" + faviconURL + "\" alt=\"" + cardURL.replace("https://", "") + "\">";
    }
    else {
        newCardLink.innerHTML = "<img src=\"" + faviconURL + "\" alt=\"" + cardURL.replace("https://", "") + "\">";
    }
    var removeButton = document.createElement("button");
    ;
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
    createCard("#", "https://cdn.iconscout.com/icon/free/png-256/add-plus-3114469-2598247.png", function () { return addCard(); }, false);
};
// async processes
var updateTime = function () {
    var timeElement = document.getElementById("time");
    if (timeElement !== null) {
        var dateObject = new Date();
        var currentTime = (dateObject.getHours() > 12 ? dateObject.getHours() - 12 : dateObject.getHours()) + ":" + dateObject.getMinutes();
        if (currentTime.length < 5) {
            if (currentTime.length < 4) {
                currentTime = currentTime.split(":")[0] + ":0" + currentTime.split(":")[1];
            }
            currentTime = "0" + currentTime;
        }
        timeElement.innerHTML = currentTime;
    }
};
var init = function () {
    var currentDate = new Date().toISOString().slice(0, 10);
    var titleElement = document.getElementById("main-title");
    if (titleElement !== null) {
        titleElement.innerHTML = currentDate;
    }
    createCards();
    loop();
};
var loop = function () {
    updateTime();
    setTimeout(loop, 1000);
};
init();
