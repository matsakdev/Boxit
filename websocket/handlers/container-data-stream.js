const LiveDataStreamingService = require('../../services/live-data-streaming');
const WebsocketSubscribeTypes = require('../../constants/websocket-subscribe-types')

const subscribeOnContainerDataStream = (webSocketMessage, webSocketSession) => {
  const containerId = webSocketMessage.containerId;
  console.log(`subscribe to ${containerId}`);
  LiveDataStreamingService.addSubscriber(webSocketSession, {
    type: WebsocketSubscribeTypes.GET_CONTAINER_INFO,
    containerId
  });
}

module.exports = subscribeOnContainerDataStream;
