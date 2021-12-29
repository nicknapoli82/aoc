let fs = require('fs');
let encodings = fs.readFileSync('input').toString().split('\n');
let polymers = 'ONSVVHNCFVBHKVPCHCPV';
let pairs = {};
for (let e of encodings) {
  let [pair, v] = e.split(' -> ');
  pairs[pair] = { insert: v, expanded: [] };
}

console.log(calcPolymers(polymers, 10));
console.log(calcPolymers(polymers, 40));

function calcPolymers(polymers = '', steps = 0) {
  let result = {};
  for (let i = 0; i < polymers.length; i++) {
    let pair = polymers.slice(i, i + 2);
    if (pair.length === 2) {
      let temp = expandPolymer(pair, steps);
      for (let k of Object.keys(temp)) {
        if (result[k] === undefined)
          result[k] = temp[k];
        else result[k] += temp[k];
      }
    }
  }
  for (let i of polymers) {
    result[i] += 1;
  }
  return result;
}

function expandPolymer(pair, depth) {
  if (depth === 0)
    return {};
  if (pairs[pair].expanded[depth])
    return pairs[pair].expanded[depth];
  let ins = pairs[pair].insert;
  let inserted = {};
  // Create new pairs to expand on and find their values
  let p1 = pair[0] + ins;
  let p2 = ins + pair[1];
  let expanded1 = expandPolymer(p1, depth - 1);
  let expanded2 = expandPolymer(p2, depth - 1);

  // Merge all expansions into inserted including what this pair would insert
  if (inserted[ins] === undefined)
    inserted[ins] = 1;
  else inserted[ins] += 1;
  for (let e of Object.keys(expanded1)) {
    if (inserted[e] === undefined)
      inserted[e] = expanded1[e];
    else inserted[e] += expanded1[e];
  }
  for (let e of Object.keys(expanded2)) {
    if (inserted[e] === undefined)
      inserted[e] = expanded2[e];
    else inserted[e] += expanded2[e];
  }

  // Remember these things for later use
  pairs[pair].expanded[depth] = inserted;
  if (!pairs[p1].expanded[depth - 1])
    pairs[p1].expanded[depth - 1] = expanded1;
  if (!pairs[p2].expanded[depth - 1])
    pairs[p2].expanded[depth - 1] = expanded2;
  return inserted;
}

/*
This is what I did for part 1 which is totally inadequate
for part 2.

for (let i = 0; i < 10; i++) {
  let nextPoly = [];
  for (let j = 0; j < polymers[i].length; j++) {
    let pair = polymers[i].slice(j, j + 2);
    if (pair.length === 2) {
      nextPoly.push(pair[0]);
      nextPoly.push(pairs[pair]);
    }
  }
  nextPoly.push(polymers[i][polymers[i].length - 1]);
  polymers.push(nextPoly.join(''));
  //  console.log(polymers[polymers.length - 1].length);
}

let counts = {};
for (let c of polymers[polymers.length - 1]) {
  if (counts[c] === undefined)
    counts[c] = 0;
  counts[c] += 1;
}

let highestCount = 0;
let lowestCount = Infinity;
for (let k of Object.keys(counts)) {
  if (counts[k] > highestCount)
    highestCount = counts[k];
  if (counts[k] < lowestCount)
    lowestCount = counts[k];
}
console.log(polymers);
console.log(counts);
console.log(highestCount - lowestCount);
*/
