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

const getConnectedNicknames = (): string[] => {
  const nicknames: string[] = [];
  wss.clients.forEach((client: ExtWebSocket) => {
    if (client.nickname) {
      nicknames.push(client.nickname);
    }
  });
  return nicknames;
};

const broadcastUserList = () => {
  const nicknames = getConnectedNicknames();
  
  // Exibe a lista de usuários conectados no terminal do servidor
  console.log('-----------------------------');
  console.log('Usuários conectados:');
  nicknames.forEach((nickname) => {
    console.log(`- ${nickname}`);
  });
  console.log('-----------------------------');

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'user-list',
        data: nicknames,
      }));
    }
  });
};

wss.on('connection', (ws: ExtWebSocket) => {
  ws.on('message', (data) => {
    const message = data.toString();
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === 'nickname') {
      ws.nickname = parsedMessage.data;
      console.log(`Client connected with nickname: ${ws.nickname}`);
       // Enviar mensagem de sistema para todos os clientes
       wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'system',
            message: `${ws.nickname} conectou-se à sala.`
          }));
        }
      });
      
      broadcastUserList();
      return;
    }

    if (parsedMessage.type === 'update-nickname') {
      const oldNickname = ws.nickname;
      ws.nickname = parsedMessage.data;
      console.log(`${oldNickname} changed nickname to ${ws.nickname}`);

      // Notificar todos os clientes sobre a mudança de nickname
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'system',
            message: `${oldNickname} alterado para ${ws.nickname}`
          }));
        }
      });

      broadcastUserList();
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

    if (parsedMessage.type === 'poke') {
      const targetNickname = parsedMessage.data;
      const targetClient = Array.from(wss.clients).find((client: ExtWebSocket) => client.nickname === targetNickname);

      if (targetClient && targetClient.readyState === WebSocket.OPEN) {
              // Notificar todos os clientes sobre a ação de cutucar
              wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({
                    type: 'system',
                    message: `${ws.nickname} cutucou ${targetNickname}!`
                  }));
                }
              });
      
              console.log(`${ws.nickname} cutucou ${targetNickname}!`);
            } else {
              // Notificar o cliente que tentou cutucar sobre a falha
              ws.send(JSON.stringify({
                type: 'system',
                message: `O usuário ${targetNickname} não está conectado.`
              }));
            }
          }
        });

  ws.on('close', () => {
    if(ws.nickname){
    console.log(`Client ${ws.nickname || ''} disconnected`);
    
      // Enviar mensagem de sistema para todos os clientes
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'system',
            message: `${ws.nickname} desconectou-se da sala.`
          }));
        }
      });
    broadcastUserList();
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
