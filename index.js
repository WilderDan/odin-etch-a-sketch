main();

function main() {
  populateGrid(16, 16);

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
  removeAllChildNodes(grid);

  // TODO: Input validation
  let num = +prompt("Number of cells per side?");
  populateGrid(num, num);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
