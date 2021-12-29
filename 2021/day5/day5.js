let fs = require('fs');

let input = fs.readFileSync('input.txt').toString().split('\n');

function lineFromString(str) {
  let [p1, p2] = str.split(' -> ');
  return { p1, p2 };
}

function point(str) {
  let [x, y] = str.split(',').map(e => Number.parseInt(e));
  return { x, y };
}

function getLine(str1, str2) {
  return { p1: point(str1), p2: point(str2) };
}

function greatestPoints(lines) {
  let greatestX = 0;
  let greatestY = 0;
  for (let { p1, p2 } of lines) {
    if (p1.x > greatestX || p2.x > greatestX)
      greatestX = p1.x > p2.x ? p1.x : p2.x;
    if (p1.y > greatestY || p2.y > greatestY)
      greatestY = p1.y > p2.y ? p1.y : p2.y;
  }
  return { greatestX, greatestY };
}

// This function mutates grid: Its not pure
function fillGridLine(line, grid, includeDiagonal) {
  let { p1, p2 } = line;
  if (p1.x === p2.x) {
    let [start, end] = p1.y > p2.y ? [p2.y, p1.y] : [p1.y, p2.y];
    while (start <= end) {
      grid[p1.x][start] += 1;
      start += 1;
    }
  }
  else if (p1.y === p2.y) {
    let [start, end] = p1.x > p2.x ? [p2.x, p1.x] : [p1.x, p2.x];
    while (start <= end) {
      grid[start][p1.y] += 1;
      start += 1;
    }
  }
  else if (includeDiagonal) {
    let xDirection = p1.x > p2.x ? -1 : 1;
    let yDirection = p1.y > p2.y ? -1 : 1;
    let xPoint = p1.x;
    let yPoint = p1.y;
    while (xPoint !== p2.x) {
      grid[xPoint][yPoint] += 1;
      xPoint += xDirection;
      yPoint += yDirection;
    }
    grid[xPoint][yPoint] += 1;
  }
}

let lines = [];
for (let read of input) {
  if (read.length) {
    let points = lineFromString(read);
    lines.push(getLine(points.p1, points.p2));
  }
}

let { greatestX, greatestY } = greatestPoints(lines);
let grid = new Array(greatestX + 1);
for (let x = 0; x < grid.length; x++) {
  grid[x] = new Array(greatestY + 1).fill(0);
}

for (let l of lines) {
  fillGridLine(l, grid, false);
}

let star1 = 0;

for (let x = 0; x < grid.length; x++) {
  for (let y = 0; y < grid[x].length; y++) {
    if (grid[x][y] > 1)
      star1++;
  }
}

// Reset grid for star 2
for (let x = 0; x < grid.length; x++) {
  for (let y = 0; y < grid[x].length; y++) {
    grid[x][y] = 0;
  }
}

for (let l of lines) {
  fillGridLine(l, grid, true);
}

let star2 = 0;

for (let x = 0; x < grid.length; x++) {
  for (let y = 0; y < grid[x].length; y++) {
    if (grid[x][y] > 1)
      star2++;
  }
}

console.log(star1, star2);
