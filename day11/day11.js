const { hrtime } = require('process');
const { readFileSync } = require('fs');
const beginTime = hrtime();
const input = readFileSync('input', 'utf8').split('\n');

const seat = () => {
  return {
    isOccupied: false,
    neighbors: []
  };
};

const createSeats = (input, findNeighbors) => {
  const seats = input.map((line) => line.split('').map((v) => v === 'L' ? seat() : 0));
  seats.forEach((row, y) => row.forEach((seat, x) => { if (seat !== 0) findNeighbors(seats, seat, x, y); }));
  return seats;
};

const checkBounds = (seats, x, y) => {
  if (!seats[y] || (x < 0 || x >= seats[y].length))
    return false;
  if (y < 0 || y >= seats.length)
    return false;
  return true;
};

const validSeat = (seats, x, y) => {
  if (seats[y][x] === 0)
    return false;
  return true;
};

const neighborsAdjacent = (seats, seat, x, y) => {
  for (let x1 = x - 1; x1 <= x + 1; x1++) {
    for (let y1 = y - 1; y1 <= y + 1; y1++) {
      if (checkBounds(seats, x1, y1) && validSeat(seats, x1, y1) && (x1 !== x || y1 !== y)) {
        seat.neighbors.push(seats[y1][x1]);
      }
    }
  }
};

const neighborsSeen = (seats, seat, x, y) => {
  const directions = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
  directions.forEach(([x1, y1]) => {
    let atX = x + x1;
    let atY = y + y1;
    while (checkBounds(seats, atX, atY)) {
      if (validSeat(seats, atX, atY)) {
        seat.neighbors.push(seats[atY][atX]);
        break;
      }
      atX += x1;
      atY += y1;
    }
  });
};

const neighborsCount = (seat) => seat.neighbors.reduce((a, { isOccupied }) => {
  a += isOccupied ? 1 : 0;
  return a;
}, 0);
const shouldSitDown = (seat) =>
  neighborsCount(seat) === 0 ? true : false;
const shouldGetUp = (seat, surroundingOccupied) => {
  return neighborsCount(seat) >= surroundingOccupied ? true : false;
};

const collectSeatChanges = (seats, occTest) => {
  const changeSeats = [];
  seats.forEach((row) => row.forEach((s) => {
    if (typeof s !== 'number') {
      if (s.isOccupied && shouldGetUp(s, occTest)) changeSeats.push(s);
      else if (!s.isOccupied && shouldSitDown(s)) changeSeats.push(s);
    }
  }));
  return changeSeats;
};

const waitingArea = (input, chooseNeighbors, willAbandon) => {
  const seats = createSeats(input, chooseNeighbors);
  let roundsRan = 0;

  const round = () => {
    collectSeatChanges(seats, willAbandon).forEach((s) => s.isOccupied = !s.isOccupied);
    roundsRan++;
  };

  const seatsOccupied = () => {
    return seats.reduce((occ, row) => {
      row.forEach((s) => { if (s !== 0 && s.isOccupied) occ++; });
      return occ;
    }, 0);
  };

  return { round, seatsOccupied };
};

const star1 = waitingArea(input, neighborsAdjacent, 4);

let last1 = 0;

while (1) {
  star1.round();
  const next1 = star1.seatsOccupied();
  if (last1 === next1)
    break;
  else last1 = next1;
}
console.log(star1.seatsOccupied());

const star2 = waitingArea(input, neighborsSeen, 5);
let last2 = 0;
while (1) {
  star2.round();
  const next2 = star2.seatsOccupied();
  if (last2 === next2)
    break;
  else last2 = next2;
}
console.log(star2.seatsOccupied());
const endTime = hrtime(beginTime);
console.log('\nRunning Time: ' + endTime[0] + ' seconds ' + endTime[1] / 1000000 + ' ms');
