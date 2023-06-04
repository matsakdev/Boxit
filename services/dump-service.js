const fs = require('fs');
const dumpRepo = require('../repositories/mongoDump')
const MongoDump = require("../models/mongoDump");

const saveDumpInfo = async (zipArchivePath) => {
  const stats = fs.statSync(zipArchivePath)
  const fileSizeInBytes = stats.size;

  const fileSizeInMegabytes = fileSizeInBytes / (1024*1024);

  const archiveName = zipArchivePath.split('/').pop();
  const timestampFromArchiveName = archiveName.substring(0, archiveName.indexOf('.zip'));

  const savedDumpInfo = await dumpRepo.save({
    path: zipArchivePath,
    timestamp: timestampFromArchiveName,
    dumpSize: fileSizeInMegabytes.toFixed(5),
  })
  console.log('created dump: ', savedDumpInfo);
  return savedDumpInfo;
}

const getDumpInfo = async (dumpId) => {
  console.log('id', dumpId);
  const dumpInfo = await dumpRepo.findById(dumpId);
  console.log(dumpInfo);
  return MongoDump.getFromDbModel(dumpInfo);
}

const getAllDumpsInfo = async () => {
  const allDumps = await dumpRepo.findAllMongoDumps();
  return allDumps.map(dump => MongoDump.getFromDbModel(dump));
}

module.exports = {
  saveDumpInfo,
  getDumpInfo,
  getAllDumpsInfo,
}
