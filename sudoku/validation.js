const { printGrid } = require("./print");
const { wait } = require("./helpers");
const { NUMBERS, WAIT_CHECKS, SKIP_PRINT, STOP_VERIFY_AT_FIRST_ERROR } = require("./config");

async function validateGrid(grid, text, ws) {
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
    const values = line.map((l) => l.value);
    for (const n of NUMBERS) {
      if (!values.includes(n)) {
        ok = false;
        fullOK = false;
      }
    }
    if (!SKIP_PRINT) {
      printGrid(grid, { line: i }, ok, text);
      const msg = JSON.stringify({
        validate: true,
        ok,
        line: i,
        values,
      });
      ws && ws(msg);
      await wait(WAIT_CHECKS);
    }
  }
  if (STOP_VERIFY_AT_FIRST_ERROR && !fullOK) return fullOK;

  // check columns
  for (let j = 0; j < 9; j++) {
    let ok = true;
    const column = [];
    for (let i = 0; i < grid.length; i++) {
      column.push(grid[i][j]);
    }
    const values = column.map((l) => l.value);
    for (const n of NUMBERS) {
      if (!values.includes(n)) {
        fullOK = false;
        ok = false;
      }
    }
    if (!SKIP_PRINT) {
      printGrid(grid, { column: j }, ok, text);
      const msg = JSON.stringify({
        validate: true,
        ok,
        column: j,
        values,
      });
      ws && ws(msg);
      await wait(WAIT_CHECKS);
    }
  }
  if (STOP_VERIFY_AT_FIRST_ERROR && !fullOK) return fullOK;

  // check boxes
  for (let j = 0; j < 9; j++) {
    let ok = true;
    const box = [];
    for (const l of grid) {
      for (const c of l) {
        if (c.box === j) box.push(c);
      }
    }
    const values = box.map((l) => l.value);
    for (const n of NUMBERS) {
      if (!values.includes(n)) {
        fullOK = false;
        ok = false;
      }
    }
    if (!SKIP_PRINT) {
      printGrid(grid, { box: j }, ok, text);
      const msg = JSON.stringify({
        validate: true,
        ok,
        box: j,
        values,
      });
      ws && ws(msg);
      await wait(WAIT_CHECKS);
    }
  }
  if (STOP_VERIFY_AT_FIRST_ERROR && !fullOK) return fullOK;

  if (fullOK) {
    printGrid(grid, { full: true }, undefined, text);
    ws && ws(grid, { full: true }, undefined, text);
  }
  return fullOK;
}
module.exports = {
  validateGrid,
};
