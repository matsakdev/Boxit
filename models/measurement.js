class Measurement {
    constructor(data) {
        this.containerId = data.containerId;
        this.indicatorId = data.indicatorId;
        this.timestamp = data.timestamp;
        this.value = data.value;
    }

    static getModel(dbModel) {
        return dbModel ? new Measurement(
            {
                measurementId: dbModel._id,
                containerId: dbModel.containerId,
                indicatorId: dbModel.indicatorId,
                timestamp: dbModel.timestamp,
                value: dbModel.value,
            }
        ) : null;
    }
}

module.exports = Location;
