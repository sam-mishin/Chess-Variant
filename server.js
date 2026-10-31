import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static('.'));

wss.on('connection', (ws) => {
    console.log("Player connected!");
});

server.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});