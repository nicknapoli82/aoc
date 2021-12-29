let fs = require('fs');

let input = fs.readFileSync('input.txt').toString().split(',').map(e => Number.parseInt(e));
//let input = '16,1,2,0,4,2,7,1,2,14'.split(',').map(e => Number.parseInt(e));
let space = 0;
for (let crab of input) {
  if (crab > space) space = crab;
}
let cost = new Array(space + 1).fill(0);
let crabs = new Array(space + 1).fill(0);
for (let crab of input) {
  crabs[crab]++;
}

for (let i = 0; i < crabs.length; i++) {
  let distance = i;
  let before_mark = true;
  for (let j = 0; j < crabs.length; j++) {
    cost[i] += crabs[j] * distance;
    if (distance === 0) {
      before_mark = false;
    }
    if (before_mark) {
      distance--;
    }
    else if (!before_mark) {
      distance++;
    }
  }
}

let star1 = Number.MAX_VALUE;
for (let i = 0; i < crabs.length; i++) {
  if (cost[i] < star1) star1 = cost[i];
}

console.log(star1);


cost = cost.map(e => 0);

for (let i = 0; i < crabs.length; i++) {
  let distance = i;
  let before_mark = true;
  for (let j = 0; j < crabs.length; j++) {
    let move = distance;
    while (move !== 0) {
      cost[i] += crabs[j] * move;
      move--;
    }
    if (distance === 0) {
      before_mark = false;
    }
    if (before_mark) {
      distance--;
    }
    else if (!before_mark) {
      distance++;
    }
  }
}

let star2 = Number.MAX_VALUE;
for (let i = 0; i < crabs.length; i++) {
  if (cost[i] < star2) star2 = cost[i];
}

console.log(star2);
