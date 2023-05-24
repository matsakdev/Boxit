const { User } = require('../models/user');

const BadRequestHttpError = require('../http-errors/bad-request')
require('dotenv').config();

const getInfoAboutCurrentUser = async (req, res, next) => {
    try {
        const { user } = req;
        const currentUser = new User(user);
        return res.status(200).json(currentUser);
    } catch (err) {
        return next(new BadRequestHttpError(err.message));
    }

}

module.exports = {
    getInfoAboutCurrentUser,
}
