var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var draggableItems = document.querySelectorAll(".draggable");
var containers = document.querySelectorAll(".container");
draggableItems.forEach(function (container) {
    container.addEventListener("dragstart", function () {
        container.classList.add("dragging");
    });
    container.addEventListener("dragend", function (e) {
        var _a, _b, _c, _d, _e, _f;
        var afterElement = getDragAfterElement(containers[0], e.clientX);
        var draggingItem = document.querySelector(".dragging");
        if (!draggingItem)
            return;
        if (afterElement == null) {
            (_a = container.parentNode) === null || _a === void 0 ? void 0 : _a.appendChild(draggingItem);
        }
        else {
            (_b = container.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(draggingItem, afterElement);
        }
        draggingItem.classList.remove("dragging");
        var currentCardOrder = getCookie(CARD_COOKIE_NAME);
        if (!currentCardOrder)
            return;
        var draggingCardUrl = (_d = (_c = draggingItem.querySelector("a")) === null || _c === void 0 ? void 0 : _c.href) === null || _d === void 0 ? void 0 : _d.replace(/\/+$/, "");
        if (!draggingCardUrl)
            return;
        var cards = currentCardOrder.split(",");
        var draggingCardIndex = cards.indexOf(draggingCardUrl);
        if (draggingCardIndex === -1)
            return;
        cards.splice(draggingCardIndex, 1);
        // swap the cards
        var afterElementUrl = (_f = (_e = afterElement.querySelector("a")) === null || _e === void 0 ? void 0 : _e.href) === null || _f === void 0 ? void 0 : _f.replace(/\/+$/, "");
        if (!afterElementUrl)
            return;
        var afterElementIndex = cards.indexOf(afterElementUrl);
        if (afterElementIndex === -1) {
            // add it to the end
            cards.push(draggingCardUrl);
        }
        else {
            cards.splice(afterElementIndex, 0, draggingCardUrl);
        }
        removeCookie(CARD_COOKIE_NAME);
        setCookie(CARD_COOKIE_NAME, cards.join(","));
    });
});
function getDragAfterElement(container, x) {
    var draggableElements = __spreadArrays(container.querySelectorAll(".draggable:not(.dragging)"));
    return draggableElements.reduce(function (closest, child) {
        var box = child.getBoundingClientRect();
        // TODO: the offset is no ideal
        // ideally we'd want to swap cards if any part of the card overlaps
        var offset = x - (box.left + (box.width / 2) + 10);
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        }
        else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
