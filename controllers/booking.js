const moment = require("moment");
const bookingService = require("../services/booking");
const BadRequest = require("../http-errors/bad-request");
const { getDistance } = require("../services/distance-service");

const getBooking = async (req, res, next) => {
  const { bookingId } = req.params;
  const booking = await bookingService.getBookingById(bookingId);
  return res.status(200).json(booking);
};

const getAllBookings = async (req, res, next) => {
  try {
    const allBookings = await bookingService.getAllBookings();
      await getDistance({
        latitude: 50.27,
        longitude: 30.31,
      }, {
        latitude: 50.00,
        longitude: 36.13,
      });
    return res.status(200).json(allBookings);
  } catch (error) {
    return res.status(400).send();
  }

};

const createBooking = async (req, res, next) => {
  try {
    const { booking } = req.body;
    const savedBooking = await bookingService.createBooking(booking);
    return res.status(201).json(savedBooking);
  } catch (error) {
    return next(new BadRequest(error.message));
  }

};

const removeBooking = async (req, res, next) => {
  const { bookingId } = req.params;
  try {
    const removedBooking = await bookingService.removeBooking(bookingId);
    return res.status(201).json(removedBooking);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

const updateBookingInfo = async (req, res, next) => {
  const { bookingId } = req.params;
  const { booking: infoToUpdate } = req.body;
  try {
    const updatedBooking = await bookingService.updateBooking(bookingId, infoToUpdate);
    return res.status(201).json(updatedBooking);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

const getBookingsForMonth = async (req, res, next) => {
  const { year, month } = req.params;
  try {
    const bookings = await bookingService.getAllBookingsForMonth(year, month+1);
    return res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

const getBookingsForCurrentMonth = async (req, res, next) => {
  const currentYear = moment().year();
  const currentMonth = moment().month();
  try {
    const bookings = await bookingService.getAllBookingsForMonth(currentYear, currentMonth);
    return res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

module.exports = {
  getBooking,
  getAllBookings,
  createBooking,
  removeBooking,
  updateBookingInfo,
  getBookingsForMonth,
  getBookingsForCurrentMonth
};
