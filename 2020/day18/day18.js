const invalidPrint = (str, at, message) => {
  console.log("Error:");
  message = (new Array(at)).fill(' ').concat('^-- ').concat(message).join('');
  console.log(str);
  console.log(message + '\n');
};

const isOperator = (str, at) => ['*', '/', '-', '+'].includes(str[at]);
const consumeOperator = (str, at) => [str[at], at + 1];

const isNumber = (str, at) => !isNaN(Number.parseInt(str[at]));
const consumeNumber = (str, at) => {
  const begin = at;
  while (isNumber(str, at)) at++;
  return [Number.parseInt(str.slice(begin, at)), at];
};

// Whitespace <CODE POINTS>       [<TAB>,    <VT>,     <FF>,     <SP>,     <NBSP>,   <SWNBSP>, <NL>,   ]
const isWhitespace = (str, at) => ['\u0009', '\u000b', '\u000c', '\u0020', '\u00a0', '\ufeff', '\u000a'].includes(str[at]);
const consumeWhitespace = (str, at) => {
  const begin = at;
  while (isWhitespace(str, at)) at++;
  return [str.slice(begin, at), at];
};

const insideBalancedSymbol = (str, at, [open, close]) => {
  let balance = 1; at++;
  const start = at;
  while (balance) {
    if (at === str.length) throw null;
    if (str[at] === open) balance++;
    if (str[at] === close) balance--;
    at++;
  }
  return str.slice(start, at - 1);
};
const isExp = (str, at) => str[at] === '(';
const consumeExp = (str, at) => {
  try {
    const exp = insideBalancedSymbol(str, at, ['(', ')']);
    return [exp, at + exp.length + 2];
  }
  catch (e) {
    invalidPrint(str, at, "Found expression unclosed...");
    process.exit(0);
  }
};

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

const grammars = [
  [isOperator, consumeOperator, 'OP'],
  [isNumber, consumeNumber, 'NUM'],
  [isWhitespace, consumeWhitespace, 'WS'],
  [isExp, consumeExp, 'EXP']
];

const lex = (str) => {
  let at = 0;
  let value = null;
  const tokens = [];
  while (at < str.length) {
    let validToken = false;
    for (const [is, consume, type] of grammars) {
      if (!is(str, at)) continue;
      validToken = true;
      [value, at] = consume(str, at);
      if (type !== 'WS') {
        tokens.push(new Token(type, value));
      }
    }
    if (!validToken) {
      invalidPrint(str, at, "I don't understand this!");
      process.exit(0);
    }
  }
  fixNegation(tokens);
  try {
    validExpression(tokens);
  }
  catch (e) {
    invalidPrint(str, 0, "This expression doesn't make sense.");
    process.exit(0);
  }

  for (const t of tokens) {
    if (t.type === 'EXP')
      t.value = lex(t.value);
  }
  return tokens;
};

const fixNegation = (tokens) => {
  const pullForward = (iter) => {
    while (iter < tokens.length - 1) {
      tokens[iter] = tokens[iter + 1];
      iter++;
    }
    tokens.pop();
  };
  if (tokens[0].type === 'OP' && tokens[0].value === '-' && tokens[1].type === 'NUM') {
    tokens[0] = tokens[1];
    tokens[1].value = -tokens[1].value;
    pullForward(1);
  }
  for (let iter = 1; iter < tokens.length - 1; iter++) {
    if (tokens[iter].type === 'OP' && tokens[iter].value === '-'
      && tokens[iter - 1].type === 'OP'
      && tokens[iter + 1].type === 'NUM') {
      tokens[iter] = tokens[iter + 1];
      tokens[iter + 1].value = -tokens[iter + 1].value;
      pullForward(iter + 1);
    }
  }
};

const validExpression = (tokens) => {
  if (tokens[0].type === 'OP' || tokens[tokens.length - 1].type === 'OP') {
    throw null;
  }
  for (let iter = 1; iter < tokens.length - 1; iter++) {
    if (tokens[iter].type === 'OP' && (tokens[iter - 1].type === 'OP' || tokens[iter + 1].type === 'OP')) {
      throw null;
    }
  }
};

const resolve = (tokens, precedence) => {
  precedence.forEach((pList) => {
    for (let idx = 0; idx < tokens.length; idx++) {
      if (pList.includes(tokens[idx].value)) {
        const lhs = tokens[idx - 1].type === 'EXP' ? resolve(tokens[idx - 1].value, precedence) : tokens[idx - 1].value;
        const rhs = tokens[idx + 1].type === 'EXP' ? resolve(tokens[idx + 1].value, precedence) : tokens[idx + 1].value;
        let result;
        switch (tokens[idx].value) {
          case '*': result = lhs * rhs; break;
          case '/': result = lhs / rhs; break;
          case '-': result = lhs - rhs; break;
          case '+': result = lhs + rhs; break;
        }
        tokens = tokens.slice(0, idx - 1)
          .concat(new Token('NUM', result))
          .concat(tokens.slice(idx + 2));
        idx = 0;
      }
    }
  });
  return tokens[0].value;
};

// Star 1
const { readFileSync } = require('fs');
const input = readFileSync('input', 'utf8').split('\n');

let star1Sum = 0;
for (const line of input) {
  star1Sum += resolve(lex(line), ['*/+-']);
}
console.log(star1Sum);

let star2Sum = 0;
for (const line of input) {
  star2Sum += resolve(lex(line), ['+', '*/-']);
}
console.log(star2Sum);
