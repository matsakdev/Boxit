const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  note: String,
  container: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  requirements: {
    type: Map,
    of: String
  },
  violationRecorded: {
    type: Boolean,
    default: false
  }
});

const BookingMongoModel = mongoose.model("Booking", bookingSchema);

const save = async (booking) => {
  const bookingModel = new BookingMongoModel({
    ...booking
  });
  const savedBooking = await bookingModel.save();

  return savedBooking;
};

const update = async (infoToUpdate, filter) => {
  return BookingMongoModel.findOneAndUpdate(filter, infoToUpdate, { returnOriginal: false });
};

const findById = async (id) => {
  return BookingMongoModel.findById(id);
};

const remove = async (bookingId) => {
  return BookingMongoModel.deleteOne({ _id: bookingId });
};

const findAllBookings = async () => {
  return BookingMongoModel.find();
};

const findContainerBookings = async (containerId, filter) => {
  return BookingMongoModel.find({ container: containerId, ...filter });
};

const bulkSave = async (bookings) => {
  return BookingMongoModel.insertMany(bookings);
};

const findAllBookingsInTimeRange = async (timeFrom, timeTo) => {
  return BookingMongoModel.find({
    startTime: { $lte: timeTo },
    endTime: { $gte: timeFrom }
  });
};

module.exports = {
  save,
  update,
  findById,
  remove,
  findAllBookings,
  findContainerBookings,
  bulkSave,
  findAllBookingsInTimeRange
};
