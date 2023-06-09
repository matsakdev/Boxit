const mongoose = require('mongoose');
const UserRoles = require("../constants/user-roles");

const userSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true
    },
    name: String,
    surname: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: Object.keys(UserRoles),
        default: UserRoles.USER,
    }
});

const UserMongoModel = mongoose.model('User', userSchema);

const register = async (userModel, password) => {
    const user = new UserMongoModel({
        ...userModel,
        password
    });
    await user.save();

    return user;
}

const update = async (infoToUpdate, filter) => {
    return UserMongoModel.findOneAndUpdate(filter, infoToUpdate, {returnOriginal: false});
}

const findByUsername = username => {
    return UserMongoModel.findOne({name: username});
}

const findById = id => {
    return UserMongoModel.findById(id);
}

const findByEmail = email => {
    return UserMongoModel.findOne({email});
}

const findAllUsers = async () => {
    return UserMongoModel.find();
}

const findAllTestUsers = async () => {
    return UserMongoModel.find({isTestUser: true});
}

module.exports = {
    register,
    update,
    findByUsername,
    findById,
    findByEmail,
    findAllUsers,
    findAllTestUsers
}
