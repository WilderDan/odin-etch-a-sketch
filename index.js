const DEFAULT_CELLS_PER_SIDE = 32;
const MAX_CELLS_PER_SIDE = 100;
const MESSAGE_DURATION = 3 * 1000;
let timerId = null;
let cellColor = document.getElementById("colorPicker").value;
let isMouseDown = false;

init();

function init() {
  let adjustGridBtn = document.getElementById("adjustGridBtn");
  let colorPicker = document.getElementById("colorPicker");
  let saveBtn = document.getElementById("saveBtn");
  let loadBtn = document.getElementById("loadBtn");
  let gridLineToggle = document.getElementById("gridLineToggle");

  adjustGridBtn.addEventListener("click", handleAdjustGrid);
  colorPicker.addEventListener("input", handleColorSelect);
  saveBtn.addEventListener("click", handleSave);
  loadBtn.addEventListener("click", handleLoad);
  gridLineToggle.addEventListener("change", applyBorderStyle);

  window.addEventListener("mousedown", () => (isMouseDown = true));
  window.addEventListener("mouseup", () => (isMouseDown = false));

  populateGrid(DEFAULT_CELLS_PER_SIDE, DEFAULT_CELLS_PER_SIDE);
  populateSavedItems();
}

function applyBorderStyle() {
  let borderStyle = document.getElementById("gridLineToggle").checked
    ? "1px solid black"
    : 0;
  let grid = document.getElementById("grid");

  grid.childNodes.forEach((cell) => (cell.style.border = borderStyle));
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

function populateGrid(rows, cols) {
  let grid = document.getElementById("grid");
  removeAllChildNodes(grid);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid.appendChild(createCell(rows, cols));
    }
  }
  applyBorderStyle();

  grid.setAttribute("data-rows", rows);
  grid.setAttribute("data-cols", cols);
}

function createCell(rows, cols, event) {
  let cell = document.createElement("div");

  cell.classList.add("cell");
  cell.style.width = `${100 / rows}%`;
  cell.style.height = `${100 / cols}%`;
  cell.addEventListener("mouseenter", handleCellMouseEnter);
  cell.addEventListener("mousedown", handleCellMouseDown);

  return cell;
}

function handleCellMouseEnter(e) {
  if (isMouseDown) e.target.style.backgroundColor = cellColor;
}

function handleCellMouseDown(e) {
  e.target.style.backgroundColor = cellColor;
}

function handleAdjustGrid() {
  let grid = document.getElementById("grid");

  let num = getValidatedUserInput();
  if (num === null) return;

  populateGrid(num, num);
  setMessage(`Grid changed to ${num} x ${num}`);
}

function handleColorSelect(e) {
  cellColor = e.target.value;
  setMessage(`Color changed to ${cellColor}!`);
}

function getValidatedUserInput() {
  const input = Math.floor(+prompt("Number of cells per side?"));

  if (isNaN(input)) {
    setMessage(
      `Not a number! Enter integer between 1 and ${MAX_CELLS_PER_SIDE}`
    );
    return null;
  }

  if (input <= 0) {
    setMessage(`Too low! Enter integer between 1 and ${MAX_CELLS_PER_SIDE}`);
    return null;
  }

  if (input > MAX_CELLS_PER_SIDE) {
    setMessage(`Too High! Enter integer between 1 and ${MAX_CELLS_PER_SIDE}`);
    return null;
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

  let grid = JSON.parse(savedItem);

  populateGrid(grid.rows, grid.cols);

  let gridElem = document.getElementById("grid");
  gridElem.childNodes.forEach(
    (cell, index) => (cell.style.backgroundColor = grid.colors[index])
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
