let lanternfish = "4,1,1,4,1,1,1,1,1,1,1,1,3,4,1,1,1,3,1,3,1,1,1,1,1,1,1,1,1,3,1,3,1,1,1,5,1,2,1,1,5,3,4,2,1,1,4,1,1,5,1,1,5,5,1,1,5,2,1,4,1,2,1,4,5,4,1,1,1,1,3,1,1,1,4,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,1,1,2,1,1,1,1,1,1,1,2,4,4,1,1,3,1,3,2,4,3,1,1,1,1,1,2,1,1,1,1,2,5,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,4,1,5,1,3,1,1,1,1,1,5,1,1,1,3,1,2,1,2,1,3,4,5,1,1,1,1,1,1,5,1,1,1,1,1,1,1,1,3,1,1,3,1,1,4,1,1,1,1,1,2,1,1,1,1,3,2,1,1,1,4,2,1,1,1,4,1,1,2,3,1,4,1,5,1,1,1,2,1,5,3,3,3,1,5,3,1,1,1,1,1,1,1,1,4,5,3,1,1,5,1,1,1,4,1,1,5,1,2,3,4,2,1,5,2,1,2,5,1,1,1,1,4,1,2,1,1,1,2,5,1,1,5,1,1,1,3,2,4,1,3,1,1,2,1,5,1,3,4,4,2,2,1,1,1,1,5,1,5,2"
  .split(',').map(e => Number.parseInt(e));

let star1 = [...lanternfish];
for (let i = 0; i < 80; i++) {
  for (let fish = 0, len = star1.length; fish < len; fish++) {
    if (star1[fish] === 0) {
      star1[fish] = 6;
      star1.push(8);
    }
    else { star1[fish] -= 1; }
  }
}

console.log(star1.length);

let fish = new Array(9).fill(0);
for (let i = 0; i < lanternfish.length; i++) {
  fish[lanternfish[i]]++;
}

for (let days = 0, spawning = 0; days < 256; days++, spawning = fish[0]) {
  for (let shift = 1; shift < 9; shift++) {
    fish[shift - 1] = fish[shift];
  }
  fish[6] += spawning;
  fish[8] = spawning;
}

let star2 = 0;
for (let i = 0; i < 9; i++) {
  star2 += fish[i];
}
console.log(star2);
