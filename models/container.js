class Container {
    constructor(data) {
        this.id = data.id;
        this.height = data.height;
        this.width = data.width;
        this.length = data.length;
        this.indicators = data.indicators;
        this.yearOfCreation = data.yearOfCreation;
        this.title = data.title;
        this.type = data.type;
        this.categories = data.categories;
        this.location = data.location;
        this.status = data.status;
    }

    static getModel(dbModel) {
        return dbModel ? new Container({
            id: dbModel._id,
            height: dbModel.height,
            width: dbModel.width,
            length: dbModel.length,
            indicators: dbModel.indicators,
            yearOfCreation: dbModel.yearOfCreation,
            title: dbModel.title,
            categories: dbModel.categories,
            location: dbModel.location,
            type: dbModel.type,
            status: dbModel.status,
        }) : null;
    }
}

module.exports = Container;
