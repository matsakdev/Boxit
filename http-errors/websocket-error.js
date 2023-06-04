class WebsocketError {
  constructor(statusCode, message) {
    this.message = message;
    this.statusCode = statusCode;
  }

  serialize() {
    return JSON.stringify({
      message: this.message,
    });
  }

  toString() {
    return this.message;
  }
}

module.exports = WebsocketError;
