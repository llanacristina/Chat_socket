import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

interface ExtWebSocket extends WebSocket {
  nickname?: string;
}

app.use(express.static('public'));

wss.on('connection', (ws: ExtWebSocket) => {
  //console.log('Client connected');

  ws.on('message', (data) => {
    const message = data.toString();
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'nickname') {
      ws.nickname = parsedMessage.data;
      console.log(`Client connected with nickname: ${ws.nickname}`);
      return;
    }

    if (parsedMessage.type === 'message') {
      const displayMessage = `${ws.nickname}: ${parsedMessage.data}`;
      console.log(displayMessage);

      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            nickname: ws.nickname,
            message: parsedMessage.data
          }));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log(`Client ${ws.nickname || ''} disconnected`);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
