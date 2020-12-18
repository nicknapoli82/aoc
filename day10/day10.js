const { hrtime } = require('process');
const { readFileSync } = require('fs');

let adapters = ('0\n' + readFileSync('input', 'utf8'))
  .split('\n').map((v) => v | 0)
  .sort((a, b) => a - b)
  .reduce((acc, _, idx, arr) => {
    if (!arr[idx + 1])
      return acc;
    acc[arr[idx + 1] - arr[idx]]++;
    return acc;
  }, { 1: 0, 2: 0, 3: 0 });
console.log(adapters, adapters[1] * (adapters[3] + 1));

adapters = (readFileSync('input', 'utf8'))
  .split('\n').map((v) => v | 0)
  .sort((a, b) => a - b);
adapters.push(adapters[adapters.length - 1] + 3);

let adapterPaths = new Map();
adapterPaths.set('0', 1);
for (let adapter of adapters) {
  let paths = 0;
  for (let [k, v] of adapterPaths) {
    if (adapter - k <= 3)
      paths += v;
    else
      adapterPaths.delete(k);
  }
  adapterPaths.set(adapter, paths);
}
console.log(adapterPaths);
