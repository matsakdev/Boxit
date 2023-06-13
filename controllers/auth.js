const { User } = require('../models/user');
const userService = require('../services/user');
const bcrypt = require('bcrypt');

const BadRequestHttpError = require('../http-errors/bad-request')
const UserRoles = require("../constants/user-roles");
require('dotenv').config();

const login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await userService.findByEmail(email);

    if (!user) {
        return res.status(401).json({message: 'Wrong login'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        return await passportRequestLogin(req, res, next, user);
    } else {
        return res.status(401).json({message: 'Wrong password'});
    }
}

const passportRequestLogin = async (req, res, next, user) => req.login(user, { session: false }, async (error) => {
    if (error) return next(error);

    await userService.updateLoginInfo(user.id);

    const responseJson = userService.getJwtTokenPair(user);
    console.log(responseJson);

    return res.json(responseJson);
});

const signup = async (req, res, next) => {
    const { name, surname, email, password } = req.body;

    try {
        const user = new User({
            name,
            surname,
            email,
            role: UserRoles.USER
        })

        const isEmailRegistered = await userService.findByEmail(user.email);

        if (!!isEmailRegistered) {
            return next(new BadRequestHttpError('Email already registered!', user));
        }

        const registeredUser = userService.register(user, password);

        if (!registeredUser) {
            return next(new BadRequestHttpError('An error occurred while sign up. Please try once more later', user))
        };

        return await passportRequestLogin(req, res, next, registeredUser);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    login,
    signup,
}
