const { readFileSync } = require("fs");

// I guess there is mathematical way to find the box number.
// but I failed to find it. So here it's a ez way
function getBox(l, c) {
  if ([0, 1, 2].includes(l)) {
    if ([0, 1, 2].includes(c)) return 0;
    if ([3, 4, 5].includes(c)) return 1;
    return 2;
  } else if ([3, 4, 5].includes(l)) {
    if ([0, 1, 2].includes(c)) return 3;
    if ([3, 4, 5].includes(c)) return 4;
    return 5;
  } else {
    if ([0, 1, 2].includes(c)) return 6;
    if ([3, 4, 5].includes(c)) return 7;
    return 8;
  }
}

function getBetterGrid(grid) {
  const betterGrid = [];
  for (let i = 0; i < grid.length; i++) {
    const line = grid[i];
    const betterLine = [];
    for (let j = 0; j < line.length; j++) {
      const cell = line[j];
      betterLine.push({
        value: cell,
        line: i,
        column: j,
        box: getBox(i, j),
        entropy: undefined,
        madeChoices: [],
      });
    }
    betterGrid.push(betterLine);
  }
  return betterGrid;
}

/*
  grids in file must be: 
  1 grid per line
  81 int per line
  0 are cells to find
*/
function gridsFromFile(file) {
  const txt = readFileSync(file, "utf-8");
  const lines = txt.split("\n");
  const grids = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const name = `Grid ${i}`;
    const grid = [];
    let line = [];
    for (let j = 0; j < 81; j++) {
      line.push(+l[j] === 0 ? null : +l[j]);
      if ((j + 1) % 9 === 0) {
        grid.push(line);
        line = [];
      }
    }
    grids.push({
      name,
      grid,
    });
  }
  return grids;
}

module.exports = {
  getBetterGrid,
  gridsFromFile,
};
