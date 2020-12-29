// No code for star 1, as I just did that by hand on paper
const { readFileSync } = require('fs');

const checkPrevious = (busses, value) => {
  for (let b of busses) {
    if ((value + b.location) % b.value)
      return true;
  }
  return false;
};

const [_, input] = readFileSync('input', 'utf8').split('\n');
//const input = "1789,37,47,1889";
const schedule = input.split(',')
  .map((v) => Number(v))
  .reduce((a, v, idx) => v ? [...a, { value: v, location: idx }] : a, []);

let interval = schedule[0].value;
let timeStamp = 0;
schedule.shift();

for (let b of schedule) {
  while ((timeStamp + b.location) % b.value)
    timeStamp += interval;
  interval *= b.value;
}

console.log(timeStamp, interval);
