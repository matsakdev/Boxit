const authRouter = require('./auth');
const userRouter = require('./user');
const containerRouter = require('./containers');
const bookingRouter = require('./booking')
const adminRouter = require('./admin');
const initRouter = (app) => {
    authRouter(app);
    userRouter(app);
    containerRouter(app);
    bookingRouter(app);
    adminRouter(app);
}

module.exports = initRouter;
