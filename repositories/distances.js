const mongoose = require("mongoose");
const LocationTypes = require("../constants/location-types");

const locationSchema = new mongoose.Schema({
  title: String,
  locationType: {
    type: String,
    enum: LocationTypes
  },
  longitude: Number,
  latitude: Number
});

const distanceSchema = new mongoose.Schema({
  location: {
    type: locationSchema
  },
  distances: [{
    location: {
      type: locationSchema,
    },
    distance: Number
  }]
});

const DistancesMongoModel = mongoose.model("Container", distanceSchema);

const saveLocation = async (title, locationType, latitude, longitude) => {
  const locationMongoModel = new DistancesMongoModel({
    title,
    locationType,
    longitude,
    latitude
  });

  return locationMongoModel.save();
};

const addDistanceToLocation = async (locationId, locationToJoin, distance) => {
  const location = DistancesMongoModel.findById(locationId);
  if (!location.distances) {
    location.distances = [];
  }
  location.distances.push({
    location: locationToJoin,
    distance
  })

  return location.save();
};

const updateLocationInfo = async (infoToUpdate, filter) => {
  return DistancesMongoModel.findOneAndUpdate(filter, infoToUpdate, { returnOriginal: false });
};

const findById = async (locationId) => {
  return DistancesMongoModel.findById(locationId);
};

const deleteLocation = async (locationId) => {
  return DistancesMongoModel.deleteOne({ _id: locationId });
};

const findDistanceBetweenLocations = async (locationFromName, locationToName) => {
  const location = DistancesMongoModel.findOne({title: locationFromName});
  if (!location) {
    throw new Error(`Location doesn't exist: ${locationFromName}`);
  }
  return location.distances.find(locationWithDist => locationWithDist.location.title === locationToName);
}

module.exports = {
  addDistanceToLocation,
  saveLocation,
  updateLocationInfo,
  findDistanceBetweenLocations,
  deleteLocation,
  findById,
};
