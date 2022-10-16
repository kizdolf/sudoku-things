const { CLEAR_SCREEN, COLORS } = require("./config");
const indices = {
  1: "₁",
  2: "₂",
  3: "₃",
  4: "₄",
  5: "₅",
  6: "₆",
  7: "₇",
  8: "₈",
  9: "₉",
};

const c = {
  reset: COLORS.Reset,
  ok: COLORS.BgGreen,
  ko: COLORS.BgLightRed,
  add: `${COLORS.BgGreen}${COLORS.FgBlack}`,
  guess: `${COLORS.BgYellow}${COLORS.FgMagenta}`,
  choices: `${COLORS.FgBlue}`,
};

const firstLine = (opts = {}, ok, i, j, box) => {
  const color = ok ? c.ok : c.ko;
  const base = `┏━━━━━┯━━━━━┯━━━━━┳━━━━━┯━━━━━┯━━━━━┳━━━━━┯━━━━━┯━━━━━┓`;
  if (opts.line === i) return `${color}${base}${c.reset}`;

  if (opts.column >= 0) {
    if (opts.column >= 0) {
      const start = opts.column === 0 ? 0 : opts.column * 6;
      const endI = start + 7 + 1;
      const b = base.split("");
      b.splice(start, 0, color);
      b.splice(endI, 0, c.reset);

      return b.join("");
    }
  }

  if (opts.box >= 0 && opts.box < 3) {
    const start = opts.box === 0 ? 0 : opts.box * 6 * 3;
    const endI = start + 6 * 3 + 2;
    const b = base.split("");
    b.splice(start, 0, color);
    b.splice(endI, 0, c.reset);
    return b.join("");
  }

  return base;
};

function getCrossingLine(opts = {}, ok, i, j, box, cb) {
  const baseLine = `┠─────┼─────┼─────╂─────┼─────┼─────╂─────┼─────┼─────┨`;
  const baseCrossLine = `┣━━━━━┿━━━━━┿━━━━━╋━━━━━┿━━━━━┿━━━━━╋━━━━━┿━━━━━┿━━━━━┫`;
  const baseBottomLine = `┗━━━━━┷━━━━━┷━━━━━┻━━━━━┷━━━━━┷━━━━━┻━━━━━┷━━━━━┷━━━━━┛`;

  const color = ok ? c.ok : c.ko;

  let l = "";
  // which line are we in ?
  if (j === 8) l = baseBottomLine;
  else if ((j + 1) % 3 === 0) l = baseCrossLine;
  else l = baseLine;

  // get line part corresponding to the cell
  let end = i * 6 + 6;
  i === 8 && end++;
  const part = l.slice(i * 6, end);

  if (opts.line === j + 1 || opts.line === j) {
    return `${color}${part}${c.reset}`;
  } else if (opts.column === i) {
    return `${color}${part}${c.reset}`;
  } else if (opts.column === i - 1) {
    const [p1, ...pr] = part.split("");
    return `${color}${p1}${c.reset}${pr.join("")}`;
  } else if (opts.box === box) {
    return `${color}${part}${c.reset}`;
  } else if (opts.box === box + 3 && (j + 1) % 3 === 0) {
    return `${color}${part}${c.reset}`;
  } else if (opts.box === box + 2 && (j + 1) % 3 === 0 && i % 3 === 0 && i !== 0) {
    const [p1, ...pr] = part.split("");
    return `${color}${p1}${c.reset}${pr.join("")}`;
  } else if (opts.box === box - 1 && i % 3 === 0 && i !== 0) {
    const [p1, ...pr] = part.split("");
    return `${color}${p1}${c.reset}${pr.join("")}`;
  }

  return part;
}

const val = (opts = {}, ok, i, j, box, cell, cb) => {
  const color = ok ? c.ok : c.ko;

  let start = i === 0 ? `┃` : ``;
  let end = (i + 1) % 3 === 0 ? `┃` : `│`;

  let value = cell.value ? `  ${cell.value}  ` : "     ";
  if (cell.justAdded) {
    value = `${c.add}${value}${c.reset}`;
  } else if (cell.justGuessed) {
    value = `${c.guess}${value}${c.reset}`;
  }

  if (cell.value === null && cell.choices && cell.choices.length < 6) {
    value = c.choices + String(cell.choices.map((i) => indices[i]).join("")).padEnd(5, " ") + c.reset;
  }

  let s = `${start}${value}${end}`;

  if (opts.line === j) {
    s = `${color}${start}${value}${end}${c.reset}`;
  } else if (opts.column === i) {
    s = `${color}${start}${value}${end}${c.reset}`;
  } else if (opts.column === i + 1) {
    s = `${start}${value}${color}${end}${c.reset}`;
  } else if (opts.box === box) {
    s = `${color}${start}${value}${end}${c.reset}`;
  } else if (opts.box === box + 1 && (i + 1) % 3 === 0 && i !== 8) {
    s = `${start}${value}${color}${end}${c.reset}`;
  }
  cb && cb({ text: s, i, j });
  return s;
};

const store = [];
function printGrid(grid, opts = {}, ok, text, cb) {
  CLEAR_SCREEN && console.clear();
  if (opts.full) {
    process.stdout.write(c.ok);
  }
  const fl = firstLine(opts, ok, 0, 0, grid[0][0].box);
  console.log(fl);

  for (let j = 0; j < grid.length; j++) {
    const l = grid[j];
    let printableLine = "";
    let printableCrossLine = "";
    for (let i = 0; i < l.length; i++) {
      const cellStr = JSON.stringify({ text: l[i].value || "   ", i, j, ok: ok || -1, opts, cell: l[i] });
      if (!store[i]) store[i] = [];
      if (!store[i][j]) {
        store[i][j] = cellStr;
        cb && cb(cellStr);
      } else if (store[i][j] !== cellStr) {
        store[i][j] = cellStr;
        cb && cb(cellStr);
      }
      printableLine += val(opts, ok, i, j, l[i].box, l[i]);
      printableCrossLine += getCrossingLine(opts, ok, i, j, l[i].box);
    }
    console.log(printableLine);
    console.log(printableCrossLine);
  }

  if (opts.full) {
    process.stdout.write(c.reset);
  }

  if (text) {
    const infos = `
    grid: ${text.name}
    loop number: ${text.loop}
    failed: ${text.failed}
    reason: ${text.reason}
    rollback: ${text.rollback}
    backTrack Size: ${text.backTrack}
  `;
    console.log(infos);
    cb && cb(JSON.stringify({
      infos: true,
      text
    }));
  }
}

module.exports = { printGrid };
