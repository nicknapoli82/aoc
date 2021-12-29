const beginTime = process.hrtime();
const fs = require('fs');
let input = fs.readFileSync('input', 'utf8');
input = input.split('\n');

let star1 = 0;
let star2 = 0;
for (let i = 0; i < input.length; i++) {
  let answers = new Set();
  let allAnswers = new Set();
  // Collect answers for star 2
  for (let a of input[i])
    allAnswers.add(a);
  while (input[i] != '' && i < input.length) {
    // Collect answers for star 1
    for (let a of input[i])
      if (!answers.has(a)) answers.add(a);
    for (let [a, _] of allAnswers.entries()) {
      if (!input[i].includes(a)) {
        allAnswers.delete(a);
      }
    }
    i++;
  }
  star1 += answers.size;
  star2 += allAnswers.size;
}

console.log(star1, star2);

const endTime = process.hrtime(beginTime);
console.log('\nRunning Time: ' + endTime[0] + ' seconds ' + endTime[1] / 1000000 + ' ms');


// Just for fun
// Using input where file read is split on line
const cons = (head, tail = null) => ({ head: head, tail: tail });
const head = (pair) => pair ? pair.head : null;
const tail = (pair) => pair ? pair.tail : null;
const listify = (arr) => arr.reduce((a, v) => cons(v, a), null);
const filter = (f, list) => {
  if (head(list) === null) return null;
  if (f(head(list))) return cons(head(list), filter(f, tail(list)));
  return filter(f, tail(list));
};
const listCombine = (l1, l2) => {
  //  console.log("in combine " + l1.head);
  if (tail(l1) !== null) return cons(head(l1), listCombine(cons(tail(l1)), l2));
  return cons(head(l1), head(l2));
};
const listLength = (list, len = 0) => {
  if (head(list) === null) return len;
  return listLength(tail(list), len + 1);
};
const listHas = (what, inList) => {
  if (head(inList) === null) return false;
  if (head(inList) === what) return true;
  return listHas(what, tail(inList));
};
const listSum = (l, sum = 0) => {
  if (head(l) === null) return sum;
  if (head(l) === undefined || head(l) === NaN) return listSum(tail(l), sum);
  return listSum(tail(l), head(l) + sum);
};
const stringList = (str) => listify(str.split(''));

const answers = (using, group, ans) => {
  // Apologies for wrapping scope
  console.log(ans);
  const ansWrapper = using(ans);
  if (head(group) === null) return ans;
  return answers(using, tail(group), listCombine(filter(ansWrapper, stringList(head(group))), ans));
};
const groups = (input, collect) => {
  if (head(input) === null)
    return collect;
  else if (head(input) !== '')
    return groups(tail(input), cons(cons(head(input), head(collect)), tail(collect)));
  return groups(tail(input), cons(head(input), collect));
};
const onceAnswered = (currentAns) => (val) => {
  if (listHas(val, currentAns)) return false;
  return true;
};

let test = groups(listify(input));
let nextTest = listLength(answers(onceAnswered, head(tail(test))));
//console.log(test);
console.log(nextTest);
