import { renderBoard } from "./board.js";

const board_size = 16;
const initial_board = [
  // Black pieces
  { row: 7, col: 0, piece: "br" },
  { row: 7, col: 1, piece: "bn" },
  { row: 7, col: 2, piece: "bb" },
  { row: 7, col: 3, piece: "bq" },
  { row: 7, col: 4, piece: "bk" },
  { row: 7, col: 5, piece: "bb" },
  { row: 7, col: 6, piece: "bn" },
  { row: 7, col: 7, piece: "br" },
  { row: 6, col: 0, piece: "bp" },
  { row: 6, col: 1, piece: "bp" },
  { row: 6, col: 2, piece: "bp" },
  { row: 6, col: 3, piece: "bp" },
  { row: 6, col: 4, piece: "bp" },
  { row: 6, col: 5, piece: "bp" },
  { row: 6, col: 6, piece: "bp" },
  { row: 6, col: 7, piece: "bp" },

  // White pieces
  { row: 0, col: 0, piece: "wr" },
  { row: 0, col: 1, piece: "wn" },
  { row: 0, col: 2, piece: "wb" },
  { row: 0, col: 3, piece: "wq" },
  { row: 0, col: 4, piece: "wk" },
  { row: 0, col: 5, piece: "wb" },
  { row: 0, col: 6, piece: "wn" },
  { row: 0, col: 7, piece: "wr" },
  { row: 1, col: 0, piece: "wp" },
  { row: 1, col: 1, piece: "wp" },
  { row: 1, col: 2, piece: "wp" },
  { row: 1, col: 3, piece: "wp" },
  { row: 1, col: 4, piece: "wp" },
  { row: 1, col: 5, piece: "wp" },
  { row: 1, col: 6, piece: "wp" },
  { row: 1, col: 7, piece: "wp" },
];

renderBoard(board_size, initial_board);
