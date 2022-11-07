let search = () => {
  const searchTerm: string | null = (document.getElementById("search-box") as HTMLInputElement)?.value;
  const searchEngine: string = "https://search.brave.com/search?q=";

  if (searchTerm !== null) {
    if (searchTerm.includes("://")) {
      document.location.href = searchTerm;
    } else {
      document.location.href = `${searchEngine}${searchTerm}`;
    }
  }
}

let shouldSearch = (event: KeyboardEvent) => {
  const key=event.keyCode || event.which;
  if (key==13){
    search();
  }
}

let updateTime = () => {
  let timeElement: HTMLElement | null = document.getElementById("time");
  if (timeElement !== null) {
    const currentTime = new Date().toLocaleTimeString();
    timeElement.innerHTML = currentTime;
  }
}

let init = () => {
  const currentDate = new Date().toISOString().slice(0, 10);
  const titleElement: HTMLElement | null = document.getElementById("main-title");

  if (titleElement !== null) {
    titleElement.innerHTML = currentDate;
  }

  loop();
}

let loop = () => {
  updateTime();
  setTimeout(loop, 1000);
}

init();
