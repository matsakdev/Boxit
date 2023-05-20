const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
});

const BookingMongoModel = mongoose.model('Booking', bookingSchema);

const save = async (booking) => {
    const bookingModel = new BookingMongoModel({
        ...booking
    });
    const savedBooking = await bookingModel.save();

    return savedBooking;
}

const update = async (infoToUpdate, filter) => {
    return BookingMongoModel.findOneAndUpdate(filter, infoToUpdate, {returnOriginal: false});
}

const findById = async (id) => {
    return BookingMongoModel.findById(id);
}

const remove = async (bookingId) => {
    return BookingMongoModel.deleteOne({_id: bookingId});
}

const findAllBookings = async () => {
    return BookingMongoModel.find();
}

module.exports = {
    save,
    update,
    findById,
    remove,
    findAllBookings,
}
