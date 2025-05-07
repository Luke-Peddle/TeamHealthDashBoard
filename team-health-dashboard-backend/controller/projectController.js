const projectModules = require('../modules/projectModules');
const redisClient = require('../utils/redis');

const projectController = {
    async createProject(req, res) {

        const { name, manager } = req.body;
        const newProject = await projectModules.createProject( name, manager);
        res.status(201).json(newProject);
    },

    async getAllProjects(req, res) {

        const projects = await projectModules.getAllProjects();
        res.status(201).json(projects);
    },
}

module.exports = projectController;