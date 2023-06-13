const ws = require("ws");
const processMessage = require('./message-processor');

const WEB_SOCKET_PORT=process.env.WEB_SOCKET_PORT;

const onConnection  = (webSocketSession, clients) => {
  webSocketSession.on('connection', (webSocket) => {
    clients.add(webSocketSession);

    //connection is up, let's add a simple event
    webSocket.on('message', (message) => {

      processMessage(webSocket, message);
    });

    //send immediatly a feedback to the incoming connection
    webSocket.send('Hi there, I am a WebSocket server');

    webSocket.on('close', () => {
      console.log(`Client disconnected: `, webSocketSession);
      clients.delete(webSocketSession);
    })
  });
}

const initWebSockets = (httpServer) => {
  const clients = new Set();

  const wsServer = new ws.WebSocketServer({ port: WEB_SOCKET_PORT });

  onConnection(wsServer, clients);
};

module.exports = initWebSockets;
