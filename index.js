createGrid(16, 16);

function createGrid(rows, cols) {
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

  let cellContent = document.createElement("div");
  cellContent.classList.add("cellContent");

  cell.appendChild(cellContent);
  return cell;
}
