const subscribers = new Map();
const WebsocketSubscribeTypes = require('../constants/websocket-subscribe-types');

const addSubscriber = (webSocketSubscriber, subscribingInfo) => {
  subscribers.set(webSocketSubscriber, {
    subscriber: webSocketSubscriber,
    type: subscribingInfo.type,
    ...subscribingInfo
  })
}

const removeSubscriber = (webSocketSubscriber) => {
  return subscribers.delete(webSocketSubscriber);
}

// TODO less resource-hungry
const shareContainerInfoLiveData = (containerId, measurement) => {
  const subscribersIterator = subscribers.values();
  for (const subscriberInfo of subscribersIterator) {
    if (subscriberInfo.type === WebsocketSubscribeTypes.GET_CONTAINER_INFO && subscriberInfo.containerId === containerId) {
      subscriberInfo.subscriber.send(measurement.toString());
    }
  }
}

module.exports = {
  addSubscriber,
  removeSubscriber,
  shareContainerInfoLiveData,
}
