// this is completely local and private search history
// i have added this so that you get auto complete for your most searched terms
const searchHistoryQueries: string[] = [];
const searchHistoryKey = "search-history";
const maxHistoryItems = 5;

const commonWebsites: string[] = [
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

const addToSearchHistory = (searchTerm: string) => {
  if (!searchHistoryQueries.includes(searchTerm)) {
    searchHistoryQueries.push(searchTerm);
    localStorage.setItem(searchHistoryKey, searchHistoryQueries.join("|"));
  }
};

const getHistory = (): void => {
  const history = localStorage.getItem(searchHistoryKey);
  
  if (history) {
    searchHistoryQueries.push(...history.split("|"));
  }
  
  searchHistoryQueries.push(...commonWebsites);
};

const searchHistory = (searchTerm: string): string[] => {
  return searchHistoryQueries
    .filter((item) => item.includes(searchTerm))
    .slice(0, maxHistoryItems);
};

const clearHistory = (): void => {
  const searchHistoryItems = document.getElementById(
    "search-history"
  ) as HTMLUListElement;
  searchHistoryItems.innerHTML = "";
  console.log("jhsjkdfhjk");
};

const bindToInput = (): void => {
  const searchInput = document.getElementById(
    "search-box"
  ) as HTMLInputElement;
  
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value;
    const historyItems = searchHistory(searchTerm);
    const historyList = document.getElementById(
      "search-history"
    ) as HTMLUListElement;
    
    historyList.innerHTML = "";

    historyItems.forEach((item) => {
      const listItem = document.createElement("p");

      listItem.innerText = item;
      listItem.addEventListener("click", () => {
        searchInput.value = item;
        search();
      });

      historyList.appendChild(listItem);
    });
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const searchTerm = searchInput.value;
      addToSearchHistory(searchTerm);
    }
  });
};

window.onload = () => {
  getHistory();
  bindToInput();
}
