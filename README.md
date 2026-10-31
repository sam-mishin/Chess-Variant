# Chess Variant: Moving Squares

A browser chess variant where the board itself is part of the game. On each turn you move a piece **and** move a square, so the board shifts shape as you play.

Built with plain HTML, CSS and JavaScript (ES modules), served by a small Node/Express server with a WebSocket endpoint for upcoming online play.

## How it plays

- The game starts as a normal 8×8 board in the middle of a larger 16×16 grid of empty space.
- **A turn has two parts:** move one of your pieces, and move one board square. The turn passes to the other player once you've done both, in either order.
- **Moving a square:** you can pick up any square that has at least one open edge and is still attached to the board, then drop it on an empty spot that touches the board. Squares can't be created or destroyed, only relocated.
- **Pieces** move by standard chess rules, checked against the current board shape. Pawns promote to a queen.
- **Winning:** capture the opponent's king.

## Run it locally

Requires Node.js 18+.

```bash
npm install
npm start
```

Then open http://localhost:5000. Both players currently share the same screen (hot-seat).

## Project structure

| File | What it does |
| --- | --- |
| `index.html` | Page shell and board container |
| `app.js` | Sets the board size and starting piece layout |
| `board.js` | Renders the board, handles piece drag-and-drop, square moves, turns and win checks |
| `pieces.js` | Move validation for each piece type against the current board state |
| `board.css` | Board and square styling |
| `server.js` | Express static server plus a WebSocket server (`ws`) |
| `assets/` | Piece and square images |

## Roadmap

- [ ] Live two-player matches over WebSockets (rooms, syncing moves between clients)
- [ ] Check and checkmate detection
- [ ] Choice of piece on promotion
- [ ] Deploy a public, playable version

## Tech

JavaScript · HTML5 drag and drop · CSS Grid · Node.js · Express · WebSockets (`ws`)
