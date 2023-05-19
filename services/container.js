const containerRepo = require('../repositories/container');

const createContainer = async (container) => {
    const savedContainer = await containerRepo.save(container);
    return savedContainer;
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


module.exports = {
    createContainer,
    removeContainer,
    updateContainer,
    getContainerById

}
