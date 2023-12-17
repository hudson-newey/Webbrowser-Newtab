var _a;
// this is completely local and private search history
// i have added this so that you get auto complete for your most searched terms
var searchHistoryKey = "search-history";
var searchHistoryQueries = ((_a = localStorage.getItem(searchHistoryKey)) === null || _a === void 0 ? void 0 : _a.split("|")) || [];
var searchHistorySpan = [];
var maxHistoryItems = 5;
var addToSearchHistory = function (searchTerm) {
    if (!searchHistoryQueries.includes(searchTerm)) {
        searchHistoryQueries.push(searchTerm);
        localStorage.setItem(searchHistoryKey, searchHistoryQueries.join("|"));
    }
};
var getHistory = function () {
    searchHistorySpan.push.apply(searchHistorySpan, searchHistoryQueries);
    searchHistorySpan.push.apply(searchHistorySpan, commonWebsites);
};
var searchHistory = function (searchTerm) {
    return searchHistorySpan
        .filter(function (item) { return item.includes(searchTerm); })
        .filter(function (item, index, self) { return self.indexOf(item) === index; })
        .slice(0, maxHistoryItems);
};
var clearHistory = function () {
    var searchHistoryItems = document.getElementById("search-history");
    searchHistoryItems.innerHTML = "";
};
var bindToInput = function () {
    var searchInput = document.getElementById("search-box");
    searchInput.addEventListener("input", function () {
        var searchTerm = searchInput.value;
        var historyItems = searchHistory(searchTerm);
        var historyList = document.getElementById("search-history");
        historyList.innerHTML = "";
        historyItems.forEach(function (item) {
            var listItem = document.createElement("p");
            listItem.innerText = item;
            listItem.addEventListener("click", function () {
                searchInput.value = item;
                search();
            });
            historyList.appendChild(listItem);
        });
    });
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            var searchTerm = searchInput.value;
            addToSearchHistory(searchTerm);
        }
    });
};
window.onload = function () {
    getHistory();
    bindToInput();
};
