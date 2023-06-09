class Location {
  constructor(data) {
    this.title = data.title;
    this.locationType = data.locationType;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
  }

  static getModel(dbModel) {
    this.id = dbModel._id;
    this.title = dbModel.title;
    this.latitude = dbModel.locationType;
    this.latitude = dbModel.latitude;
    this.longitude = dbModel.longitude;
  }
}

module.exports = Location;
