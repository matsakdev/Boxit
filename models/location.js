class Location {
  constructor(data) {
    this.title = data.title;
    this.locationType = data.locationType;
    this.coordinates = data.coordinates;
  }

  static getModel(dbModel) {
    this.id = dbModel._id;
    this.title = dbModel.title;
    this.locationType = dbModel.locationType;
    this.coordinates = dbModel.coordinates;
  }
}

module.exports = Location;
