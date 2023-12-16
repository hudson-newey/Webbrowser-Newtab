// this is completely local and private search history
// i have added this so that you get auto complete for your most searched terms
var searchHistoryQueries = [];
var searchHistoryKey = "search-history";
var maxHistoryItems = 5;
var commonWebsites = [
    "https://www.google.com",
    "https://www.youtube.com",
    "https://www.facebook.com",
    "https://www.wikipedia.org",
    "https://www.reddit.com",
    "https://www.amazon.com",
    "https://www.twitter.com",
    "https://www.ebay.com",
    "https://www.netflix.com",
    "https://www.instagram.com",
    "https://www.linkedin.com",
    "https://www.microsoft.com",
    "https://www.apple.com",
    "https://www.imdb.com",
    "https://www.pinterest.com",
    "https://www.paypal.com",
    "https://www.espn.com",
    "https://www.bing.com",
    "https://www.office.com",
    "https://www.fandom.com",
    "https://www.craigslist.org",
    "https://www.nytimes.com",
    "https://www.tumblr.com",
    "https://www.quora.com",
    "https://www.walmart.com",
    "https://www.bbc.com",
    "https://www.live.com",
    "https://www.stackoverflow.com",
    "https://www.msn.com",
    "https://www.target.com",
    "https://www.etsy.com",
    "https://www.nih.gov",
    "https://www.washingtonpost.com",
    "https://www.dropbox.com",
    "https://www.chase.com",
    "https://www.weather.com",
    "https://www.npr.org",
    "https://www.usatoday.com",
    "https://www.homedepot.com",
    "https://www.bloomberg.com",
    "https://www.forbes.com",
    "https://www.cnn.com",
    "https://www.foxnews.com",
    "https://www.roblox.com",
    "https://www.buzzfeed.com",
    "https://www.bestbuy.com",
    "https://www.webmd.com",
    "https://www.zillow.com",
    "https://github.com",
];
var addToSearchHistory = function (searchTerm) {
    if (!searchHistoryQueries.includes(searchTerm)) {
        searchHistoryQueries.push(searchTerm);
        localStorage.setItem(searchHistoryKey, searchHistoryQueries.join("|"));
    }
};
var getHistory = function () {
    var history = localStorage.getItem(searchHistoryKey);
    if (history) {
        searchHistoryQueries.push.apply(searchHistoryQueries, history.split("|"));
    }
    searchHistoryQueries.push.apply(searchHistoryQueries, commonWebsites);
};
var searchHistory = function (searchTerm) {
    return searchHistoryQueries
        .filter(function (item) { return item.includes(searchTerm); })
        .slice(0, maxHistoryItems);
};
var clearHistory = function () {
    var searchHistoryItems = document.getElementById("search-history");
    searchHistoryItems.innerHTML = "";
    console.log("jhsjkdfhjk");
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
