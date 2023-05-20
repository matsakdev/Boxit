const authRouter = require('./auth');
const userRouter = require('./user');
const containerRouter = require('./containers');
const bookingRouter = require('./booking')
const initRouter = (app) => {
    authRouter(app);
    userRouter(app);
    containerRouter(app);
    bookingRouter(app);
}

module.exports = initRouter;
