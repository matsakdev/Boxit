const dumpHandler = require("../business-logic/dump-service");
const dumpService = require("../services/dump-service");
const ServerError = require("../http-errors/server-error");
const statisticsService = require('../business-logic/statistics');
const containersService = require('../services/container');
const userService = require('../services/user');
const bookingService = require('../services/booking');
const bookingGenerator = require('../data-generators/bookings');
const xlsxGenerator = require('../services/xslx-generator');
const AdmZip = require("adm-zip");
const fs = require("fs");

const createMongoDump = async (req, res, next) => {
  try {
    const zipWithDump = await dumpHandler.mongoDump();
    const zipStream = fs.createReadStream(zipWithDump);
    const fileName = zipWithDump.split('/').pop();
    console.log(fileName);
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${fileName}"`
    })
    zipStream.pipe(res);
  } catch (error) {
    return next(new ServerError(`Cannot create dump. Please, try once more or notify the dev team about the problem. Error: ${error}`));
  }
};

const restoreDatabaseFromDump = async (req, res, next) => {
  try {
    const { dumpId } = req.params;
    const zipWithDump = await dumpHandler.restoreMongoDatabase(dumpId);
    return res.status(200).json(zipWithDump);
  } catch (error) {
    console.error(error);
    return next(new ServerError(`Cannot create dump. Please, try once more or notify the dev team about the problem. Error: ${error}`));
  }
};

const getAllDumps = async (req, res, next) => {
  try {
    const dumps = await dumpService.getAllDumpsInfo();
    return res.status(200).json(dumps);
  } catch (error) {
    console.error(error);
    return next(new ServerError(`Cannot get dumps. Please, try once more or notify the dev team about the problem. Error: ${error}`));
  }
}

const getContainersStatistics = async (req, res, next) => {
  try {
    const containersStatistics = await statisticsService.getContainersStatistics();
    return res.status(201).json(containersStatistics);
  } catch (error) {
    console.error(error);
    return next(new ServerError(`Cannot create statistics. Error: ${error}`));
  }
};

const createContainerStatisticsWorksheet = async (req, res, next) => {
  try {
    const containersStatistics = await statisticsService.getContainersStatistics();
    const filePath = await xlsxGenerator.createStatisticsXlsx(containersStatistics);
    const fileStream = fs.createReadStream(filePath);
    const fileName = filePath.split('/').pop();
    console.log(fileName);
    res.set({
      'Content-Type': 'application/xlsx',
      'Content-Disposition': `attachment; filename="${fileName}"`
    })
    fileStream.pipe(res);
  } catch (err) {
    return next(new ServerError(`Cannot create statistics XLSX. Erorr: ${err}`));
  }
}

const generateBookingsRecords = async (req, res, next) => {
  const {year, month} = req.params;
  const allContainers = await containersService.getAllContainers();
  const allUsers = await userService.findAllTestUsers();
  const allBookings = await bookingGenerator.BookingsGenerator(allContainers, allUsers, year, month);
  const saveResult = await bookingService.bulkSaveBookings(allBookings);
  return res.status(201).json({
    generatedDocumentsCount: allBookings.length,
    saveResult
  });
}

module.exports = {
  createMongoDump,
  restoreDatabaseFromDump,
  getAllDumps,
  getContainersStatistics,
  generateBookingsRecords,
  createContainerStatisticsWorksheet
};
