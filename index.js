const { WS } = require("./sudoku/config");
if(WS)
  require('./back/index')
else {
  const { all } = require("./sudoku");

  all().then(() => {
    process.exit(0);
  });
}
