let fs = require('fs');

let input = fs.readFileSync('input').toString().split('\n');

const openDelims = ['(', '[', '{', '<'];
const closeDelims = [')', ']', '}', '>'];
const errorCountDelim = [0, 0, 0, 0];
const errorPointsDelim = [3, 57, 1197, 25137];
const incompletePointsDelim = [1, 2, 3, 4];
let incompleteScores = [];

let star1 = 0;

for (let line of input) {
  let delimStack = [];
  for (let ch of line.split('')) {
    let delim = openDelims.indexOf(ch);
    if (delim !== -1) {
      delimStack.push(closeDelims[delim]);
      continue;
    }
    else {
      delim = closeDelims.indexOf(ch);
      if (closeDelims[delim] !== delimStack.pop()) {
        errorCountDelim[delim]++;
        delimStack = [];
        break;
      }
    }
  }
  if (delimStack.length) {
    let totalScore = 0;
    while (delimStack.length) {
      let point = closeDelims.indexOf(delimStack.pop());
      totalScore *= 5;
      totalScore += incompletePointsDelim[point];
    }
    incompleteScores.push(totalScore);
  }
}

for (let i in errorCountDelim) {
  star1 += errorCountDelim[i] * errorPointsDelim[i];
}

incompleteScores = incompleteScores.sort((a, b) => a - b);

console.log(star1);
console.log(incompleteScores[(incompleteScores.length - 1) / 2], incompleteScores.length);
