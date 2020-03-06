// Score dom elements
const domMovesDisplay = document.querySelector('.moves');
const domTimeDisplay = document.querySelector('.time');

// Board dom elements
const domCells = document.querySelectorAll('.cell'); // object
let domFills;

// Current held cell
let heldCell = null;

// Score vars
let moves = 0;
let h = 0;
let m = 0;
let s = 0;

// Set interval pause
let isSetIntervalPaused = false;

// Template of actual matrix /* cells[row][col] */
const cells = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
];

// Window on load
window.addEventListener('load', () => {
  fillCells(domCells);

  for (const domCell of domCells) {
    domCell.addEventListener('dragover', handCellDragOver);
    domCell.addEventListener('dragenter', handCellDragEnter);
    domCell.addEventListener('dragleave', handCellDragLeave);
    domCell.addEventListener('drop', handCellDrop);
  }
});

// Display time
setInterval(async () => {
  if (isSetIntervalPaused) return;
  s++;
  if (s / 60 === 1) { s = 0; m++ }
  if (m / 60 === 1) { m = 0; h++ }
  if (h === 0 && m === 0) domTimeDisplay.textContent = s;
  else if (h === 0) domTimeDisplay.textContent = `${m}:${s}`;
  else domTimeDisplay.textContent = `${h}:${m}:${s}`;
}, 1000);

// On cell drop
function makeMove() {
  moves++;
  domMovesDisplay.textContent = moves;
  let isWon = true;
  for (const domCell of domCells) {
    if (!domCell.firstElementChild) continue;
    if (domCell.id !== domCell.firstElementChild.id) {
      isWon = false;
      break;
    }
  }
  if (isWon) {
    setAlert();
  }
}

// On win
function setAlert() {
  isSetIntervalPaused = true;
  const alert = document.createElement('div');
  alert.className = 'alert';
  alert.innerHTML = `
    <div>
      <h2>Победа</h2>
      <p>Поздравляю, вы победили!</p>
    </div>
  `;
  document.querySelector('body').append(alert);
  
  setTimeout(() => {
    document.querySelector('body').removeChild(alert);
    fillCells(domCells);
    moves = 0;
    domMovesDisplay.textContent = moves;
    h = 0; m = 0; s = 0;
    domTimeDisplay.textContent = s;
    isSetIntervalPaused = false;
  }, 3000);
}

// Fill cells
function fillCells(domCells) {
  for (const domCell of domCells) {
    domCell.innerHTML = null;
    domCell.className = 'cell';
  }

  domCells[domCells.length - 1].classList.add('empty');

  generateUniqueRandomArray(15).forEach((val, i) => {
    domCells[i].innerHTML = `
      <div class="fill" draggable="true" id="${val}"><span>${val}</span></div>
    `;
  });

  domFills = document.querySelectorAll('.fill');

  domFills.forEach(domFill => {
    domFill.addEventListener('dragstart', handFillDragStart);
    domFill.addEventListener('dragend', handFillDragEnd);
  });
}

// Handle fill drag start
function handFillDragStart() {
  //console.log('drag');
  heldCell = this;
  this.classList.add('held');
  setTimeout(() => this.className = 'invisible', 0);
}

// Handle fill drag end
function handFillDragEnd() {
  heldCell = null;
  this.className = 'fill';
}

// Handle cell drag over
function handCellDragOver(ev) {
  if (!this.classList.contains('empty')) return;

  ev.preventDefault(); // let drop event fired
}

// Handle cell drag enter
function handCellDragEnter() {
  if (!this.classList.contains('empty')) return;

  // Check if neighbors
  if (getNeighborsIds(domCells, cells, parseInt(heldCell.parentElement.id)).find(val => val === parseInt(this.id))) {
    this.classList.add('hovered');
  }
  else {
    this.classList.add('hovered-invalid');
    return;
  }
}

// Handle cell drag leave
function handCellDragLeave() {
  if (!this.classList.contains('empty')) return;

  this.className = 'cell empty'; // removes .hovered or .hovered-invalid
}

// Handle cell drop (!!!)
function handCellDrop() {
  if (!this.classList.contains('empty')) return;

  this.className = 'cell empty'; // removes .hovered or .hovered-invalid

  const heldCellOrigin = heldCell.parentElement;

  // Check if not neighbors
  if (!getNeighborsIds(domCells, cells, parseInt(heldCellOrigin.id)).find(val => val === parseInt(this.id))) return;
  
  heldCellOrigin.classList.add('empty');
  this.classList.remove('empty');

  this.append(heldCell);

  makeMove();
}