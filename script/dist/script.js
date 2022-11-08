// globals
var CARD_COOKIE_NAME = "cards";
// helper functions
var deleteCookie = function (cookieName) {
    return document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
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
    var searchEngine = "https://search.brave.com/search?q=";
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
    console.log(newCardURL);
    var existingCards = getCookie(CARD_COOKIE_NAME);
    setCookie(CARD_COOKIE_NAME, existingCards + "," + newCardURL);
    window.location.reload();
};
var createCards = function () {
    var _a;
    var historicalCards = getCookie(CARD_COOKIE_NAME);
    var cards = historicalCards === null || historicalCards === void 0 ? void 0 : historicalCards.split(",");
    if (cards !== undefined && (cards === null || cards === void 0 ? void 0 : cards.length) > 0) {
        cards.forEach(function (card) {
            var _a;
            if (card !== undefined && card !== "undefined") {
                var faviconURL = "https://" + card.split("/")[2] + "/favicon.ico";
                var newCardObj = document.createElement("a");
                newCardObj.href = card;
                newCardObj.className = "fav";
                newCardObj.innerHTML = "<img  src=\"" + faviconURL + "\">";
                (_a = document.getElementById("card-container")) === null || _a === void 0 ? void 0 : _a.appendChild(newCardObj);
            }
        });
    }
    // "plus card" card
    var plusCardObj = document.createElement("a");
    plusCardObj.onclick = function () { addCard(); };
    plusCardObj.id = "add-card-icon";
    plusCardObj.href = "#";
    plusCardObj.className = "fav";
    plusCardObj.innerHTML = "+";
    (_a = document.getElementById("card-container")) === null || _a === void 0 ? void 0 : _a.appendChild(plusCardObj);
};
// async processes
var updateTime = function () {
    var timeElement = document.getElementById("time");
    if (timeElement !== null) {
        var dateObject = new Date();
        var currentTime = (dateObject.getHours() > 12 ? dateObject.getHours() - 12 : dateObject.getHours()) + ":" + dateObject.getMinutes();
        if (currentTime.length < 5) {
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
