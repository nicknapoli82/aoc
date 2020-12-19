const { hrtime } = require('process');
const { readFileSync } = require('fs');
const beginTime = hrtime();
class ferry {
  constructor() {
    this.position = { ns: 0, we: 0 };
    this.direction = { north: false, south: false, east: true, west: false };
    this.waypoint = { ns: 0, we: 0 };
    this.wpLocation = { ns: 1, we: 10 };
  }
  action = (nav) => {
    const act = nav[0];
    const amount = Number(nav.slice(1));
    switch (act) {
      case 'N': {
        this.position.ns += amount;
        this.wpLocation.ns += amount;
        break;
      }
      case 'S': {
        this.position.ns -= amount;
        this.wpLocation.ns -= amount;
        break;
      }
      case 'E': {
        this.position.we += amount;
        this.wpLocation.we += amount;
        break;
      }
      case 'W': {
        this.position.we -= amount;
        this.wpLocation.we -= amount;
        break;
      }
      case 'L': {
        this.rotDirection(act, amount);
        break;
      }
      case 'R': {
        this.rotDirection(act, amount);
        break;
      }
      case 'F': {
        this.waypoint.ns += this.wpLocation.ns * amount;
        this.waypoint.we += this.wpLocation.we * amount;
        switch (true) {
          case this.direction.north: {
            this.position.ns += amount;
            break;
          }
          case this.direction.south: {
            this.position.ns -= amount;
            break;
          }
          case this.direction.east: {
            this.position.we += amount;
            break;
          }
          case this.direction.west: {
            this.position.we -= amount;
            break;
          }
        }
      }
    }
  }
  rotDirection = (lr, amount) => {
    while (amount) {
      let tmp = this.wpLocation.ns;
      if (lr === 'L') {
        this.wpLocation.ns = this.wpLocation.we;
        this.wpLocation.we = -tmp;
      }
      if (lr === 'R') {
        this.wpLocation.ns = -this.wpLocation.we;
        this.wpLocation.we = tmp;
      }
      switch (true) {
        case this.direction.north: {
          if (lr === 'L') {
            this.direction.north = false; this.direction.west = true;
          }
          if (lr === 'R') {
            this.direction.north = false; this.direction.east = true;
          }
          break;
        }
        case this.direction.south: {
          if (lr === 'L') {
            this.direction.south = false; this.direction.east = true;
          }
          if (lr === 'R') {
            this.direction.south = false; this.direction.west = true;
          }
          break;
        }
        case this.direction.east: {
          if (lr === 'L') {
            this.direction.east = false; this.direction.north = true;
          }
          if (lr === 'R') {
            this.direction.east = false; this.direction.south = true;
          }
          break;
        }
        case this.direction.west: {
          if (lr === 'L') {
            this.direction.west = false; this.direction.south = true;
          }
          if (lr === 'R') {
            this.direction.west = false; this.direction.north = true;
          }
          break;
        }
      }
      amount -= 90;
    }
  }
}


const input = readFileSync('input', 'utf8').split('\n');

const captain = new ferry();
for (let i of input) {
  captain.action(i);
}
console.log(captain);
const endTime = hrtime(beginTime);
console.log('\nRunning Time: ' + endTime[0] + ' seconds ' + endTime[1] / 1000000 + ' ms');
