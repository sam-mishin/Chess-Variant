import express from "express";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import path from "path";

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const port = process.env.PORT || 3000;

app.use(express.static(path.join(import.meta.dirname, "public")));

wss.on("connection", (ws) => {
  console.log("Player connected!");
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
