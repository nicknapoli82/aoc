class Octopus {
  constructor(num) {
    this.energyLevel = Number.parseInt(num);
    this.neighbors = new Set();
    this.didFlah = false;
  }

  addNeighbors(board, row, column) {
    let bounds = boundsCheck(row, column, board.length, board[0].length);
    bounds.above && bounds.left ? this.neighbors.add(board[row - 1][column - 1]) : null;
    bounds.above ? this.neighbors.add(board[row - 1][column]) : null;
    bounds.above && bounds.right ? this.neighbors.add(board[row - 1][column + 1]) : null;
    bounds.left ? this.neighbors.add(board[row][column - 1]) : null;
    bounds.right ? this.neighbors.add(board[row][column + 1]) : null;
    bounds.below && bounds.left ? this.neighbors.add(board[row + 1][column - 1]) : null;
    bounds.below ? this.neighbors.add(board[row + 1][column]) : null;
    bounds.below && bounds.right ? this.neighbors.add(board[row + 1][column + 1]) : null;
  }
}

let fs = require('fs');

let octos = fs.readFileSync('input').toString().split('\n').map(line => line.split(''));

function boundsCheck(row, column, limitR, limitC) {
  return { above: row - 1 >= 0, below: row + 1 < limitR, left: column - 1 >= 0, right: column + 1 < limitC };
}

for (let row = 0; row < octos.length; row++) {
  for (let column = 0; column < octos[row].length; column++) {
    octos[row][column] = new Octopus(octos[row][column]);
  }
}

for (let row = 0; row < octos.length; row++) {
  for (let column = 0; column < octos[row].length; column++) {
    octos[row][column].addNeighbors(octos, row, column);
  }
}

let totalFlashes = 0;
let allFlashedCount = 0;
for (let i = 0, allFlashed = false; allFlashed === false; i++) {
  let flashList = [];
  for (let row of octos) {
    for (let o of row) {
      o.energyLevel++;
      o.didFlah = false;
      if (o.energyLevel > 9) {
        o.energyLevel = 0;
        flashList.push(o);
      }
    }
  }
  while (flashList.length) {
    let o = flashList.pop();
    o.didFlah = true;
    totalFlashes++;
    for (let n of o.neighbors.values()) {
      if (n.energyLevel === 0)
        continue;
      n.energyLevel++;
      if (n.energyLevel > 9) {
        n.energyLevel = 0;
        flashList.push(n);
      }
    }
  }

  allFlashed = true;
  for (let row of octos) {
    for (let o of row) {
      if (o.didFlah === false) {
        allFlashed = false;
        break;
      }
    }
    if (allFlashed === false)
      break;
  }
  if (allFlashed === true)
    allFlashedCount = i;
}

console.log(totalFlashes);
console.log(allFlashedCount);
