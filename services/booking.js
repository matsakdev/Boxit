const bookingRepo = require('../repositories/booking');
const BadRequestError = require('../http-errors/bad-request');

const createBooking = async (booking) => {
    try {
        const savedBooking = await bookingRepo.save(booking);
        return savedBooking;
    } catch (error) {
        throw new Error(error.message);
    }
}

const removeBooking = async (bookingId) => {
    return bookingRepo.remove(bookingId);
}

const updateBooking = async (bookingId, infoToUpdate) => {
    if (!infoToUpdate) {
        throw new BadRequestError(`"booking" parameter is empty or don't exists in request body`);
    }
    return bookingRepo.update(infoToUpdate, {_id: bookingId})
}

const getBookingById = async (bookingId) => {
    return bookingRepo.findById(bookingId);
}

const getAllBookings = async () => {
    return bookingRepo.findAllBookings();
}


module.exports = {
    removeBooking,
    createBooking,
    updateBooking,
    getBookingById,
    getAllBookings,
}
