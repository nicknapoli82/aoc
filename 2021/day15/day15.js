let fs = require('fs');
let input = fs.readFileSync('input').toString().split('\n');

let cave = new Array(input.length);
for (let i = 0; i < cave.length; i++) {
  cave[i] = input[i].split('').map(e => Number.parseInt(e));
}

let bigCave = new Array(cave.length * 5);
for (let y = 0; y < bigCave.length; y++) {
  let caveY = y % 100;
  let addY = Math.floor(y / 100);
  bigCave[y] = new Array(cave[caveY].length * 5);
  for (let x = 0; x < bigCave[y].length; x++) {
    let caveX = x % 100;
    let addX = Math.floor(x / 100);
    let num = cave[caveY][caveX] + addY + addX;
    bigCave[y][x] = num > 9 ? num - 9 : num;
  }
}

const directions4Way = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }];
const directions8Way = [{ x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 1 }];
function* directions(dir) {
  let position = 0;
  while (position < dir.length) {
    yield dir[position++];
  }
}

class Point {
  constructor(x, y, value, cave) {
    this.x = x;
    this.y = y;
    this.cave = cave;
    this.cost = value;
    this.lowestCost = Infinity;
    this.neighbors = [];
    this.bestNeighbor = null;
  }
  genNeighbors(using) {
    for (let { x, y } of directions(using)) {
      x += this.x;
      y += this.y;
      if (y >= 0 && y < this.cave.length && x >= 0 && x < this.cave[y].length) {
        this.neighbors.push(this.cave[y][x]);
      }
    }
  }
}

console.time('100');
let cave100x100 = [];
for (let cy = 0; cy < cave.length; cy++) {
  cave100x100.push([]);
  for (let cx = 0; cx < cave[cy].length; cx++) {
    cave100x100[cy].push(new Point(cx, cy, cave[cy][cx], cave100x100));
  }
}
for (let row of cave100x100)
  for (let point of row)
    point.genNeighbors(directions4Way);

cave100x100[0][0].cost = 0;
cave100x100[0][0].lowestCost = 0;
let pointsToCalc = [cave100x100[0][0]];
while (pointsToCalc.length) {
  let newPoints = [];
  for (let point of pointsToCalc) {
    let newCost = point.lowestCost + point.cost;
    for (let n of point.neighbors) {
      if (n.lowestCost > newCost) {
        n.lowestCost = newCost;
        n.bestNeighbor = point;
        newPoints.push(n);
      }
    }
  }
  pointsToCalc = newPoints;
}
let lastPoint = cave100x100[cave100x100.length - 1].pop();
console.log(lastPoint.cost);
console.log(lastPoint.lowestCost);
console.timeEnd('100');

console.time('500');
let cave500x500 = [];
for (let cy = 0; cy < bigCave.length; cy++) {
  cave500x500.push([]);
  for (let cx = 0; cx < bigCave[cy].length; cx++) {
    cave500x500[cy].push(new Point(cx, cy, bigCave[cy][cx], cave500x500));
  }
}
for (let row of cave500x500)
  for (let point of row)
    point.genNeighbors(directions8Way);

cave500x500[0][0].cost = 0;
cave500x500[0][0].lowestCost = 0;
pointsToCalc = [cave500x500[0][0]];
while (pointsToCalc.length) {
  let newPoints = [];
  for (let point of pointsToCalc) {
    let newCost = point.lowestCost + point.cost;
    for (let n of point.neighbors) {
      if (n.lowestCost > newCost) {
        n.lowestCost = newCost;
        n.bestNeighbor = point;
        newPoints.push(n);
      }
    }
  }
  pointsToCalc = newPoints;
}
lastPoint = cave500x500[cave500x500.length - 1].pop();
console.log(lastPoint.cost);
console.log(lastPoint.lowestCost);
console.timeEnd('500');

////////////////////////////////////////////////////////////////////////
// This is a nieve method of pathfinding which is exhausive in nature //
// It will find a path but due to the method takes forever to run     //
////////////////////////////////////////////////////////////////////////

// let fs = require('fs');
// let input = fs.readFileSync('input').toString().split('\n');

// let cave = new Array(input.length);
// for (let i = 0; i < cave.length; i++) {
//   cave[i] = input[i].split('').map(e => Number.parseInt(e));
// }

// function directions4Way() {
//   let directions = [{ x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }];
//   let position = 0;
//   function nextDirection() {
//     if (position === directions.length)
//       return null;
//     return directions[position++];
//   }
//   return nextDirection;
// }

// class Point {
//   constructor(x, y, using) {
//     this.x = x;
//     this.y = y;
//     this.directions = using();
//   }
//   toString() {
//     return `${this.x},${this.y}`;
//   }
// }

// class Path {
//   constructor(x, y, cave, directions) {
//     this.path = [new Point(x, y, directions)];
//     this.cave = cave;
//     this.directions = directions;
//     this.traversed = new Set();
//     this.traversed.add(this.path[0].toString());
//   }
//   findPath(endX, endY, costMeasure) {
//     while (this.path.length) {
//       let point = this.path[this.path.length - 1];
//       let xyTo = point.directions();
//       if (xyTo === null) {
//         this.traversed.delete(point.toString());
//         this.path.pop();
//         continue;
//       }
//       let x = xyTo.x + point.x;
//       let y = xyTo.y + point.y;
//       if (this.traversed.has(`${x},${y}`))
//         continue;
//       if ((x >= 0 && y >= 0) && (y < this.cave.length && x < this.cave[y].length)) {
//         if (x === endX && y === endY) {
//           let result = [...this.path];
//           result.push(new Point(x, y, this.directions));
//           return result;
//         }
//         let newPoint = new Point(x, y, this.directions);
//         if (costMeasure(this.path, newPoint)) {
//           this.path.push(newPoint);
//           this.traversed.add(this.path[this.path.length - 1].toString());
//         }
//       }
//     }
//     return null;
//   }
// }

// function shortestPath(init) {
//   return function(path, point) { return path.length + 1 < init; };
// }

// let test = new Path(0, 0, cave, directions4Way);
// let path = test.findPath(cave[0].length - 1, cave.length - 1, shortestPath(Infinity));
// let result = path;
// let pathsFound = 0;
// console.log(pathsFound, path === null ? null : path.length);
// while (path) {
//   path = test.findPath(cave[0].length - 1, cave.length - 1, shortestPath(path.length));
//   pathsFound++;
//   if (path && path.length < result.length)
//     result = path;
//   console.log(pathsFound, path === null ? null : path.length);
// }
// console.log(result);
// console.log(result.length);
