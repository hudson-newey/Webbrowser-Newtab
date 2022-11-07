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
