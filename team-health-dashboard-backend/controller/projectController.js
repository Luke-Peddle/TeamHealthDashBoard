const projectModules = require('../modules/projectModules');
const sprintModules = require("../modules/sprintModules");
const userModel = require('../modules/userModules')
const redisClient = require('../utils/redis');

const projectController = {
    async createProject(req, res) {

        const { name, manager } = req.body;
        const newProject = await projectModules.createProject( name, manager);

        await redisClient.del(`projects_manager:${manager}`)      

        res.status(201).json(newProject);
    },

    async getProjectById(req, res) {
        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
    
        const cacheKey = `project:${id}`;
        const cacheData = await redisClient.get(cacheKey);
        
         if(cacheData){
            const projects = JSON.parse(cacheData)
             console.log(projects);
            return res.status(200).json(projects)
               }

    
         const project = await projectModules.getProjectById(id);
         await redisClient.set(`project:${id}`, JSON.stringify(project));
         console.log(project)
         return res.status(200).json(project);
    },
    async getProjectByManagerId(req, res) {
        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
    
        const cacheKey = `projects_manager:${id}`;
        const cacheData = await redisClient.get(cacheKey);
        
        if(cacheData){
            const projects = JSON.parse(cacheData)
            console.log(projects);
            return res.status(201).json(projects)
                }

    
         const projects = await projectModules.getProjectByManagerId(id);
         await redisClient.set(`projects_manager:${id}`, JSON.stringify(projects));
         console.log(projects)
         return res.status(201).json(projects);
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
             await redisClient.del(`project:${id}`)
             res.status(201).json(updatedProject);   
        },
    async DeleteProject(req, res) {

        console.log(req.params)
        const id = req.params.id;
        const manager_id = req.params.manager_id;
        console.log("id: " + id);

        await sprintModules.deleteSprintbyProjectId(id)
        await userModel.removeUserFromProjectByProject_id(id)
        const response = await projectModules.deleteProject(id); 
        await redisClient.del(`project:${id}`)
        await redisClient.del(`projects_manager:${manager_id}`)      
         res.status(201).json(response);
    },

    async addMemberToProject(req, res) {

        const project_id = req.params.project_id;
        console.log(project_id);
        const user_id = req.params.user_id;
        console.log(project_id, user_id)
        const newMember = await projectModules.addContributor( project_id, user_id);

        console.log(newMember)
    await redisClient.del(`members:${project_id}`);
    await redisClient.del(`nonMembers:${project_id}`);

        res.status(201).json(newMember);
    },

}

module.exports = projectController;