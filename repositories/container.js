const ContainerTypes = require('../constants/container-types');
const mongoose = require('mongoose');

const indicatorSchema = new mongoose.Schema({name: String})

const containerSchema = new mongoose.Schema({
    title: String,
    height: Number,
    width: Number,
    length: Number,
    yearOfCreation: Date,
    location: String,
    categories: {
        type: [String],
        enum: Object.keys(ContainerTypes)
    },
    indicators: {
        type: [indicatorSchema],
    },
    isAvailable: Boolean,
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
            }, {isAvailable: true}]

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

module.exports = {
    save,
    update,
    findById,
    findAllContainersOfCategories,
    findAllContainersNearTheLocation,
    deleteContainer,
}
