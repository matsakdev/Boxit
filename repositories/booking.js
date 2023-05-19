const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    startTime: Date,
    endTime: Date,
    note: String,
    container: mongoose.Schema.Types.ObjectId,
    user: mongoose.Schema.Types.ObjectId,
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

module.exports = {
    save,
    update,
    findById,
    remove
}
