const { hrtime } = require('process');
const beginTime = hrtime();

function genStart([...numbers]) {
  const lastNumber = numbers.pop();
  //  return [lastNumber, numbers.reduce((a, v, i) => { a.set(v, i + 1); return a; }, new Map())];
  return [lastNumber, numbers.reduce((a, v, i) => { a[v] = i + 1; return a; }, {})];
};

const game = (startingNumbers) => {
  let [lastNumber, numbers] = genStart(startingNumbers);
  let turn = startingNumbers.length;
  let tmp = 0;
  while (turn < 30000000) {
    //    console.log("before", turn, numbers[lastNumber], numbers);
    if (!numbers[lastNumber]) {
      //numbers.set(lastNumber, turn);
      numbers[lastNumber] = turn;
      lastNumber = 0;
    }
    else {
      //tmp = numbers.get(lastNumber);
      tmp = numbers[lastNumber];
      //numbers.set(lastNumber, turn);
      numbers[lastNumber] = turn;
      lastNumber = turn - tmp;
    }
    //    console.log("after", turn, lastNumber, numbers);
    turn++;
    //if (!(turn % 1000000))
    //  console.log(turn, lastNumber);
  }
  console.log(lastNumber);
};

game([0, 14, 1, 3, 7, 9]);

const endTime = hrtime(beginTime);
console.log('\nRunning Time: ' + endTime[0] + ' seconds ' + endTime[1] / 1000000 + ' ms');
