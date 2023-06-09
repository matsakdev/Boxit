const containerRepo = require("../repositories/container");
const measurementRepo = require('../repositories/measurement');
const LiveDataStreamingService = require('../services/live-data-streaming')
const ContainerModel = require("../models/container");

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
  const allContainers = await containerRepo.findAllContainers();
  return allContainers.map(container => ContainerModel.getModel(container));
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

const getContainerMeasurements = async (containerId) => {
  return measurementRepo.findAllMeasurementsOfContainer(containerId);
}

const getContainerMeasurementsInRange = async (containerId, timeFrom, timeTo) => {
  return measurementRepo.findAllMeasurementsOfContainerInTimeRange(containerId, timeFrom, timeTo);
}

const getContainerMeasurementsAfter = async (containerId, timeFrom) => {
  return measurementRepo.findAllMeasurementsOfContainerAfterTime(containerId, timeFrom);
}

const getContainersBasicStatistics = async () => {
  const containersCountByStatus = await containerRepo.getContainersCountByStatus();
  const containersCountByLocation = await containerRepo.getContainersCountByLocation();
  const containersCountByType = await containerRepo.getContainersCountByType();
  return {
    containersCountByStatus,
    containersCountByLocation,
    containersCountByType
  }
}


module.exports = {
  createContainer,
  removeContainer,
  updateContainer,
  getContainerById,
  getAllContainers,
  saveMeasurement,
  getContainerMeasurements,
  getContainerMeasurementsAfter,
  getContainerMeasurementsInRange,
  getContainersBasicStatistics
};
