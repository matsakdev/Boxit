const containerRepo = require("../repositories/container");
const measurementRepo = require('../repositories/measurement');
const LiveDataStreamingService = require('../services/live-data-streaming')

const createContainer = async (container) => {
  try {
    const savedContainer = await containerRepo.save(container);
    return savedContainer;
  } catch (err) {
    throw new Error(`Cannot save container: , ${err.message}`);
  }
};

const removeContainer = async (containerId) => {
  return containerRepo.deleteContainer(containerId);
};

const updateContainer = async (containerId, infoToUpdate) => {
  return containerRepo.update(infoToUpdate, { _id: containerId });
};

const getContainerById = async (containerId) => {
  return containerRepo.findById(containerId);
};

const getAllContainers = async () => {
  return containerRepo.findAllContainers();
};

const saveMeasurement = async (containerId, measurement, bookingId = null) => {
  //todo const indicatorsValues = getIndicatorsValues (map)
    const savedMeasurement = await measurementRepo.save({
      containerId,
      timestamp: Date.now(),
      values: {
        light: measurement.light,
        vibr: measurement.vibr,
        tmprtr: measurement.tmprtr,
        hmdt: measurement.hmdt
      }
    });
    LiveDataStreamingService.shareContainerInfoLiveData(containerId, savedMeasurement);
};


module.exports = {
  createContainer,
  removeContainer,
  updateContainer,
  getContainerById,
  getAllContainers,
  saveMeasurement
};
