const { hrtime } = require('process');
const { readFileSync } = require('fs');

const beginTime = hrtime();
const input = readFileSync('input', 'utf8').split('\n');
const preambleNums = input.slice(0, 25).map((v) => v | 0);
const preambleSums = preambleNums.map((v, i, a) => a.slice(i + 1, 25).map((add) => v + add));
preambleSums.pop();

// Part 1
let result = 0;
for (let XMASweakness of input.slice(25, input.length)) {
  let sumFound = false;
  for (let sums of preambleSums) {
    sumFound = sums.filter((v) => v === Number(XMASweakness)).length ? true : false;
    if (sumFound) break;
  }
  if (!sumFound) {
    result = XMASweakness;
    break;
  }
  preambleNums.shift(); preambleNums.push(Number(XMASweakness));
  preambleSums.shift(); preambleSums.push([]);
  preambleSums.forEach((elem, idx) => elem.push(preambleNums[idx] + Number(XMASweakness)));
}
console.log(result);

// Part 2 (seeking 'result' from part 1)
const numbersList = input.map((v) => Number(v));
let low = 0, high;
while (low < numbersList.length) {
  high = low;
  let test = numbersList[low];
  while (test < result && high < numbersList.length) {
    att++;
    high++;
    test += numbersList[high];
  }
  if (test == result) break;
  low++;
}
const finalSum = numbersList.slice(low, high + 1).reduce((a, v) => {
  if (v < a.low) a.low = v;
  if (v > a.high) a.high = v;
  return a;
}, { low: Infinity, high: 0 });

console.log(`low = ${low}, high = ${high}`);
console.log(`lowest = ${finalSum.low}, highest = ${finalSum.high}, result = ${finalSum.low + finalSum.high}`);
const endTime = hrtime(beginTime);
console.log('\nRunning Time: ' + endTime[0] + ' seconds ' + endTime[1] / 1000000 + ' ms');
