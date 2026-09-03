// modules/dragdrop.js
export function enableDragDrop(container) {
  container.addEventListener("dragstart", onDragStart);
  container.addEventListener("dragover", onDragOver);
  container.addEventListener("drop", onDrop);
}

function onDragStart(e) {
  e.dataTransfer.setData("id", e.target.dataset.id);
}

function onDragOver(e) {
  e.preventDefault();
}

function onDrop(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData("id");
  const dragged = document.querySelector(`[data-id="${id}"]`);
  e.target.appendChild(dragged);
}
