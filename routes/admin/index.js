const express = require('express');
const adminController = require('../../controllers/admin')
const passport = require("passport");

const authenticate = passport.authenticate('jwt', {session: false});

const adminRouter = express.Router();

adminRouter.get('/dump-data', adminController.createMongoDump);
adminRouter.get('/dumps', adminController.getAllDumps);
adminRouter.post('/dump-restore/:dumpId', adminController.restoreDatabaseFromDump);
adminRouter.get('/statistics/containers', adminController.getContainersStatistics);
adminRouter.get('/generators/bookings/:year/:month', adminController.generateBookingsRecords);

module.exports = (app) => {
  app.use('/api/admin', adminRouter);
}
