export function convertBoardto2D(boardMap) {
  let board = []; // Declare the board array
  const boardSize = Math.sqrt(Object.keys(boardMap).length);

  for (let i = 0; i < boardSize; i++) {
    let row = [];
    for (let j = 0; j < boardSize; j++) {
      let key = `${i},${j}`;

      if (!boardMap[key].active) {
        row.push(null);
        continue;
      }
      if (
        boardMap[key].active &&
        !boardMap[key].piece
      ) {
        row.push("  ");
        continue;
      }
      if (
        boardMap[key].active &&
        boardMap[key].piece
      ) {
        row.push(boardMap[key].piece);
      }
    }
    board.push(row);
  }


  return board; // Return the 2D board array
}
