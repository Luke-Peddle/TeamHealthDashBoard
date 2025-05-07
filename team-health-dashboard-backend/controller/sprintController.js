const sprintModudles = require('../modules/sprintModules');
const redisClient = require('../utils/redis');

const sprintContoller = {
    async createSprint(req, res) {

        const { start_date, end_date, project } = req.body;
        const newSprint = await sprintModudles.createSprint( start_date, end_date, project);
        res.status(201).json(newSprint);
    },

    async getAllSprints(req, res) {

        const sprints = await sprintModudles.getAllSprints();
        res.status(201).json(sprints);
    },
}

module.exports = sprintContoller;