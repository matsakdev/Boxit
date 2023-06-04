const mongoose = require("mongoose");

const measurementSchema = new mongoose.Schema({
  containerId: mongoose.Schema.Types.ObjectId,
  timestamp: Date,
  values: {
    type: Map,
    of: String
  }
});

const MeasurementMongoModel = mongoose.model("Measurement", measurementSchema);

const save = async (measurement) => {
  const measurementModel = new MeasurementMongoModel({
    ...measurement
  });
  const savedMeasurement = await measurementModel.save();

  return savedMeasurement;
};

const update = async (infoToUpdate, filter) => {
  return MeasurementMongoModel.findOneAndUpdate(filter, infoToUpdate, { returnOriginal: false });
};

const findById = async (id) => {
  return MeasurementMongoModel.findById(id);
};

const deleteMeasurement = async (measurementId) => {
  return MeasurementMongoModel.deleteOne({ _id: measurementId });
};

const findAllMeasurements = async () => {
  return MeasurementMongoModel.find();
};

const findAllMeasurementsOfContainer = async (containerId) => {
  return MeasurementMongoModel.find({ containerId });
};

const findAllMeasurementsOfContainerAfterTime = async (containerId, timeFrom) => {
  return MeasurementMongoModel.find({
    $and: [
      { containerId },
      { timestamp: { $gte: { timeFrom } } }
    ]
  });
};

const findAllMeasurementsOfContainerInTimeRange = async (containerId, timeFrom, timeTo) => {
  return MeasurementMongoModel.find({
    $and: [
      { containerId },
      {
        timestamp: {
          $and: [
            {
              $gte: { timeFrom }
            },
            {
              $lte: { timeTo }
            }
          ]
        }
      }
    ]
  });
};

const findAllMeasurementsOfIndicator = async (containerId, indicatorId) => {
  return MeasurementMongoModel.find(
    {
      $and: [
        { containerId },
        { indicatorId }
      ]
    }
  );
};

const findAllMeasurementsOfIndicatorAfter = async (containerId, indicatorId, timeFrom) => {
  return MeasurementMongoModel.find(
    {
      $and: [
        { containerId },
        { indicatorId },
        { timestamp: { $gte: { timeFrom } } }
      ]
    }
  );
};

const findAllMeasurementsOfIndicatorInTimeRange = async (containerId, indicatorId, timeFrom, timeTo) => {
  return MeasurementMongoModel.find(
    {
      $and: [
        { containerId },
        { indicatorId },
        {
          timestamp: {
            $and: [
              {
                $gte: { timeFrom }
              },
              {
                $lte: { timeTo }
              }
            ]
          }
        }
      ]
    }
  );
};


module.exports = {
  save,
  update,
  findById,
  deleteMeasurement,
  findAllMeasurements,
  findAllMeasurementsOfIndicatorAfter,
  findAllMeasurementsOfContainer,
  findAllMeasurementsOfIndicator,
  findAllMeasurementsOfContainerInTimeRange,
  findAllMeasurementsOfContainerAfterTime,
  findAllMeasurementsOfIndicatorInTimeRange
};
