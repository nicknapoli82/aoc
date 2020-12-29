const { readFileSync } = require('fs');

const input = readFileSync('input', 'utf8').split('\n');

// STAR 1 *
const test1 = input.reduce((a, v) => {
  let [op, value] = v.split('=');
  if (op[1] === 'a')
    a.mask = value.trim().split('');
  if (op[1] === 'e') {
    op = op.match(/([0-9])+/g);
    if (op === null) {
      console.log("A number failed to parse");
      return a;
    }
    op = op[0];
    value = Number.parseInt(value, 10).toString(2).split('');
    value = (new Array(a.mask.length - value.length)).fill('0', 0)
      .concat(value);
    value = a.mask.map((v, i) => {
      if (v === '1') return '1';
      if (v === '0') return '0';
      return value[i];
    });
    a.mem.set(op, value.join(""));
  }
  return a;
}, ({ mem: new Map(), mask: "" }));

let result = 0;
for (let i of test1.mem.values()) {
  result += Number.parseInt(i, 2);
}
console.log("Star 1 = " + result);

// STAR 2 **
const genAddresses = (address) => {
  const gen = [[...address.map((v) => v === 'X' ? '0' : v)]];
  for (let i = 0; i < address.length; i++) {
    if (address[i] === 'X') {
      for (let j = gen.length - 1; j >= 0; j--) {
        gen.push([...gen[j]]);
        gen[gen.length - 1][i] = '1';
      }
    }
  }
  return gen.map((v) => Number.parseInt(v.join(""), 2));
};

const test2 = input.reduce((a, v) => {
  let [op, value] = v.split('=');
  if (op[1] === 'a')
    a.mask = value.trim().split('');
  if (op[1] === 'e') {
    value = Number.parseInt(value, 10);
    op = op.match(/([0-9])+/g);
    if (op === null) {
      console.log("A number failed to parse");
      return a;
    }
    op = Number.parseInt(op[0], 10).toString(2).split('');

    op = (new Array(a.mask.length - op.length)).fill('0', 0)
      .concat(op);
    op = a.mask.map((v, i) => {
      if (v === '1') return '1';
      if (v === '0') return op[i];
      return 'X';
    });

    genAddresses(op).forEach((v) => a.mem.set(v, value));
  }
  return a;
}, ({ mem: new Map(), mask: "" }));

result = 0;
for (let i of test2.mem.values()) {
  result += i;
}
//console.log(test2);
console.log("Star 2 = " + result);
