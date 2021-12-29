const { readFileSync } = require('fs');

const input = readFileSync('input', 'utf8').split('\n');

const range = (r) => {
  const [lower, upper] = r.match(/[0-9]+/g);
  return (comp) => { return lower <= comp && upper >= comp; };
};

const rule = (r) => {
  let [name, ranges] = r.split(':');
  ranges = ranges.match(/[0-9]+-[0-9]+/g).map((r) => range(r));
  return ({
    name,
    valid: (num) => { for (let valid of ranges) if (valid(num)) return true; return false; }
  });
};

const ticket = (t) => {
  return t.split(',').map((v) => v | 0);
};

let inputCursor = 0;
const rules = [];
while (input[inputCursor] !== '') {
  rules.push(rule(input[inputCursor++]));
}
inputCursor += 2;

const myTicket = ticket(input[inputCursor++]);
inputCursor += 2;

const nearbyTickets = [];
while (inputCursor < input.length) {
  nearbyTickets.push(ticket(input[inputCursor++]));
}

// STAR 1
let ticketErrors = 0;

for (let nT of nearbyTickets) {
  for (let num of nT) {
    let valid = false;
    for (let r of rules) {
      if (r.valid(num)) {
        valid = true;
        break;
      }
    }
    if (!valid)
      ticketErrors += num;
  }
}

console.log(ticketErrors);

// STAR 2
/* Using my ticket as a baseline for possible valid fields
   Use valid tickets whos fields are only valid for possible fields
   If the field is not possible, remove that field from the list
*/
const ticketIsValid = (t, rules) => {
  for (let num of t) {
    let test = false;
    for (let r of rules) {
      if (r.valid(num)) {
        test = true;
        break;
      }
    }
    if (!test) {
      return false;
    }
  }
  return true;
};

const collectFields = (t, rules) => {
  const collected = t.map((_) => new Set());
  for (let tIdx = 0; tIdx < t.length; tIdx++) {
    for (let r of rules)
      if (r.valid(t[tIdx]))
        collected[tIdx].add(r.name);
  }
  return collected;
};

const ticketFields = collectFields(myTicket, rules);

for (let t of nearbyTickets) {
  if (ticketIsValid(t, rules)) {
    const possible = collectFields(t, rules);
    for (let idx = 0; idx < possible.length; idx++) {
      for (let [_, name] of ticketFields[idx].entries()) {
        if (!possible[idx].has(name)) {
          ticketFields[idx].delete(name);
        }
      }
    }
  }
}

console.log(ticketFields);
