createGrid(0, 0);

function createGrid(rows, cols) {
  let container = document.getElementById("container");
  container.appendChild(createCell());
}

function createCell() {
  let div = document.createElement("div");

  // Test
  div.style.backgroundColor = "blue";
  div.style.width = "50px";
  div.style.height = "50px";

  return div;
}
