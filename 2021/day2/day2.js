class Submarine {
  constructor(include_aim) {
    this.depth = 0;
    this.horizontal = 0;
    this.include_aim = include_aim;
    this.aim = 0;
  }

  forward(x) {
    this.horizontal += x;
    if (this.include_aim)
      this.depth += this.aim * x;
  }

  down(x) {
    if (this.include_aim)
      this.aim += x;
    else
      this.depth += x;
  }

  up(x) {
    if (this.include_aim)
      this.aim -= x;
    else
      this.depth -= x;
  }
}

let fs = require('fs');

let directions = fs.readFileSync('./input.txt').toString().split('\n').map(e => {
  e = e.trim();
  let [direction, units] = e.split(' ');
  return { direction, units: Number(units) };
});

let sub1 = new Submarine();
let sub2 = new Submarine(true);

for (let next of directions) {
  if (next.direction) {
    sub1[next.direction](next.units);
    sub2[next.direction](next.units);
  }
}

console.log(sub1.horizontal * sub1.depth);
console.log(sub2.horizontal * sub2.depth);
