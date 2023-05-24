const containerService = require('../services/container');
const BadRequest = require('../http-errors/bad-request')

const getContainerById = async (req, res, next) => {
    const { containerId } = req.params;
    const container = await containerService.getContainerById(containerId);
    return res.status(200).json(container);
}

const createContainer = async (req, res, next) => {
    try {
        const { container } = req.body;
        const savedContainer = await containerService.createContainer(container);
        return res.status(201).json(savedContainer);
    } catch (error) {
        return res.status(400).json(new BadRequest(error.message));
    }

}

const removeContainer = async (req, res, next) => {
    const { containerId } = req.params;
    try {
        const removedContainer = await containerService.removeContainer(containerId);
        return res.status(201).json(removedContainer);
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

const getAvailableContainers = async (req, res, next) => {

}

const getContainerIndicatorsInfo = async (req, res, next) => {

}

const updateContainerInfo = async (req, res, next) => {
    const { containerId } = req.params;
    const { container: infoToUpdate } = req.body;
    const updatedContainer = await containerService.updateContainer(containerId, infoToUpdate);
    return res.status(201).json(updatedContainer);
}

const getAllContainers = async (req, res, next) => {
    const containers = await containerService.getAllContainers();
    return res.status(200).json(containers);
}

module.exports = {
    getContainerById,
    createContainer,
    removeContainer,
    getAvailableContainers,
    getContainerIndicatorsInfo,
    updateContainerInfo,
    getAllContainers,
}
