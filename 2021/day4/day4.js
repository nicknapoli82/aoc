let fs = require('fs');

function consumeNumbersFromString(str) {
  str = str.trim();
  let result = [];
  for (let i = 0; i < str.length;) {
    result.push(Number.parseInt(str.slice(i)));
    while ((str[i]) !== ' ' && i < str.length) i++;
    while ((str[i]) === ' ' && i < str.length) i++;
  }
  return result;
}

class Board {
  constructor(boardString) {
    this.board = [];
    for (let row of boardString) {
      row = consumeNumbersFromString(row);
      this.board[this.board.length] = row.map(e => Number(e));
    }

    this.found = this.board.map(e => e.map(_ => false));

  }

  checkColumn(y) {
    for (let itt = 0; itt < this.found.length; itt++) {
      if (this.found[y][itt] === false) return false;
    }
    return true;
  }

  checkRow(x) {
    for (let itt = 0; itt < this.found.length; itt++) {
      if (this.found[itt][x] === false) return false;
    }
    return true;
  }

  resetFound() {
    for (let row of this.found) {
      for (let f of row) {
        f = false;
      }
    }
  }

  checkUpdateNumber(num) {
    let result = false;
    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board[y].length; x++) {
        if (this.board[y][x] === num) {
          this.found[y][x] = true;
          if (this.checkColumn(y) || this.checkRow(x))
            return true;
        }
      }
    }
    return false;
  }

  sumUnfoundNumbers() {
    let result = 0;
    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board[y].length; x++) {
        if (this.found[y][x] === false) {
          result += this.board[y][x];
        }
      }
    }
    return result;
  }
}

let input = fs.readFileSync('input.txt').toString().split('\n');

let numbersDrawn = input[0].split(',').map(n => Number.parseInt(n));

input = input.slice(2);
let boardStrings = [];
for (let i = 0; i < input.length; i++) {
  boardStrings[boardStrings.length] = [];
  while (input[i] !== '' && input[i] !== undefined) {
    boardStrings[boardStrings.length - 1].push(input[i]);
    i++;
  }
}

let boards = boardStrings.map(e => new Board(e));
let star1 = 0;
let drawn = 0;
for (let n of numbersDrawn) {
  for (let b of boards) {
    if (b.checkUpdateNumber(n)) {
      star1 = b.sumUnfoundNumbers();
      drawn = n;
      break;
    }
  }
  if (star1 !== 0)
    break;
}

console.log(star1 * drawn);

drawn = 0;
let lastBoard = null;

for (let b of boards)
  b.resetFound();

for (let n of numbersDrawn) {
  for (let b of boards) {
    if (b.checkUpdateNumber(n)) {
      drawn = n;
      lastBoard = b;
    }
  }
  boards = boards.filter(b => b.checkUpdateNumber(n) === false);
}

console.log(lastBoard.sumUnfoundNumbers() * drawn);
