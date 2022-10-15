const { wait, getRandomElem, deepCopy } = require("./helpers");
const { printGrid } = require("./print");
const { getBetterGrid, gridsFromFile } = require("./parser");
const { validateGrid } = require("./validation");
const { NUMBERS, WAIT_START, WAIT_TURNS, SKIP_PRINT } = require("./config");
const { grids } = require("./grids");
const { grids50 } = require("./more_grids");

function getPossibleNumbers(present, madeChoices) {
  return NUMBERS.filter((n) => !present.includes(n) && !madeChoices.includes(n));
}

function getLineChoices(grid, cell) {
  const line = grid[cell.line];
  const alreadyInLine = line.filter((l) => l.value !== null).map((c) => c.value);
  return getPossibleNumbers(alreadyInLine, cell.madeChoices);
}

function getColumnChoices(grid, cell) {
  const column = [];
  for (const c of grid) {
    column.push(c[cell.column]);
  }
  const alreadyInColumn = column.filter((l) => l.value !== null).map((c) => c.value);
  return getPossibleNumbers(alreadyInColumn, cell.madeChoices);
}

function getBoxChoices(grid, cell) {
  const box = [];
  for (const l of grid) {
    for (const c of l) {
      if (c.box === cell.box) box.push(c);
    }
  }
  const alreadyInBox = box.filter((l) => l.value !== null).map((c) => c.value);
  return getPossibleNumbers(alreadyInBox, cell.madeChoices);
}

function getCellChoices(grid, cell) {
  if (cell.value && cell.choices.length === 0) return [cell.value];
  const li = getLineChoices(grid, cell);
  const co = getColumnChoices(grid, cell);
  const ca = getBoxChoices(grid, cell);
  const f = [];
  for (const l of li) {
    if (co.includes(l) && ca.includes(l)) f.push(l);
  }
  return f;
}

async function start(grid) {
  const betterGrid = getBetterGrid(grid);
  printGrid(betterGrid);
  await wait(WAIT_START);
  return betterGrid;
}

function setEntropy(betterGrid) {
  let smallestEntropy = null;
  let noChoices = false;
  let fullGrid = true;
  for (const line of betterGrid) {
    for (const cell of line) {
      if (cell.value) continue;
      fullGrid = false;
      const choices = getCellChoices(betterGrid, cell);
      cell.entropy = choices.length;
      cell.choices = [...choices];
      if (choices.length === 0) noChoices = true;
      if (!smallestEntropy || (cell.entropy !== 1 && cell.entropy < smallestEntropy)) smallestEntropy = cell.entropy;
    }
  }
  return { smallestEntropy, noChoices, fullGrid };
}

function fillGrid(betterGrid) {
  const added = [];
  for (const line of betterGrid) {
    for (const cell of line) {
      cell.justAdded = false;
      if (cell.value) continue;
      if (cell.entropy === 1) {
        added.push(cell);
        cell.value = cell.choices[0];
        cell.entropy = 1;
        cell.justAdded = true;
      }
    }
  }
  return added;
}

function getSmallestEntropyCell(betterGrid, smallestEntropy) {
  const smallestEntropyCells = [];
  for (const line of betterGrid) {
    for (const cell of line) {
      if (cell.entropy === smallestEntropy) smallestEntropyCells.push({ ...cell });
    }
  }
  return smallestEntropyCells;
}

async function makeRandomChoice(betterGrid, smallestEntropy, backTrackStack, textPrint) {
  const smallestEntropyCells = getSmallestEntropyCell(betterGrid, smallestEntropy);

  // start back-tracking
  const randomCell = getRandomElem(smallestEntropyCells);

  const randomChoice = getRandomElem(randomCell.choices);
  if (!randomChoice) {
    textPrint.failed = true;
    textPrint.reason = "No Random choices left!!";
    textPrint.rollback = true;
    textPrint.backTrack = backTrackStack.length;
  }
  textPrint.failed = true;
  textPrint.reason = "Adding Back Tracking";
  textPrint.rollback = true;
  textPrint.backTrack = backTrackStack.length;

  betterGrid[randomCell.line][randomCell.column].madeChoices = [
    ...betterGrid[randomCell.line][randomCell.column].madeChoices,
    randomChoice,
  ];

  backTrackStack.push({
    grid: deepCopy(betterGrid),
    smallestEntropyCells: deepCopy(smallestEntropyCells),
    randomCell: deepCopy(randomCell),
    randomChoice,
  });

  betterGrid[randomCell.line][randomCell.column].value = randomChoice;
  betterGrid[randomCell.line][randomCell.column].entropy = 1;
  betterGrid[randomCell.line][randomCell.column].justGuessed = true;
  await wait(WAIT_TURNS);
  return betterGrid;
}

function rollback(backTrackStack) {
  const lastState = backTrackStack.pop();
  return deepCopy(lastState.grid);
}

async function solveGrid(grid) {
  let loop = 0;
  let betterGrid = await start(grid.grid);
  const backTrackStack = [];
  const textPrint = {
    name: grid.name,
    rollback: false,
    failed: false,
    reason: "",
    backTrack: 0,
    loop,
  };
  while (true) {
    loop++;

    textPrint.loop = loop;
    textPrint.failed = false;
    textPrint.reason = "";
    textPrint.rollback = false;
    textPrint.backTrack = backTrackStack.length;

    const { smallestEntropy, noChoices, fullGrid } = setEntropy(betterGrid);
    if (noChoices) {
      textPrint.failed = true;
      textPrint.reason = "No Choices left";
      textPrint.rollback = true;
      textPrint.backTrack = backTrackStack.length;

      await wait(WAIT_TURNS);
      betterGrid = rollback(backTrackStack);
      continue;
    }

    if (fullGrid) {
      textPrint.failed = false;
      textPrint.reason = `Grid full, let's check it`;
      textPrint.rollback = false;
      textPrint.backTrack = backTrackStack.length;

      const goodGrid = await validateGrid(betterGrid, textPrint);
      if (!goodGrid) {
        textPrint.failed = true;
        textPrint.reason = `Grid failed!`;
        textPrint.rollback = true;
        textPrint.backTrack = backTrackStack.length;

        betterGrid = rollback(backTrackStack);
        await wait(WAIT_TURNS);
        continue;
      } else {
        return betterGrid;
      }
    }

    const added = fillGrid(betterGrid);

    if (added.length === 0) {
      textPrint.failed = false;
      textPrint.reason = `No evident choice, let's guess`;
      textPrint.rollback = false;
      textPrint.backTrack = backTrackStack.length;

      if (smallestEntropy === 0) {
        textPrint.failed = true;
        textPrint.reason = `Found 0 choices :(`;
        textPrint.rollback = true;
        textPrint.backTrack = backTrackStack.length;

        betterGrid = rollback(backTrackStack);
      }
      betterGrid = await makeRandomChoice(betterGrid, smallestEntropy, backTrackStack, textPrint);
    }

    if (!SKIP_PRINT) {
      printGrid(betterGrid, undefined, undefined, textPrint);
      await wait(WAIT_TURNS);
    }
  }
}

async function all() {
  const gridsFromFile = gridsFromFile("./grids/10_5sudoku_plain.txt");
  const allgrids = gridsFromFile.concat(grids50.concat(grids))
  for (const grid of allgrids) {
    console.log("\n\nNEW GRIIIIDDD\n");
    await wait(WAIT_START);
    const solvedGrid = await solveGrid(grid);
    await validateGrid(solvedGrid);
  }
}

all().then(() => {
  process.exit(0);
});
