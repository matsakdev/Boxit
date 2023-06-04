const { omitBy, isNil } = require('lodash');

const HttpError = require('./http-error');

class ServerHttpError extends HttpError {
  constructor(message = 'Server error', param = null, code = null) {
    super(500, message);
    this.param = param;
    this.code = code;
  }

  serialize() {
    const serializedObject = {
      message: this.message,
      param: this.param,
      code: this.code,
    };

    return JSON.stringify(omitBy(serializedObject, isNil));
  }
}

module.exports = ServerHttpError;
