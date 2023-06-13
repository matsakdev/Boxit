const bookingRepo = require("../repositories/booking");
const BadRequestError = require("../http-errors/bad-request");
const moment = require("moment");
const BookingModel = require('../models/booking');

const createBooking = async (booking) => {
  try {
    const savedBooking = await bookingRepo.save(booking);
    return savedBooking;
  } catch (error) {
    throw new Error(error.message);
  }
};

const removeBooking = async (bookingId) => {
  return bookingRepo.remove(bookingId);
};

const updateBooking = async (bookingId, infoToUpdate) => {
  if (!infoToUpdate) {
    throw new BadRequestError(`"booking" parameter is empty or don't exists in request body`);
  }
  return bookingRepo.update(infoToUpdate, { _id: bookingId });
};

const getBookingById = async (bookingId) => {
  return bookingRepo.findById(bookingId);
};

const getAllBookings = async () => {
  return bookingRepo.findAllBookings();
};
const getAllBookingsInTimeRange = async (timeFrom, timeTo) => {
  return bookingRepo.findAllBookingsInTimeRange(timeFrom, timeTo);
};

const getAllBookingsForMonth = async (year, month) => {
  const startDate = moment(`${year}-${month}`, 'YYYY-M').startOf('month').toDate();
  const endDate = moment(`${year}-${month}`, 'YYYY-M').endOf('month').toDate();
  console.log(startDate, endDate);
  return bookingRepo.findAllBookingsInTimeRange(startDate, endDate);
}

const getAllBookingsForContainer = async (containerId) => {
  const bookings = await bookingRepo.findContainerBookings(containerId);
  return bookings.map(booking => BookingModel.getModel(booking));
};

const getAllBookingsForContainerInTimeRange = async (containerId, timeFrom, timeTo) => {
  return bookingRepo.findContainerBookings(containerId, {
    startTime: { $lte: { timeTo } },
    endTime: { $gte: { timeFrom } }
  });
};

const bulkSaveBookings = async (bookings) => {
  const status = await bookingRepo.bulkSave(bookings);
  console.log('status', status);
  return status;
}

module.exports = {
  removeBooking,
  createBooking,
  updateBooking,
  getBookingById,
  getAllBookings,
  getAllBookingsForContainer,
  getAllBookingsForContainerInTimeRange,
  bulkSaveBookings,
  getAllBookingsForMonth
};
