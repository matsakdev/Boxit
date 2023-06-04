const mongoose = require('mongoose');
const LocationTypes = require('../constants/location-types');

const locationSchema = new mongoose.Schema({
  title: String,
  locationType: {
    type: String,
    enum: LocationTypes
  },
  coordinates: String
});

const LocationMongoModel = mongoose.model('Location', locationSchema);

const save = async (locationModel) => {
  const locationMongoModel = new LocationMongoModel({
    ...locationModel
  });

  return locationMongoModel.save();
}

const update = async (infoToUpdate, filter) => {
  return LocationMongoModel.findOneAndUpdate(filter, infoToUpdate, { returnOriginal: false });
};

const findById = async (id) => {
  return LocationMongoModel.findById(id);
};

const deleteLocation = async (locationId) => {
  return LocationMongoModel.deleteOne({ _id: locationId });
};

module.exports = {
  save,
  update,
  findById,
  deleteLocation
}


