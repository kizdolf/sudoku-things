const grids = [
  // {
  //   name: "WAYYYY tooo hard",
  //   grid: [
  //     [2, null, null, null, 8, null, null, null, null],
  //     [null, null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null, null],
  //     [1, null, null, null, null, 4, null, 5, null],
  //     [null, null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null, null],
  //     [3, null, null, null, 9, null, null, null, 8],
  //   ],
  // },

  {
    name: "hard",
    grid: [
      [null, null, null, null, 6, null, 7, null, null],
      [6, 8, null, null, 7, null, null, 9, null],
      [1, 9, null, null, null, 4, 5, null, null],
      [8, null, null, 1, null, null, null, null, null],
      [null, null, 4, 6, null, 2, null, null, null],
      [null, null, null, null, null, 3, null, 2, null],
      [null, null, null, 3, null, null, null, 7, null],
      [null, 4, null, null, 5, null, null, 3, null],
      [7, null, null, null, 1, null, null, null, null],
    ],
  },
  {
    name: "medium",
    grid: [
      [null, null, null, 2, 6, null, 7, null, null],
      [6, 8, null, null, 7, null, null, 9, null],
      [1, 9, null, null, null, 4, 5, null, null],
      [8, null, null, 1, null, null, null, null, null],
      [null, null, 4, 6, null, 2, null, null, null],
      [null, null, null, null, null, 3, null, 2, null],
      [null, null, null, 3, null, null, null, 7, null],
      [null, 4, null, null, 5, null, null, 3, null],
      [7, null, null, null, 1, 8, null, null, null],
    ],
  },

  {
    name: "EZ",
    grid: [
      [null, null, null, 2, 6, null, 7, null, 1],
      [6, 8, null, null, 7, null, null, 9, null],
      [1, 9, null, null, null, 4, 5, null, null],
      [8, 2, null, 1, null, null, null, 4, null],
      [null, null, 4, 6, null, 2, 9, null, null],
      [null, 5, null, null, null, 3, null, 2, 8],
      [null, null, 9, 3, null, null, null, 7, 4],
      [null, 4, null, null, 5, null, null, 3, 6],
      [7, null, 3, null, 1, 8, null, null, null],
    ],
  },
  {
    name: "too hard",
    grid: [
      [null, null, null, null, 6, null, 7, null, null],
      [6, null, null, null, null, null, null, null, null],
      [null, 9, null, null, null, null, 5, null, null],
      [8, null, null, 1, null, null, null, null, null],
      [null, null, 4, null, null, 2, null, null, null],
      [null, null, null, null, null, 3, null, 2, null],
      [null, null, null, null, null, null, null, 7, null],
      [null, 4, null, null, null, null, null, 3, null],
      [7, null, null, null, 1, null, null, null, null],
    ],
  },
  // {
  //   name: "empty",
  //   grid: [
  //     [null, null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null, null],
  //     [null, null, null, null, null, null, null, null, null],
  //   ],
  // },
];

module.exports = { grids };
