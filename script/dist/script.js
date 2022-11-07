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
var updateTime = function () {
    var timeElement = document.getElementById("time");
    if (timeElement !== null) {
        var currentTime = new Date().toLocaleTimeString();
        timeElement.innerHTML = currentTime;
    }
};
var init = function () {
    var currentDate = new Date().toISOString().slice(0, 10);
    var titleElement = document.getElementById("main-title");
    if (titleElement !== null) {
        titleElement.innerHTML = currentDate;
    }
    loop();
};
var loop = function () {
    updateTime();
    setTimeout(loop, 1000);
};
init();
