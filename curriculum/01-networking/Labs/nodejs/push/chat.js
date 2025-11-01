const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let userId = 1;

server.on('connection', socket => {
  const id = Math.floor(Math.random() * 100000);
  socket.send(`User${id} just connected.`);

  socket.on('message', msg => {
    server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`User${id} says: ${msg}`);
      }
    });
  });
});
