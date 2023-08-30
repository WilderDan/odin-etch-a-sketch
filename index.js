createGrid(16, 16);

function createGrid(rows, cols) {
  let container = document.getElementById("container");

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      container.appendChild(createCell());
    }
  }
}

function createCell() {
  let div = document.createElement("div");
  div.classList.add("cell");
  return div;
}
