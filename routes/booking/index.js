const express = require('express');
const bookingController = require('../../controllers/booking')
const passport = require("passport");
const authenticate = passport.authenticate('jwt', {session: false});

const bookingRouter = express.Router();

bookingRouter.get('/:bookingId', bookingController.getBooking);
bookingRouter.get('/', bookingController.getAllBookings);
bookingRouter.get('/month/:year/:month', bookingController.getBookingsForMonth); // todo from param to body
bookingRouter.get('/month/current', bookingController.getBookingsForCurrentMonth); // todo from param to body
bookingRouter.post('/', bookingController.createBooking);
bookingRouter.delete('/:bookingId', bookingController.removeBooking);
bookingRouter.put('/:bookingId', bookingController.updateBookingInfo)


module.exports = (app) => {
    app.use('/api/bookings', bookingRouter);
}
