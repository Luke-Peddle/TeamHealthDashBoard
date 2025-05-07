const projectModules = require('../modules/projectModules');
const redisClient = require('../utils/redis');

const projectController = {
    async createProject(req, res) {

        const { name, manager } = req.body;
        const newProject = await projectModules.createProject( name, manager);
        res.status(201).json(newProject);
    },

    async getProjectById(req, res) {
        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
    
        const cacheKey = `projects:${id}`;
        const cacheData = await redisClient.get(cacheKey);
        
        // if(cacheData){
        //     const projects = JSON.parse(cacheData)
        //     console.log(projects);
        //     res.status(201).json(projects)
        //         }

    
         const project = await projectModules.getProjectById(id);
         await redisClient.set(`projects:${id}`, JSON.stringify(project));
         console.log(project)
         res.status(201).json(project);
    },
    async getProjectByManagerId(req, res) {
        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
    
        const cacheKey = `projects:${id}`;
        const cacheData = await redisClient.get(cacheKey);
        
        if(cacheData){
            const projects = JSON.parse(cacheData)
            console.log(projects);
            res.status(201).json(projects)
                }

    
         const projects = await projectModules.getProjectByManagerId(id);
         await redisClient.set(`projects:${id}`, JSON.stringify(projects));
         console.log(projects)
         res.status(201).json(projects);
    },

    async getAllProjects(req, res) {

        const projects = await projectModules.getAllProjects();
        res.status(201).json(projects);
    },

    async updateProject(req, res) {
            console.log(req.params)
            const id = req.params.id
            const {  name, manager } = req.body;
             const updatedProject = await projectModules.updateProjrct(id, name, manager);
             res.status(201).json(updatedProject);   
        },
    async DeleteProject(req, res) {

        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
        const response = await projectModules.deleteProject(id);    
         res.status(201).json(response);
    },

}

module.exports = projectController;