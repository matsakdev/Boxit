const express = require('express');
const passport = require('passport');
const userController = require('../../controllers/user');
const authenticate = passport.authenticate('jwt', {session: false});

const userRouter = express.Router();

userRouter.get('/me', userController.getInfoAboutCurrentUser);


module.exports = (app) => {
    app.use('/api/users', authenticate, userRouter);
}
