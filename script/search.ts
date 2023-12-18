// this is completely local and private search history
// i have added this so that you get auto complete for your most searched terms
const searchHistoryKey = "search-history";
const searchHistoryQueries: string[] = localStorage.getItem(searchHistoryKey)?.split("|") || [];
const searchHistorySpan: string[] = [];
const maxHistoryItems = 5;

const addToSearchHistory = (searchTerm: string) => {
  searchTerm = searchTerm.trim().toLowerCase();

  if (!searchHistoryQueries.includes(searchTerm)) {
    searchHistoryQueries.push(searchTerm);
    localStorage.setItem(searchHistoryKey, searchHistoryQueries.join("|"));
  }
};

const getHistory = (): void => {
  searchHistorySpan.push(...searchHistoryQueries);
  searchHistorySpan.push(...commonWebsites);
};

const searchHistory = (searchTerm: string): string[] => {
  searchTerm = searchTerm.trim().toLowerCase();
  
  return searchHistorySpan
    .filter((item) => item.includes(searchTerm))
    .filter((item, index, self) => self.indexOf(item) === index)
    .slice(0, maxHistoryItems);
};

const clearHistory = (): void => {
  const searchHistoryItems = document.getElementById(
    "search-history"
  ) as HTMLUListElement;
  searchHistoryItems.innerHTML = "";
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
