const bookingService = require('../services/booking');

const getBooking = async (req, res, next) => {
    const { bookingId } = req.params;
    const booking = await bookingService.getBookingById(bookingId);
    return res.status(200).json(booking);
}

const createBooking = async (req, res, next) => {
    const { booking } = req.body;
    const savedBooking = bookingService.createBooking(booking);
    return res.status(201).json(savedBooking);
}

const removeBooking = async (req, res, next) => {
    const { bookingId } = req.params;
    try {
        const removedBooking = bookingService.removeBooking(bookingId);
        return res.status(201).json(removedBooking);
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

const updateBookingInfo = async (req, res, next) => {
    const { bookingId } = req.params;
    const { booking: infoToUpdate } = req.body;
    const updatedBooking = await bookingService.updateBooking(bookingId, infoToUpdate);
    return res.status(201).json(updatedBooking);
}

module.exports = {
    getBooking,
    createBooking,
    removeBooking,
    updateBookingInfo
}
