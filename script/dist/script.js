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
