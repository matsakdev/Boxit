const WebsocketError = require("../http-errors/websocket-error");
const { MessagesTypes } = require("../constants/websocket-messages-types");
const subscribeOnContainerDataStream = require('./handlers/container-data-stream')
const { removeSubscriber } = require("../services/live-data-streaming");
const processWebSocketMessage = (webSocket, message) => {
  //log the received message and send it back to the client
  console.log("received: %s", message);
  webSocket.send(`Hello, you sent -> ${message}`);
  try {
    message = getJsonObjectFromBufferedMessage(message);
    const messageHandler = MESSAGE_HANDLERS[message.type];
    if (!messageHandler) {
      throw new WebsocketError(404, `You try to push incorrect message type. Make sure you've specified message type and it's content is correct.`);
    }
    messageHandler(message, webSocket);
  } catch (error) {
    console.log(error);
    if (error.statusCode && error.message) {
      webSocket.send(`ERROR: ${error.message}`);
    } else {
      webSocket.send(`ERROR: Something went wrong. Try to send message once more or try later. Maybe our server is tired:(`);
    }
  }
};

const getJsonObjectFromBufferedMessage = (bufferedMessage) => {
  return JSON.parse(bufferedMessage.toString());
};

const MESSAGE_HANDLERS = {
  [MessagesTypes.GET_CONTAINER_INFO]: (message, webSocket) => subscribeOnContainerDataStream(message, webSocket),
  [MessagesTypes.STOP_RECEIVING_CONTAINER_INFO]: (message, webSocket) => removeSubscriber(webSocket),
}
module.exports = processWebSocketMessage;
