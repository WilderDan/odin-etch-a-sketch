const DEFAULT_CELLS_PER_SIDE = 64;
const MAX_CELLS_PER_SIDE = 100;

main();

function main() {
  populateGrid(DEFAULT_CELLS_PER_SIDE, DEFAULT_CELLS_PER_SIDE);

  let adjustGridBtn = document.getElementById("adjustGridBtn");
  adjustGridBtn.addEventListener("click", handleAdjustGrid);
}

function populateGrid(rows, cols) {
  let grid = document.getElementById("grid");

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      grid.appendChild(createCell(rows, cols));
    }
  }
}

function createCell(rows, cols) {
  let cell = document.createElement("div");

  cell.classList.add("cell");
  cell.style.flexBasis = `${100 / rows}%`;
  cell.style.height = `${100 / cols}%`;
  cell.addEventListener("mouseover", handleMouseOverCell);

  return cell;
}

function handleMouseOverCell(e) {
  e.target.classList.add("cellHovered");
}

function handleAdjustGrid() {
  let grid = document.getElementById("grid");

  let num = getValidatedUserInput();
  if (num === 0) return;

  removeAllChildNodes(grid);
  populateGrid(num, num);
}

function getValidatedUserInput() {
  let message = document.getElementById("message");
  const input = +prompt("Number of cells per side?");

  if (isNaN(input)) {
    message.innerText = "Not a number! No change.";
    return 0;
  }

  if (input < 0) {
    message.innerText = "Negative input! No change.";
    return 0;
  }

  if (input > MAX_CELLS_PER_SIDE) {
    message.innerText = `Input too high! Setting to max of ${MAX_CELLS_PER_SIDE}.`;
    return MAX_CELLS_PER_SIDE;
  }

  message.innerText = "";
  return input;
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
