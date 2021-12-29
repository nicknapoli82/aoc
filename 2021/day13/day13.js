let fs = require('fs');
let dots = fs.readFileSync('dots').toString().split('\n');
let folds = fs.readFileSync('folds').toString().split('\n');

for (let i = 0; i < dots.length; i++) {
  let [x, y] = dots[i].split(',');
  dots[i] = { x: Number.parseInt(x), y: Number.parseInt(y) };
}

for (let i = 0; i < folds.length; i++) {
  let [direction, position] = folds[i].split('=');
  direction = direction[direction.length - 1];
  position = Number.parseInt(position);
  folds[i] = { direction, position };
}

function foldX(dots, position) {
  for (let dot of dots) {
    if (dot.x > position) {
      dot.x = position - (dot.x - position);
    }
  }
  return dots;
}

function foldY(dots, position) {
  for (let dot of dots) {
    if (dot.y > position) {
      dot.y = position - (dot.y - position);
    }
  }
  return dots;
}

function uniqueDots(dots) {
  return dots.reduce((acc, dot) => {
    for (let d of acc) {
      if (d.x === dot.x && d.y === dot.y)
        return acc;
    }
    acc.push(dot);
    return acc;
  }, []);
}

for (let f of folds) {
  if (f.direction === 'x')
    dots = foldX(dots, f.position);
  else if (f.direction === 'y') {
    dots = foldY(dots, f.position);
  }
  dots = uniqueDots(dots);
}


let upperX = 0;
let upperY = 0;
for (let d of dots) {
  if (d.x > upperX) upperX = d.x;
  if (d.y > upperY) upperY = d.y;
}

let code = new Array(upperY + 1);
for (let i = 0; i < code.length; i++) {
  code[i] = new Array(upperX + 1).fill(' ');
}

for (let dot of dots) {
  code[dot.y][dot.x] = '#';
}

for (let line of code) {
  line = line.join('');
  console.log(line);
}
