const { printGrid } = require("./print");
const { wait } = require("./helpers");
const { NUMBERS, WAIT_CHECKS, SKIP_PRINT } = require("./config");

async function validateGrid(grid, text) {
  for (const l of grid) {
    for (const c of l) {
      c.justAdded = false;
      c.justGuessed = false;
    }
  }
  let fullOK = true;

  // check lines
  for (let i = 0; i < grid.length; i++) {
    let ok = true;
    const line = grid[i];
    for (const n of NUMBERS) {
      if (!line.map((l) => l.value).includes(n)) {
        ok = false;
        fullOK = false;
      }
    }
    if (!SKIP_PRINT) {
      printGrid(grid, { line: i }, ok, text);
      await wait(WAIT_CHECKS);
    }
  }

  // check columns
  for (let j = 0; j < 9; j++) {
    let ok = true;
    const column = [];
    for (let i = 0; i < grid.length; i++) {
      column.push(grid[i][j]);
    }
    for (const n of NUMBERS) {
      if (!column.map((l) => l.value).includes(n)) {
        fullOK = false;
        ok = false;
      }
    }
    if (!SKIP_PRINT) {
      printGrid(grid, { column: j }, ok, text);
      await wait(WAIT_CHECKS);
    }
  }

  // check boxes
  for (let j = 0; j < 9; j++) {
    let ok = true;
    const box = [];
    for (const l of grid) {
      for (const c of l) {
        if (c.box === j) box.push(c);
      }
    }
    for (const n of NUMBERS) {
      if (!box.map((l) => l.value).includes(n)) {
        fullOK = false;
        ok = false;
      }
    }
    if (!SKIP_PRINT) {
      printGrid(grid, { box: j }, ok, text);
      await wait(WAIT_CHECKS);
    }
  }
  if (fullOK) {
    printGrid(grid, { full: true }, undefined, text);
  }
  return fullOK;
}
module.exports = {
  validateGrid,
};
