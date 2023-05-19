const bookingRepo = require('../repositories/booking');

const createBooking = async (booking) => {
    const savedBooking = await bookingRepo.save(booking);
    return savedBooking;
}

const removeBooking = async (bookingId) => {
    return bookingRepo.remove(bookingId);
}

const updateBooking = async (bookingId, infoToUpdate) => {
    return bookingRepo.update(infoToUpdate, {_id: bookingId})
}

const getBookingById = async (bookingId) => {
    return bookingRepo.findById(bookingId);
}


module.exports = {
    removeBooking,
    createBooking,
    updateBooking,
    getBookingById,
}
