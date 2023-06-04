const MessagesTypes = {
  GET_CONTAINER_INFO: "get_info",
  STOP_RECEIVING_CONTAINER_INFO: "stop_info",
};

const MessagesTypesReversed = Object.entries(MessagesTypes).reduce((acc, [key, value]) => {
  return { ...acc, [value]: key };
}, {});

module.exports = {
  MessagesTypes,
  MessagesTypesReversed
};
