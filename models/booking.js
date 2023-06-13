class Booking {
  constructor(data) {
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.note = data.note;
    this.container = data.container;
    this.user = data.user;
    this.requirements = data.requirements;
    this.violationRecorded = data.violationRecorded;
  }

  static getModel(dbModel) {
    return dbModel ?
      new Booking({
        id: dbModel._id,
        startTime: dbModel.startTime,
        endTime: dbModel.endTime,
        note: dbModel.note,
        container: dbModel.container,
        user: dbModel.user,
        requirements: dbModel.requirements,
        violationRecorded: dbModel.violationRecorded
      }) : null;
  }
}

module.exports = Booking;
