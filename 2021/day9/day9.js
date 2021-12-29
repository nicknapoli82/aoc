let fs = require('fs');

let input = fs.readFileSync('input')
  .toString().split('\n')
  .map(e => e.split('').map(n => Number.parseInt(n)));
input = input.map(e => e.map(p => { return { height: p, lowPoint: false, riskLevel: 0, neighbors: new Set(), basinFound: false }; }));

let star1 = 0;
let star2 = 0;
function boundsCheck(i, j, limitI, limitJ) {
  return { up: i - 1 >= 0, left: j - 1 >= 0, right: j + 1 < limitJ, down: i + 1 < limitI };
}

// Set up neighbors
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[i].length; j++) {
    let bounds = boundsCheck(i, j, input.length, input[i].length);
    bounds.up ? input[i][j].neighbors.add(input[i - 1][j]) : null;
    bounds.down ? input[i][j].neighbors.add(input[i + 1][j]) : null;
    bounds.left ? input[i][j].neighbors.add(input[i][j - 1]) : null;
    bounds.right ? input[i][j].neighbors.add(input[i][j + 1]) : null;
  }
}

// Find low points
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[i].length; j++) {
    let low = true;
    for (let point of input[i][j].neighbors.values()) {
      if (input[i][j].height >= point.height) {
        low = false;
        break;
      }
    }
    if (low) {
      input[i][j].lowPoint = true;
      input[i][j].riskLevel = 1 + input[i][j].height;
      star1 += input[i][j].riskLevel;
    }
  }
}

// Create basins
let basinsLengths = [];
for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[i].length; j++) {
    if (input[i][j].lowPoint) {
      input[i][j].basinCount = true;
      let points = [input[i][j]];
      let currentPoint = 0;
      while (currentPoint < points.length) {
        for (let n of points[currentPoint].neighbors.values()) {
          if (!n.basinCount && n.height < 9) {
            n.basinCount = true;
            points.push(n);
          }
        }
        currentPoint++;
      }
      basinsLengths.push(points.length);
    }
  }
}
basinsLengths = basinsLengths.sort((a, b) => b - a);

console.log(star1);
console.log(basinsLengths[0] * basinsLengths[1] * basinsLengths[2]);
