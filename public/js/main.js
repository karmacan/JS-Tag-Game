const domFills = document.querySelectorAll('.fill');

let heldCell = null;

domFills.forEach(domFill => {
  domFill.addEventListener('dragstart', handFillDragStart);
  domFill.addEventListener('dragend', handFillDragEnd);
});

function handFillDragStart() {
  heldCell = this;
  this.classList.add('held');
  setTimeout(() => this.className = 'invisible', 0);
}

function handFillDragEnd() {
  heldCell = null;
  this.className = 'fill';
}

////////////////////////////////////////

const domCells = document.querySelectorAll('.cell');

// Template of actual matrix /* cells[row][col] */
const cells = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];

for (const domCell of domCells) {
  domCell.addEventListener('dragover', handCellDragOver);
  domCell.addEventListener('dragenter', handCellDragEnter);
  domCell.addEventListener('dragleave', handCellDragLeave);
  domCell.addEventListener('drop', handCellDrop);
}

function handCellDragOver(ev) {
  if (!this.classList.contains('empty')) return;
  ev.preventDefault(); // let drop event fired
}
function handCellDragEnter(ev) {
  if (!this.classList.contains('empty')) return;
  this.classList.add('hovered');
}
function handCellDragLeave() {
  if (!this.classList.contains('empty')) return;
  this.classList.remove('hovered');
}
function handCellDrop() {
  if (!this.classList.contains('empty')) return;
  this.classList.remove('hovered'); // remove dashed
  
  const heldCellOrigin = heldCell.parentElement;
  const cellOriginId = parseInt(heldCellOrigin.id);
  const cellDropId = parseInt(this.id);

  // Check if neighbors
  if (!getNeighborsIds(domCells, cells, cellOriginId).find(val => val === cellDropId)) return;
  
  heldCellOrigin.classList.add('empty');
  this.classList.remove('empty');

  this.append(heldCell);
}