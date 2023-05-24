const containerRepo = require('../repositories/container');

const createContainer = async (container) => {
    try {
        const savedContainer = await containerRepo.save(container);
        return savedContainer;
    } catch (err) {
        throw new Error(`Cannot save container: , ${err.message}`);
    }

}

const removeContainer = async (containerId) => {
    return containerRepo.deleteContainer(containerId);
}

const updateContainer = async (containerId, infoToUpdate) => {
    return containerRepo.update(infoToUpdate, {_id: containerId})
}

const getContainerById = async (containerId) => {
    return containerRepo.findById(containerId);
}

const getAllContainers = async () => {
    return containerRepo.findAllContainers();
}


module.exports = {
    createContainer,
    removeContainer,
    updateContainer,
    getContainerById,
    getAllContainers,
}
