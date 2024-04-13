// because Vite tree shakes unused functions and does not check in the html files
// to see if they are referenced, I found that functions were being removed from the
// final build. To fix this, I created a bindings.ts file that binds the functions to events

import { changeCalendarProvider, changeInstantAnswersSetting, changeSearchEngine, closeSettings, getAndAddCardFromInput, hideCardInput, openSettings, shouldAddNewCardFromInput, shouldSearch, updateBackground } from "./script";

document.getElementById("hide-card-input-btn")?.addEventListener("click", () => {
	hideCardInput();
});

document.getElementById("add-card-btn")?.addEventListener("click", () => {
	getAndAddCardFromInput();
});

document.getElementById("new-card-url-input")?.addEventListener("keyup", (e) => {
	shouldAddNewCardFromInput(e);
});

document.getElementById("show-instant-answers-setting")?.addEventListener("change", () => {
	changeInstantAnswersSetting();
});

document.getElementById("update-background-btn")?.addEventListener("click", () => {
	updateBackground();
});

document.getElementById("calendar-providers")?.addEventListener("change", () => {
	changeCalendarProvider();
});

document.getElementById("search-engines")?.addEventListener("change", () => {
	changeSearchEngine();
});

document.getElementById("settings-toggle-btn")?.addEventListener("click", () => {
	openSettings();
});

document.getElementById("close-settings-btn")?.addEventListener("click", () => {
	closeSettings();
});

document.getElementById("search-box")?.addEventListener("keyup", (e) => {
	shouldSearch(e);
});
