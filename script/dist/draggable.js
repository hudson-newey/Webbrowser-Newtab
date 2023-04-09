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
    container.addEventListener("dragstart", function (e) {
        container.classList.add("dragging");
    });
    container.addEventListener("dragend", function (e) {
        var _a, _b;
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
