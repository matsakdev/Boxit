const mongoose = require('mongoose');
const { Double } = require("mongodb");

const dumpSchema = new mongoose.Schema({
  path: String,
  timestamp: Date,
  dumpSize: Number,
});

const DumpMongoModel = mongoose.model('MongoDump', dumpSchema);

const save = async (dump) => {
  const dumpModel = new DumpMongoModel({
    ...dump
  });
  const savedMongoDump = await dumpModel.save();

  return savedMongoDump;
}

const findById = async (id) => {
  return DumpMongoModel.findById(id);
}

const deleteDump = async (mongoDumpId) => {
  return DumpMongoModel.deleteOne({_id: mongoDumpId});
}

const findAllMongoDumps = async () => {
  return DumpMongoModel.find();
}

module.exports = {
  save,
  findById,
  deleteDump,
  findAllMongoDumps,
}
