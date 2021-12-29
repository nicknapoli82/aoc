for (let [inp, out] of input) {
  inp = inp.split(' ').map(e => e.split('').sort().join(''));
  out = out.split(' ').map(e => e.split('').sort().join(''));
  const nums = new Map();
  const segments = new Map();
  do {
    for (let str of inp) {
      switch (str.length) {
        case 2: {
          segments.has(1) ? segments.set(1, str.split('')) : null;
          segments.has(2) ? segments.set(2, str.split('')) : null;
          break;
        }
        case 3: {
          if (segments.has(1) && segments.has(2)) {
            segments.set(0, str.split('').filter(e => !segments.get(1).includes(e) && !segments.get(2).includes(e)));
          }
          break;
        }
        case 4: {
          segments.set(4, str); break;
        }
        case 7: { nums.set(8, str); break; }
      }

    }
  } while (segments.size < 10)
  console.log(nums.size);
}
