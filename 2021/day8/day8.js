let fs = require('fs');

let input = fs.readFileSync('./input').toString().split('\n').map(e => e.split(' | '));

let star1 = 0;
for (let [inp, out] of input) {
  out = out.split(' ').map(e => e.length);
  star1 += out.filter(e => e === 2 || e === 3 || e === 4 || e === 7).length;
}
console.log(star1);

// Combines all positions of comp and checks if
// each element in test exists in comp
function containsAll(test, comp = []) {
  comp = comp.join('');
  for (let c of test) {
    if (!comp.includes(c)) return false;
  }
  return true;
}

let star2 = 0;

for (let [inp, out] of input) {
  inp = inp.split(' ').map(e => e.split('').join(''))
    .reduce((acc, e) => {
      if (!acc[e.length]) {
        acc[e.length] = [];
      }
      acc[e.length].push(e);
      return acc;
    }, []);
  out = out.split(' ').map(e => e.split('').sort().join(''));
  let nums = new Array();
  nums[1] = inp[2][0];
  nums[7] = inp[3][0];
  nums[4] = inp[4][0];
  nums[8] = inp[7][0];
  // Find 3
  nums[3] = inp[5].filter(e => containsAll(nums[1], [e]))[0];
  inp[5] = inp[5].filter(e => e !== nums[3]);
  // Find 9
  nums[9] = inp[6].filter(e => containsAll(nums[4], [e]))[0];
  inp[6] = inp[6].filter(e => e !== nums[9]);
  // Find 5
  nums[5] = inp[5].filter(e => containsAll(e, [nums[9]]))[0];
  inp[5] = inp[5].filter(e => e !== nums[5]);
  // Num 2 is remaining length 5
  nums[2] = inp[5][0];
  // Find 0
  nums[0] = inp[6].filter(e => containsAll(nums[1], [e]))[0];
  nums[6] = inp[6].filter(e => e !== nums[0])[0];

  for (let n in nums) {
    nums[n] = nums[n].split('').sort().join('');
  }

  star2 += Number.parseInt(out.map(e => nums.reduce((a, v, i) => e === v && a === null ? i : a, null)).join(''));
  //  console.log(output, nums);
}
console.log(star2);
