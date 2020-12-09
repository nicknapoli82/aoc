const beginTime = process.hrtime();
const fs = require('fs');
let input = fs.readFileSync('input', 'utf8');
input = input.split('\n');

const passBSP = (pass) => {
  pass = pass.split('')
    .reduce((a, v) => a + ((v == 'F' || v == 'L') ? 0 : 1), "");
  return parseInt(pass.slice(0, 7), 2) * 8 + parseInt(pass.slice(-3), 2);
};

let seatID = new Set();
let seatRange = { low: passBSP('BBBBBBBRRR'), high: 0 };
for (let ID of input) {
  ID = passBSP(ID);
  seatID.add(ID);
  if (seatRange.low > ID) seatRange.low = ID;
  if (seatRange.high < ID) seatRange.high = ID;
}

console.log('Highest seat ID = ' + seatRange.high);

for (let i = seatRange.low; i < seatRange.high; i++) {
  if (!seatID.has(i)) console.log("My seat is " + i);
}

const endTime = process.hrtime(beginTime);
console.log('\nRunning Time: ' + endTime[0] + ' seconds ' + endTime[1] / 1000000 + ' ms');
