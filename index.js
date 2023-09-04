const DEFAULT_CELLS_PER_SIDE = 32;
const MAX_CELLS_PER_SIDE = 100;
const MESSAGE_DURATION = 3 * 1000;
let timerId = null;
let cellColor = document.getElementById("colorPicker").value;

init();

function init() {
  let adjustGridBtn = document.getElementById("adjustGridBtn");
  let toggleModeBtn = document.getElementById("toggleModeBtn");
  let colorPicker = document.getElementById("colorPicker");
  let saveBtn = document.getElementById("saveBtn");
  let loadBtn = document.getElementById("loadBtn");

  adjustGridBtn.addEventListener("click", handleAdjustGrid);
  toggleModeBtn.addEventListener("click", handleToggleMode);
  colorPicker.addEventListener("input", handleColorSelect);
  saveBtn.addEventListener("click", handleSave);
  loadBtn.addEventListener("click", handleLoad);

  let cellEvent =
    toggleModeBtn.getAttribute("data-mode") === "etch" ? "mouseover" : "click";

  populateGrid(DEFAULT_CELLS_PER_SIDE, DEFAULT_CELLS_PER_SIDE, cellEvent);
  populateSavedItems();
}

function populateSavedItems() {
  Object.keys(localStorage).forEach(function (key) {
    addSavedItem(key);
  });
}

function addSavedItem(key) {
  if (savedItemsContains(key)) return;

  let savedItems = document.getElementById("savedItems");
  let option = document.createElement("option");
  option.text = key;
  option.value = key;

  savedItems.add(option);
}

function savedItemsContains(key) {
  let savedItems = document.getElementById("savedItems");

  return Array.from(savedItems)
    .map((item) => item.value)
    .includes(key);
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
  cell.style.width = `${100 / rows}%`;
  cell.style.height = `${100 / cols}%`;
  cell.addEventListener(event, handleCellEvent);

  return cell;
}

function handleCellEvent(e) {
  e.target.style.backgroundColor = cellColor;
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
  let newEvent;
  let oldEvent;

  if (toggleModeBtn.getAttribute("data-mode") === "etch") {
    toggleModeBtn.setAttribute("data-mode", "click");
    toggleModeBtn.innerText = "Click Mode";
    newEvent = "click";
    oldEvent = "mouseover";
  } else {
    toggleModeBtn.setAttribute("data-mode", "etch");
    toggleModeBtn.innerText = "Etch Mode";
    newEvent = "mouseover";
    oldEvent = "click";
  }

  let grid = document.getElementById("grid");
  grid.childNodes.forEach((child) => {
    child.removeEventListener(oldEvent, handleCellEvent);
    child.addEventListener(newEvent, handleCellEvent);
  });

  setMessage(`Changed to ${toggleModeBtn.innerText}!`);
}

function handleColorSelect(e) {
  cellColor = e.target.value;
  setMessage(`Color changed to ${cellColor}!`);
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

function saveGrid(key) {
  const grid = document.getElementById("grid");

  const rows = grid.getAttribute("data-rows");
  const cols = grid.getAttribute("data-cols");
  const colors = Array.from(grid.childNodes).map(
    (cell) => cell.style.backgroundColor
  );

  localStorage.setItem(
    key,
    JSON.stringify({ rows: rows, cols: cols, colors: colors })
  );

  addSavedItem(key);
  setMessage(`Saved "${key}"!`);
}

function loadGrid(key) {
  let savedItem = localStorage.getItem(key);
  if (savedItem === null) return;

  let gridArray = JSON.parse(savedItem);
  let currentMode =
    document.getElementById("toggleModeBtn").getAttribute("data-mode") ===
    "etch"
      ? "mouseover"
      : "click";

  populateGrid(gridArray.rows, gridArray.cols, currentMode);

  let grid = document.getElementById("grid");
  grid.childNodes.forEach(
    (cell, index) => (cell.style.backgroundColor = gridArray.colors[index])
  );

  setMessage(`Loaded "${key}"!`);
}

function handleSave() {
  let key = prompt("Save as?");
  if (key === null) return;
  saveGrid(key);
}

function handleLoad() {
  let selection = document.getElementById("savedItems").value;
  if (!selection) return;
  if (confirm(`Load ${selection}?`)) loadGrid(selection);
}
