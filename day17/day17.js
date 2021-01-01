
const cube = (id, active = false) => {
  const neighbors = new Set();
  return ({
    active,
    neighbors,
    id: () => id,
    addNeighbor: (id) => neighbors.add(id),
    removeNeighbor: (id) => neighbors.delete(id),
    activeNeighbors: () => neighbors.size
  });
};

function aroundCube(cube) {
  const coords = JSON.parse(cube.id());
  const current = [...coords];
  const result = new Set();
  function everyCoord(idx = 0) {
    if (idx >= coords.length) return;
    for (let num = coords[idx] - 1; num <= coords[idx] + 1; num++) {
      current[idx] = num;
      everyCoord(idx + 1);
      result.add(JSON.stringify(current));
    }
  };
  everyCoord();
  result.delete(cube.id());
  return result;
}

const pocketDimension = () => {
  const cubes = new Map();
  const addCube = (id, active = false) => {
    cubes.set(id, cube(id, active));
    return cubes.get(id);
  };
  const cubeExists = (id) => {
    return cubes.has(id);
  };
  const cycle = () => {
    const changes = new Set();
    for (const [_, c] of cubes) {
      if (c.active && (c.activeNeighbors() !== 2 && c.activeNeighbors() !== 3))
        changes.add(c.id());
      if (!c.active && c.activeNeighbors() === 3)
        changes.add(c.id());
    }
    updateChanges(changes);
    removeUnused();
  };
  const updateChanges = (changes) => {
    for (const id of changes) {
      const currentCube = cubes.get(id);
      const neighbors = aroundCube(currentCube);
      if (currentCube.active) {
        currentCube.active = false;
        for (let n of neighbors) {
          n = cubes.get(n);
          n.removeNeighbor(currentCube.id());
        }
      }
      else {
        currentCube.active = true;
        for (let n of neighbors) {
          if (!cubes.has(n))
            addCube(n);
          n = cubes.get(n);
          n.addNeighbor(currentCube.id());
        }
      }
    }
  };
  const removeUnused = () => {
    for (const [_, c] of cubes.entries())
      if (!c.active && c.activeNeighbors() === 0)
        cubes.delete(c.id());
  };
  const totalActive = () => {
    let total = 0;
    for (const [_, c] of cubes.entries()) {
      total += c.active ? 1 : 0;
    }
    return total;
  };
  return ({
    cubes,
    addCube,
    cubeExists,
    cycle,
    totalActive
  });
};

const initPocketDimension = (startGrid, dimensions = 2, { cubes, addCube, cubeExists }) => {
  dimensions = new Array(dimensions).fill(0);
  for (const [y, row] of startGrid.split('\n').entries()) {
    let currentCube = null;
    dimensions[1] = y;
    for (const [x, cell] of row.split('').entries()) {
      dimensions[0] = x;
      const id = JSON.stringify(dimensions);
      if (cell === '#') {
        if (!cubeExists(id))
          currentCube = addCube(id, true);
        else {
          currentCube = cubes.get(id);
          if (!currentCube.active)
            currentCube.active = true;
        }
      }
      else {
        currentCube = addCube(id);
      }
      const neighbors = aroundCube(currentCube);
      for (const n of neighbors) {
        if (!cubeExists(n)) {
          const nCube = addCube(n);
          if (currentCube.active) {
            nCube.addNeighbor(currentCube.id());
          }
        }
        else {
          const nCube = cubes.get(n);
          if (currentCube.active) {
            nCube.addNeighbor(currentCube.id());
          }
          if (nCube.active) {
            currentCube.addNeighbor(nCube.id());
          }
        }
      }
    }
  }
};

const { readFileSync } = require('fs');
const input = readFileSync('input', 'utf8');
//const input = `.#.\n..#\n###`;
const pD3 = pocketDimension();
const pD4 = pocketDimension();
initPocketDimension(input, 3, pD3);
initPocketDimension(input, 4, pD4);
for (let i = 0; i < 100; i++) {
  pD3.cycle();
  //  pD4.cycle();
  console.log(pD3.totalActive());
}
console.log(pD3.totalActive());
//console.log(pD4.totalActive());
