let fs = require('fs');

let input = fs.readFileSync('input').toString().split('\n');

class Cave {
  constructor() {
    this.links = [];
    this.big = false;
  }
}

let caves = {};

for (let line of input) {
  let [id, link] = line.split('-');
  if (!caves[id]) {
    caves[id] = new Cave();
  }
  if (!caves[id].links.includes(link))
    caves[id].links.push(link);
  if (id === id.toUpperCase(id)) {
    caves[id].big = true;
  }

  if (!caves[link]) {
    caves[link] = new Cave();
  }
  if (!caves[link].links.includes(id))
    caves[link].links.push(id);
  if (link === link.toUpperCase(link)) {
    caves[link].big = true;
  }
}

let pathsPossible1 = 0;
let pathsPossible2 = 0;
let beenThere = new Set();
pathsPossible1 = traverseCaves1('start', beenThere);

beenThere = {};
pathsPossible2 = traverseCaves2('start', beenThere, '', 'start', new Set());

console.log(caves);
console.log(pathsPossible1);
console.log(pathsPossible2);

function traverseCaves1(node, beenThere) {
  if (beenThere.has(node) === true)
    return 0;
  if (node === 'end')
    return 1;
  if (caves[node].big === false)
    beenThere.add(node);

  let pathsFound = 0;
  for (let n of caves[node].links) {
    if (beenThere.has(n) === true)
      continue;
    pathsFound += traverseCaves1(n, beenThere);
  }

  beenThere.delete(node);
  return pathsFound;
}

function traverseCaves2(node, beenThere, smallFound = '', path, pFound) {
  if (caves[node].big === false) {
    if (beenThere[node] === undefined)
      beenThere[node] = 0;
    beenThere[node] += 1;
  }

  let pathsFound = 0;
  for (let n of caves[node].links) {
    if (n === 'start') continue;
    if (n === 'end') {
      if (pFound.has(path + n) === false) {
        pFound.add(path + n);
        pathsFound += 1;
      }
      continue;
    }
    if (n === smallFound && beenThere[n] === 2) continue;
    if (n !== smallFound && beenThere[n] === 1) continue;
    if (smallFound === '' && caves[n].big === false)
      pathsFound += traverseCaves2(n, beenThere, n, `${path}${n}`, pFound);
    pathsFound += traverseCaves2(n, beenThere, smallFound, `${path}${n}`, pFound);
  }
  if (beenThere[node])
    beenThere[node] -= 1;

  return pathsFound;
}
