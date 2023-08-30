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

  // Test
  div.style.backgroundColor = "blue";
  div.style.width = "50px";
  div.style.height = "50px";
  div.style.border = "1px solid black";

  return div;
}
