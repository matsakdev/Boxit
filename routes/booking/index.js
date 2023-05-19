const express = require('express');
const bookingController = require('../../controllers/booking')

const bookingRouter = express.Router();

bookingRouter.get('/:bookingId', bookingController.getBooking);
bookingRouter.post('/', bookingController.createBooking);
bookingRouter.delete('/:bookingId', bookingController.removeBooking);
bookingRouter.put('/:bookingId', bookingController.updateBookingInfo)


module.exports = (app) => {
    app.use('/api/bookings', bookingRouter);
}
