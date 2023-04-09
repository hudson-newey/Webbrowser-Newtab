"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var draggables = document.querySelectorAll(".draggable");
var containers = document.querySelectorAll(".container");
draggables.forEach(function (container) {
  container.addEventListener("dragstart", function () {
    container.classList.add("dragging");
  });
  container.addEventListener("dragend", function (e) {
    e.preventDefault();
    var afterElement = getDragAfterElement(container, e.clientX);
    var draggable = document.querySelector(".dragging");

    if (afterElement == null) {
      container.parentNode.appendChild(draggable);
    } else {
      container.parentNode.insertBefore(draggable, afterElement);
    }

    draggable.classList.remove("dragging");
  });
});

function getDragAfterElement(container, x) {
  var draggableElements = _toConsumableArray(container.querySelectorAll(".draggable:not(.dragging)"));

  return draggableElements.reduce(function (closest, child) {
    var box = child.getBoundingClientRect();
    var offset = x - (box.left + box.width / 2);

    if (offset < 0 && offset > closest.offset) {
      return {
        offset: offset,
        element: child
      };
    } else {
      return closest;
    }
  }, {
    offset: Number.NEGATIVE_INFINITY
  }).element;
}