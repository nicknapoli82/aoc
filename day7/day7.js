const beginTime = process.hrtime();
const fs = require('fs');
let input = fs.readFileSync('input', 'utf8');
input = input.split('\n');

const reType = /^(\w+) (\w+)/;
const reContents = /\d+ (\w+) (\w+)/g;

const bags = {};
let found = ['shiny gold'];
let notMyBag = new Set();

for (let b of input) {
  let contents = b.match(reContents);
  if (contents !== null) {
    bags[reType.exec(b)[0]] = contents.map((v) => ({
      amount: Number(v.match(/\d+/)[0]),
      type: v.match(/(?!\d)(\w+) (\w+)/)[0]
    }));
  }
  else bags[reType.exec(b)[0]] = null;
  notMyBag.add(reType.exec(b)[0]);
}

// Star 1
for (let b of found) {
  for (let [held, _] of notMyBag.entries()) {
    if (bags[held]) {
      for (let test of bags[held])
        if (test.type === b && notMyBag.has(held)) {
          found.push(held);
          notMyBag.delete(held);
        }
    }
  }
}
console.log(found.length - 1);

notMyBag = new Map();
// Star 2
const bagsHeld = (bagID) => {
  if (!bags[bagID]) return 0;
  if (notMyBag.has(bagID)) return notMyBag.get(bagID);
  let bagTotal = 0;
  for (let { type, amount } of bags[bagID]) {
    bagTotal += amount + (amount * bagsHeld(type));
  }
  notMyBag.set(bagID, bagTotal);
  return bagTotal;
};
console.log(bagsHeld('shiny gold'));
const endTime = process.hrtime(beginTime);
console.log('\nRunning Time: ' + endTime[0] + ' seconds ' + endTime[1] / 1000000 + ' ms');
