const DEFAULT_CELLS_PER_SIDE = 32;
const MAX_CELLS_PER_SIDE = 100;
const MESSAGE_DURATION = 3 * 1000;
let timerId = null;

init();

function init() {
  let adjustGridBtn = document.getElementById("adjustGridBtn");
  let toggleModeBtn = document.getElementById("toggleModeBtn");
  let selectColorBtn = document.getElementById("selectColorBtn");

  adjustGridBtn.addEventListener("click", handleAdjustGrid);
  toggleModeBtn.addEventListener("click", handleToggleMode);
  selectColorBtn.addEventListener("click", handleColorSelect);

  let cellEvent =
    toggleModeBtn.getAttribute("data-mode") === "etch" ? "mouseover" : "click";

  populateGrid(DEFAULT_CELLS_PER_SIDE, DEFAULT_CELLS_PER_SIDE, cellEvent);
}

function populateGrid(rows, cols, cellEvent) {
  let grid = document.getElementById("grid");
  removeAllChildNodes(grid);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid.appendChild(createCell(rows, cols, cellEvent));
    }
  }

  grid.setAttribute("data-rows", rows);
  grid.setAttribute("data-cols", cols);
}

function createCell(rows, cols, event) {
  let cell = document.createElement("div");

  cell.classList.add("cell");
  cell.style.flexBasis = `${100 / rows}%`;
  cell.style.height = `${100 / cols}%`;
  cell.addEventListener(event, handleCellEvent);

  return cell;
}

function handleCellEvent(e) {
  e.target.classList.add("cellInteraction");
}

function handleAdjustGrid() {
  let grid = document.getElementById("grid");

  let num = getValidatedUserInput();
  if (num === null) return;

  let cellEvent =
    toggleModeBtn.getAttribute("data-mode") === "etch" ? "mouseover" : "click";

  populateGrid(num, num, cellEvent);
  setMessage(`Grid changed to ${num} x ${num}`);
}

function handleToggleMode() {
  let toggleModeBtn = document.getElementById("toggleModeBtn");
  let cellEvent;

  if (toggleModeBtn.getAttribute("data-mode") === "etch") {
    toggleModeBtn.setAttribute("data-mode", "click");
    toggleModeBtn.innerText = "Click Mode";
    cellEvent = "click";
  } else {
    toggleModeBtn.setAttribute("data-mode", "etch");
    toggleModeBtn.innerText = "Etch Mode";
    cellEvent = "mouseover";
  }

  let grid = document.getElementById("grid");
  populateGrid(
    +grid.getAttribute("data-rows"),
    +grid.getAttribute("data-cols"),
    cellEvent
  );
}

function handleColorSelect() {
  console.log("color select");
}

function getValidatedUserInput() {
  const input = +prompt("Number of cells per side?");

  if (isNaN(input)) {
    setMessage("Not a number! No change.");
    return null;
  }

  if (input < 0) {
    setMessage("Negative input! No change.");
    return null;
  }

  if (input === 0) {
    setMessage("Zero input! No change.");
    return null;
  }

  if (input > MAX_CELLS_PER_SIDE) {
    setMessage(`Input too high! Setting to max of ${MAX_CELLS_PER_SIDE}.`);
    return MAX_CELLS_PER_SIDE;
  }

  return input;
}

function setMessage(text) {
  let message = document.getElementById("message");
  clearTimeout(timerId);

  message.innerText = text;
  timerId = setTimeout(() => (message.innerText = "\u00A0"), MESSAGE_DURATION);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
