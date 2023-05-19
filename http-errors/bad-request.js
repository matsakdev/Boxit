const { omitBy, isNil } = require('lodash');

const HttpError = require('./http-error');

class BadRequestHttpError extends HttpError {
    constructor(message = 'Bad Request', param = null, code = null) {
        super(400, message);
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

module.exports = BadRequestHttpError;
