let fs = require('fs');

let input = fs.readFileSync('input.txt').toString().split('\n').map(e => e.trim().split(''));
let positionSums = new Array(input[0].length).fill([0]);

for (let i of input) {
  for (let b = 0; b < i.length; b++) {
    if (i[b] === '1') positionSums[b]++;
  }
}

function filterInput(input, position, keep) {
  if (input.length === 1) return Number.parseInt(input[0].join(''), 2);
  if (position === input[0].length) position = 0;

  let sum = 0;
  let test = input.length / 2;

  for (let i of input) {
    if (i[position] === '1') sum++;
  }

  if (sum > test) {
    if (keep === 1) { test = 1; }
    else { test = 0; }
  }
  else if (sum < test) {
    if (keep === 0) { test = 1; }
    else { test = 0; }
  }
  else if (sum == test) {
    if (keep === 1) test = 1;
    else test = 0;
  }

  return filterInput(input.filter(e => e[position] == test), position + 1, keep);
}

let gammaRate = new Array(input[0].length).fill(0);
let epsilonRate = new Array(input[0].length).fill(0);
let oxygenGenerator = filterInput(input, 0, 1);
let c02Scrubber = filterInput(input, 0, 0);

for (let i = 0, testAgainst = input.length / 2; i < positionSums.length; i++) {
  if (positionSums[i] > testAgainst) gammaRate[i]++;
  else epsilonRate[i]++;
}

gammaRate = Number.parseInt(gammaRate.join(''), 2);
epsilonRate = Number.parseInt(epsilonRate.join(''), 2);

console.log(gammaRate * epsilonRate);
console.log(oxygenGenerator * c02Scrubber);
