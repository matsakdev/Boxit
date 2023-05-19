const express = require('express');
const containerController = require('../../controllers/container')

const containerRouter = express.Router();

containerRouter.get('/:containerId', containerController.getContainerById);
containerRouter.post('/', containerController.createContainer);
containerRouter.delete('/:containerId', containerController.removeContainer);
containerRouter.get('/available', containerController.getAvailableContainers);
containerRouter.get('/:containerId/indicators', containerController.getContainerIndicatorsInfo);
containerRouter.put('/:containerId', containerController.updateContainerInfo)


module.exports = (app) => {
    app.use('/api/containers', containerRouter);
}
