const express = require('express');
const passport = require("passport");
const containerController = require('../../controllers/container')
const authenticate = passport.authenticate('jwt', {session: false});

const containerRouter = express.Router();

containerRouter.get('/:containerId', containerController.getContainerById);
containerRouter.get('/', containerController.getAllContainers)
containerRouter.post('/', containerController.createContainer);
containerRouter.delete('/:containerId', containerController.removeContainer);
// containerRouter.get('/available', containerController.getAvailableContainers);
// containerRouter.get('/:containerId/indicators', containerController.getContainerIndicatorsInfo);
containerRouter.put('/:containerId', containerController.updateContainerInfo)


module.exports = (app) => {
    app.use('/api/containers', containerRouter);
}
