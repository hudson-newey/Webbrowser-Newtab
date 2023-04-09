const draggableItems: NodeListOf<HTMLElement> = document.querySelectorAll(".draggable");
const containers = document.querySelectorAll(".container");

draggableItems.forEach((container: HTMLElement) => {
  container.addEventListener("dragstart", (e: any) => {
    container.classList.add("dragging");
  });

  container.addEventListener("dragend", (e: any) => {
    const afterElement = getDragAfterElement(containers[0], e.clientX);
    const draggingItem = document.querySelector(".dragging");

    if (!draggingItem) return;

    if (afterElement == null) {
      container.parentNode?.appendChild(draggingItem);
    } else {
      container.parentNode?.insertBefore(draggingItem, afterElement);
    }

    draggingItem.classList.remove("dragging");
  });
});

function getDragAfterElement(container: any, x: number) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      // TODO: the offset is no ideal
      // ideally we'd want to swap cards if any part of the card overlaps
      const offset = x - (box.left + (box.width / 2) + 10);
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
