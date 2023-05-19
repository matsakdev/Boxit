const express = require('express');
const authController = require('../../controllers/auth')

const authRouter = express.Router();

authRouter.post('/login', authController.login);
authRouter.post('/signup', authController.signup);


module.exports = (app) => {
    app.use('/api/auth', authRouter);
}
