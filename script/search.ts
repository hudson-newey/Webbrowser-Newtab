import { search } from "./script";
import { commonWebsites } from "./top-sites";

// this is completely local and private search history
// i have added this so that you get auto complete for your most searched terms
export const searchHistoryKey = "search-history";
export const searchHistoryQueries: string[] = localStorage.getItem(searchHistoryKey)?.split("|") || [];
export const searchHistorySpan: string[] = [];
export const maxHistoryItems = 5;

export function addToSearchHistory(searchTerm: string) {
  searchTerm = searchTerm.trim().toLowerCase();

  if (!searchHistoryQueries.includes(searchTerm)) {
    searchHistoryQueries.push(searchTerm);
    localStorage.setItem(searchHistoryKey, searchHistoryQueries.join("|"));
  }
}

export function getHistory(): void {
  searchHistorySpan.push(...searchHistoryQueries);
  searchHistorySpan.push(...commonWebsites);
}

export function searchHistory(searchTerm: string): string[] {
  searchTerm = searchTerm.trim().toLowerCase();

  if (searchTerm === undefined || searchTerm === null || searchTerm === "") {
    clearHistory();
    return [];
  }
  
  return searchHistorySpan
    .filter((item) => item.includes(searchTerm))
    .filter((item, index, self) => self.indexOf(item) === index)
    .slice(0, maxHistoryItems);
}

export function clearHistory(): void {
  const searchHistoryItems = document.getElementById(
    "search-history"
  ) as HTMLUListElement;
  searchHistoryItems.innerHTML = "";
}

export function bindToInput(): void {
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
}

getHistory();
bindToInput();
