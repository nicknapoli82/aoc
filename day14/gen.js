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
let test = "0010011010X1000100X101011X10010X1010".split('');
console.log(genAddresses(test));

console.log((57319).toString(2));
console.log((29943).toString(2));
