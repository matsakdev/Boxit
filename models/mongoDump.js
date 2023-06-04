class MongoDump {
  constructor(data) {
    this.id = data.id;
    this.path = data.path;
    this.timestamp = data.timestamp;
    this.dumpSize = data.dumpSize;
  }

  static getFromDbModel(dbModel) {
    return dbModel ? new MongoDump({
        id: dbModel._id,
        path: dbModel.path,
        timestamp: dbModel.timestamp,
        dumpSize: dbModel.dumpSize
      }
    ) : null;
  }
}

module.exports = MongoDump;
