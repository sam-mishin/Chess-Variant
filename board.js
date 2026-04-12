import { getCurrentPosition, isValidMove, isPawnPromotion } from "./pieces.js";

export function renderBoard(size, layout) {
  const board = document.getElementById("chessboard");
  let selectedSquare = null;
  let selectedPiece = null; // Track the currently selected piece
  let target_square = null;
  let piece = null;
  let board_state = null;
  let currentTurn = "w";
  let hasMovedPiece = false;
  let hasMovedSquare = false;

  //server stuff
  const ws = new WebSocket('ws://localhost:8080');

  // WebSocket event handlers
  ws.onopen = () => {
    console.log('Connected to game server');
    //sending message
    ws.send('this is a message');
  };


  // board map to track square positions
  const boardMap = {};
  for (let row = size - 1; row >= 0; row--) {
    for (let col = 0; col < size; col++) {
      boardMap[`${row},${col}`] = {
        piece: null,
        active: false,
      };
    }
  }

  //give initial 8x8 board
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let off_set = Math.floor((size - 7) / 2);
      if (i + off_set < 8 + off_set && j + off_set < 8 + off_set) {
        boardMap[`${i + off_set},${j + off_set}`] = { active: true };
      }
    }
  }

  // Place the initial board layout
  for (let i = 0; i < layout.length; i++) {
    const { row, col, piece } = layout[i]; // Destructure row, col, and piece
    let off_set = Math.floor((size - 7) / 2);
    boardMap[`${row + off_set},${col + off_set}`] = {
      piece: piece, // Place the piece on the board
      active: true, // Mark the square as active
    };
  }

  // Render the board
  function render() {
    board.innerHTML = "";

    const keys = Object.keys(boardMap);
    const cords = keys.map((key) => key.split(",").map(Number));
    const minRow = Math.min(...cords.map((c) => c[0]));
    const maxRow = Math.max(...cords.map((c) => c[0]));
    const minCol = Math.min(...cords.map((c) => c[1]));
    const maxCol = Math.max(...cords.map((c) => c[1]));

    const colCount = maxCol - minCol + 1;

    board.style.gridTemplateColumns = `repeat(${colCount}, 60px)`;

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const key = `${row},${col}`;
        const square = document.createElement("div");
        square.classList.add("square");

        if (boardMap[key].active) {
          square.classList.add((row + col) % 2 === 0 ? "green" : "white");
        }

        if (boardMap[key]) {
          square.dataset.row = row;
          square.dataset.col = col;

          if (boardMap[key].piece) {
            const pieceElement = document.createElement("img");
            pieceElement.classList.add("piece");
            pieceElement.src = `./assets/pieces-basic-png/${boardMap[key].piece}.png`;
            pieceElement.alt = boardMap[key].piece; // Display the piece name
            square.appendChild(pieceElement);

            // Add drag event listeners
            pieceElement.draggable = true; // Make the piece draggable

            pieceElement.addEventListener("dragstart", () => {
              piece = boardMap[key].piece;
            });


            pieceElement.addEventListener("dragend", () => {
              board_state = getCurrentPosition(size);

              //turn logic
              if (hasMovedPiece) return; //don't allow player to move two piees
              if (!piece.startsWith(currentTurn)) return; //only allow the player of the same color to move the piece
              
              //move logic
              if (isValidMove(row, col, target_square.row, target_square.col, piece, board_state)) {

                if ((isPawnPromotion(target_square.row, piece)) &&
                    (piece === "wp" || piece === "bp")) {
                  let color = piece.slice(0,1);
                  
                  boardMap[`${row},${col}`].piece = null;
                  boardMap[`${target_square.row},${target_square.col}`].piece = `${color}q`;
                  
                  render();
                  endTurnIfDone();
                } else {
                  boardMap[`${row},${col}`].piece = null;
                  boardMap[`${target_square.row},${target_square.col}`].piece = piece;
                }



                hasMovedPiece = true;
                endTurnIfDone();
                render();
                
                if (checkWin()) return; // stop if the game is over
              }
            });
          }

          square.addEventListener("dragover", (e) => {
            e.preventDefault(); // Allow dropping
            target_square = { row, col };
          });

          square.onmousedown = () => {
            squareHandleMouseDown(row, col);
          };
          square.onmouseup = () => {
            squareHandleMouseUp(row, col);
          };

          if (
            selectedSquare &&
            selectedSquare.row === row &&
            selectedSquare.col === col
          ) {
            square.classList.add("detached");
          }
        }

        board.appendChild(square);
      }
    }
  }

  function endTurnIfDone() {
    console.log(hasMovedPiece, hasMovedSquare);
    if (hasMovedPiece && hasMovedSquare) {
      // both actions completed — switch turns
      currentTurn = currentTurn === "w" ? "b" : "w";
      hasMovedPiece = false;
      hasMovedSquare = false;
      console.log(`Turn switched: now it's ${currentTurn === "w" ? "White" : "Black"}'s turn`);
    }
  }

  function checkWin() {
    let hasWhiteKing = false;
    let hasBlackKing = false;

    for (let key in boardMap) {
      const piece = boardMap[key].piece;
      if (piece === "wk") hasWhiteKing = true;
      if (piece === "bk") hasBlackKing = true;
    }

    if (!hasWhiteKing) {
      alert("Black wins!");
      return true;
    }
    if (!hasBlackKing) {
      alert("White wins!");
      return true;
    }

    return false;
  }

  // Check if a square has at least one open side
  function canBeMoved(row, col) {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    let has_open_side = directions.some(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if the new position is within bounds
      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
        return false;
      }

      return !boardMap[`${newRow},${newCol}`]?.active;
    });

    let is_connected_to_board = directions.some(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if the new position is within bounds
      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
        return false;
      }

      return boardMap[`${newRow},${newCol}`]?.active;
    });

    return has_open_side && is_connected_to_board;
  }

  function isValidAttachPoint(row, col) {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];

    let adjacent_square = directions.some(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;

      // Check if the new position is within bounds
      if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
        return false;
      }

      return boardMap[`${newRow},${newCol}`]?.active;
    });

    return adjacent_square;
  }

  function squareHandleMouseDown(row, col) {
    if (!boardMap[`${row},${col}`]) return;

    if (selectedSquare) {
      // Deselect
      selectedSquare = null;
    } else {
      if (!canBeMoved(row, col)) return;
      selectedSquare = { row, col };
    }

    render();
  }

  function squareHandleMouseUp(new_row, new_col) {
    if (!selectedSquare) return;
    
    // turn logic for squares
    if (hasMovedSquare) return; 

    let old_row = selectedSquare.row;
    let old_col = selectedSquare.col;

    // make sure that a new square isn't being spawned in
    if (old_row !== new_row || old_col !== new_col) {
      //make sure that squares cannot disappear or appear; new row/col has to be active: false and old row/col has to be active:true
      if (
        !boardMap[`${new_row},${new_col}`].active &&
        boardMap[`${old_row},${old_col}`].active &&
        isValidAttachPoint(new_row, new_col)
      ) {
        boardMap[`${old_row},${old_col}`] = {
          piece: null,
          active: false,
        };

        // Update the new position to be active
        boardMap[`${new_row},${new_col}`] = {
          piece: null,
          active: true,
        };
      }
    }

    hasMovedSquare = true;
    endTurnIfDone();

    selectedSquare = null;
    render();
  }

  render();
}
