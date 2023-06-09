const moment = require('moment');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/user')
const { User } = require("../models/user");

const register = async (user, password) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            return userRepo.register(user, hash);
        })
    })
}

const findByUsername = username => {
    return User.getModel(userRepo.findByUsername(username));
}

const findByEmail = email => {
    return User.getModel(userRepo.findByEmail(email));
}

const findById = id => {
    return User.getModel(userRepo.findById(id));
}

const updateLoginInfo = userId => userRepo.update(
    {
        last_login: moment.utc().toDate()
    },
    { where: { userId } },
);

const getJwtTokenPair = (user) => {
    const userInfo = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role
    }

    return {
        token: getSignedJwtToken({user: userInfo})
    }
}

const getSignedJwtToken = data => {
    return jwt.sign(data, process.env.TOKEN_SECRET_KEY, {
        expiresIn: `${process.env.TOKEN_EXPIRES_IN_MIN}m`,
    })
}

const findAllUsers = async () => {
    const users = await userRepo.findAllUsers();
    return users.map(user => User.getModel(user));
}

const findAllTestUsers = async () => {
    const users = await userRepo.findAllTestUsers();
    return users.map(user => User.getModel(user));
}

module.exports = {
    register,
    updateLoginInfo,
    getJwtTokenPair,
    findByUsername,
    findByEmail,
    findById,
    findAllUsers,
    findAllTestUsers,
}
