let color;

export function getCurrentPosition(board_size) {
  let board = []; // Declare the board array
  let squares = document.querySelectorAll("div.square");

  for (let i = 0; i < board_size; i++) {
    let row = []; // Declare a new row array for each iteration of i

    for (let j = 0; j < board_size; j++) {
      // Declare j using let
      let square = squares[i * board_size + j];

      if (square.hasChildNodes()) {
        row.push(square.childNodes[0].alt);
      } else if (
        square.classList.contains("green") ||
        square.classList.contains("white")
      ) {
        row.push("  ");
      } else {
        row.push(null);
      }
    }
    board.push(row);
  }

  return board; // Return the 2D board array
}

export function isValidMove(row, col, t_row, t_col, piece, board_state) {
  switch (true) {
    case piece.endsWith("p"):
      if (checkPawnMove(row, col, t_row, t_col, piece, board_state)) {
        return true;
      } else {
        return false;
      }

    case piece.endsWith("r"):
      if (checkRookMove(row, col, t_row, t_col, piece, board_state)) {
        return true;
      } else {
        return false;
      }

    case piece.endsWith("n"):
      if (checkKnightMove(row, col, t_row, t_col, piece, board_state)) {
        return true;
      } else {
        return false;
      }

    case piece.endsWith("b"):
      if (checkBishopMove(row, col, t_row, t_col, piece, board_state)) {
        return true;
      } else {
        return false;
      }

    case piece.endsWith("q"):
      if (checkQueenMove(row, col, t_row, t_col, piece, board_state)) {
        return true;
      } else {
        return false;
      }

    case piece.endsWith("k"):
      if (checkKingMove(row, col, t_row, t_col, piece, board_state)) {
        return true;
      } else {
        return false;
      }

    default:
      console.log("unknown piece");
  }
}

//function for checking if promotion is valid
export function isPawnPromotion(t_row, piece) {
  color = piece.slice(0,1);
  if (t_row === 4 || t_row === 11) {
    return true;
  }
  return false;
}

function checkPawnMove(row, col, t_row, t_col, piece, board_state) {
  let direction = piece.startsWith("w") ? 1 : -1;
  let size = board_state.length;
  let off_set = Math.floor((size - 7) / 2);
  let current_row = piece.startsWith("w") ? 1 : -1;

  //normal move
  if (
    (row - t_row === -1 || row - t_row === 1) &&
    col === t_col &&
    board_state[t_row][t_col] !== null
  ) {
    if (board_state[row + direction][col] === "  ") {
      console.log(true);
      return true;
    }
  }

  //2 forward first move
  if (
    (row - t_row === -2 || row - t_row === 2) &&
    col === t_col &&
    (row == off_set + 1 || row === size - off_set - 2) &&
    board_state[row + direction][col] === "  " &&
    board_state[t_row][t_col] !== null
  ) {
    if (board_state[row + direction * 2][col] === "  ") {
      return true;
    }
  }

  // null square in front movement logic
  if (board_state[row + direction][col] === null) {
    while (true) {
      //checks if exceeding bounds of board
      if (row + current_row >= size || row + current_row < 0) {
        console.log("exceeding board bounds");
        break;
      }

      //check if square in front is null
      if (board_state[row + current_row][col] === null) {
        console.log(board_state[row + current_row][col]);
        if (current_row < 0) {
          current_row--;
        }
        if (current_row > 0) {
          current_row++;
        }
        continue;
      }

      //if square in front is empty, then move the piece
      if (
        board_state[row + current_row][col] === "  " &&
        t_row == row + current_row
      ) {
        console.log(true);
        return true;
      }

      break;
    }
  }
  
  // pawn capture
  if (
    (row - t_row === -1 || row - t_row === 1) &&
    (col - t_col === -1 || col - t_col === 1) &&
    (board_state[t_row][t_col] !== null) &&
    (board_state[t_row][t_col] !== "  ") &&
    ((color !== (board_state[t_row][t_col]?.[0] ?? false)))
  ) {
    console.log("this is a pawn capture");
    return true;
  }

  console.log(false);
  return false;
}

