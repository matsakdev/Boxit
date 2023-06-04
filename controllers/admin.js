const dumpHandler = require("../business-logic/dump-service");
const dumpService = require("../services/dump-service");
const ServerError = require("../http-errors/server-error");
const AdmZip = require("adm-zip");

const createMongoDump = async (req, res, next) => {
  try {
    const zipWithDump = await dumpHandler.mongoDump();
    return res.download(zipWithDump);
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

module.exports = {
  createMongoDump,
  restoreDatabaseFromDump,
  getAllDumps
};
