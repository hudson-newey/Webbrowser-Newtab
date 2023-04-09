var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var draggables = document.querySelectorAll('.draggable');
var containers = document.querySelectorAll('.container');
draggables.forEach(function (draggable) {
    draggable.addEventListener("dragstart", function () {
        draggable.classList.add('dragging');
    });
    draggable.addEventListener("dragend", function () {
        draggable.classList.remove('dragging');
    });
});
containers.forEach(function (container) {
    container.addEventListener("dragover", function (e) {
        e.preventDefault();
        var afterElement = getDragAfterElement(container, e.clientX);
        var draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(draggable);
        }
        else {
            container.insertBefore(draggable, afterElement);
        }
    });
});
function getDragAfterElement(container, x) {
    var draggableElements = __spreadArrays(container.querySelectorAll('.draggable:not(.dragging)'));
    return draggableElements.reduce(function (closest, child) {
        var box = child.getBoundingClientRect();
        var offset = x - (box.left + box.width / 2);
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        }
        else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