function checkRookMove(row, col, t_row, t_col, piece, board_state) {
  //make sure that the target row/col match current row/col
  if (row !== t_row && col !== t_col) {
    console.log(false);
    return false;
  }

  //check row
  if (row == t_row) {
    let direction = col < t_col ? 1 : -1;
    for (let c = col + direction; c !== t_col; c += direction) {
      if (board_state[row][c] !== "  ") {
        if (board_state[row][c] === null) {
          continue;
        }
        console.log(`Path blocked at (${row}, ${c})`);
        return false;
      }
    }
  }

  //check col
  if (col === t_col) {
    let direction = row < t_row ? 1 : -1; // Determine direction of movement
    for (let r = row + direction; r !== t_row; r += direction) {
      if (board_state[r][col] !== "  ") {
        if (board_state[r][col] === null) {
          continue;
        }
        console.log(`Path blocked at (${r}, ${col})`);
        return false; // Path is blocked
      }
    }
  }

  //if it is an empty square, move
  if (board_state[t_row][t_col] === "  ") {
    console.log(true);
    return true;
  }

  //check if the piece is a different color and capture
  let color = piece.slice(0,1);
  if ((color !== (board_state[t_row][t_col]?.[0] ?? false)) &&
      (board_state[t_row][t_col] !== "  ") &&
      (board_state[t_row][t_col] !== null)) {
    return true;
  }

  return false;
}

function checkBishopMove(row, col, t_row, t_col, piece, board_state) {
  // Check if the move is diagonal
  if (Math.abs(row - t_row) !== Math.abs(col - t_col)) {
    console.log(false);
    return false;
  }

  // Determine the direction of movement
  let rowDirection = row < t_row ? 1 : -1;
  let colDirection = col < t_col ? 1 : -1;

  // Check all squares along the diagonal path
  let r = row + rowDirection;
  let c = col + colDirection;
  while (r !== t_row || c !== t_col) {
    if (board_state[r][c] === null) {
      // Skip null squares
      r += rowDirection;
      c += colDirection;
      continue;
    }

    if (board_state[r][c] !== "  ") {
      console.log(`Path blocked at (${r}, ${c})`);
      return false; // Path is blocked
    }

    r += rowDirection;
    c += colDirection;
  }

  // Check if the target square is valid
  if (board_state[t_row][t_col] === "  ") {
    console.log(true);
    return true;
  }

  //check if the piece is a different color for capture
  color = piece.slice(0,1);
  if ((color !== (board_state[t_row][t_col]?.[0] ?? null)) &&
      (board_state[t_row][t_col] !== "  ") &&
      (board_state[t_row][t_col] !== null)) {
    return true;
  }
  return false;
}

function checkKnightMove(row, col, t_row, t_col, piece, board_state) {
  // Define all possible knight moves
  const knightMoves = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
  ];

  let possKnightMove = [t_row - row, t_col - col];
  color = piece.slice(0,1);

  //checks for valid knights moves (first two if checks)...then it checks if it is an valid square to move to
  for(let item = 0; item < knightMoves.length; item++) {
    if ((possKnightMove[0] === knightMoves[item][0]) && 
        (possKnightMove[1] === knightMoves[item][1]) &&
        (board_state[t_row][t_col] !== null) &&
        (color !== (board_state[t_row][t_col]?.[0] ?? null))) {
      return true;
    }
  }   

  return false;
}

function checkQueenMove(row, col, t_row, t_col, piece, board_state) {

  checkBishopMove(row, col, t_row, t_col, piece, board_state);
  checkRookMove(row, col, t_row, t_col, piece, board_state);

  return (checkBishopMove(row, col, t_row, t_col, piece, board_state) || checkRookMove(row, col, t_row, t_col, piece, board_state));
}

function checkKingMove(row, col, t_row, t_col, piece, board_state) {
  // Define all possible king moves (one square in any direction)
  const kingMoves = [
    [1, 0],  // Down
    [-1, 0], // Up
    [0, 1],  // Right
    [0, -1], // Left
    [1, 1],  // Down-Right
    [1, -1], // Down-Left
    [-1, 1], // Up-Right
    [-1, -1], // Up-Left
  ];

  // Check if the target move matches any valid king move
  const isValidKingMove = kingMoves.some(([dr, dc]) => {
    return row + dr === t_row && col + dc === t_col;
  });

  if (!isValidKingMove) {
    return false;
  }

  // Check if the target square is valid
  if (
    board_state[t_row]?.[t_col] === "  " || // Empty square
    (board_state[row][col].startsWith("w") && board_state[t_row]?.[t_col]?.startsWith("b")) || // Opponent's piece
    (board_state[row][col].startsWith("b") && board_state[t_row]?.[t_col]?.startsWith("w"))
  ) {
    return true;
  }

  //check if the piece is a different color for capture
  color = piece.slice(0,1);
  if ((color !== (board_state[t_row][t_col]?.[0] ?? null)) &&
      (board_state[t_row][t_col] !== "  ") &&
      (board_state[t_row][t_col] !== null))  {
    return true;
  }

  return false;
}

/*
To Do:
1. start server-side stuff
  -websockets
  -node.js file
*/

/* RULES */
//no en passant
//pawn can move backwards
//pawn auto promote to queen on 4th and 11th ranks
//pawns, bishops, rooks, queens can move over empty squares to the next availble square
//can move one piece and one square on your turn

