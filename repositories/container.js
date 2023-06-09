const mongoose = require('mongoose');

const ContainerTypes = require('../constants/container-types');
const ContainerStatuses = require('../constants/container-statuses');
const ContainerCategories = require('../constants/container-categories');

const Indicators = require('../constants/indicators')
const IndicatorStatuses = require('../constants/indicator-statuses');

const indicatorSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: Object.keys(Indicators)
    },
    status: {
        type: String,
        enum: Object.keys(IndicatorStatuses),
        default: IndicatorStatuses.TURNED_OFF
    }
})

const containerSchema = new mongoose.Schema({
    title: String,
    height: Number,
    width: Number,
    length: Number,
    yearOfCreation: Date,
    location: String,
    type: {
        type: String,
        enum: Object.keys(ContainerTypes)
    },
    categories: {
        type: [String],
        enum: Object.keys(ContainerCategories)
    },
    indicators: {
        type: [indicatorSchema],
    },
    status: {
        type: String,
        enum: Object.keys(ContainerStatuses),
        default: ContainerStatuses.AVAILABLE,
    },
});

const ContainerMongoModel = mongoose.model('Container', containerSchema);

const save = async (container) => {
    const containerModel = new ContainerMongoModel({
        ...container
    });
    const savedContainer = await containerModel.save();

    return savedContainer;
}

const update = async (infoToUpdate, filter) => {
    return ContainerMongoModel.findOneAndUpdate(filter, infoToUpdate, {returnOriginal: false});
}

const findById = async (id) => {
    return ContainerMongoModel.findById(id);
}

const findAllContainersOfCategories = async (categories, showUnavailable) => {
    const query = showUnavailable ? {
        categories: {
            $elemMatch: {
                $in: categories
            }
        }
    } : {
        categories: {
            $and: [{
                $elemMatch: {
                    $in: categories
                }
            }, {status: ContainerStatuses.AVAILABLE}]

        }
    }
    return ContainerMongoModel.find(query);
}

const findAllContainersNearTheLocation = async (location) => {
    return ContainerMongoModel.find({location});
}

const deleteContainer = async (containerId) => {
    return ContainerMongoModel.deleteOne({_id: containerId});
}

const findAllContainers = async () => {
    return ContainerMongoModel.find();
}

const getContainersCountByType = async () => {
    return ContainerMongoModel.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);
}

const getContainersCountByLocation = async () => {
    return ContainerMongoModel.aggregate([
        { $group: { _id: "$location", count: { $sum: 1 } } },
    ]);
}

const getContainersCountByStatus = async () => {
    return ContainerMongoModel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
}

const getMeasurementsStatistics = async () => {
    return ContainerMongoModel.aggregate([
        { $unwind: "$indicators" },
        { $group: { _id: "$indicators.type", averageValue: { $avg: "$indicators.value" }, minValue: { $min: "$indicators.value" }, maxValue: { $max: "$indicators.value" } } },
    ]);
}

module.exports = {
    save,
    update,
    findById,
    findAllContainersOfCategories,
    findAllContainersNearTheLocation,
    deleteContainer,
    findAllContainers,
    getContainersCountByType,
    getContainersCountByStatus,
    getContainersCountByLocation,
    getMeasurementsStatistics
}
