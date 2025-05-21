const sprintModudles = require('../modules/sprintModules');
const redisClient = require('../utils/redis');
const storyCardModules = require('../modules/storyCardsModules');
const velocityModules = require('../modules/velocityModules');
const onCallModule = require('../modules/onCallModules');

const sprintContoller = {
    async createSprint(req, res) {

        const { start_date, end_date, project_id, name } = req.body;
        const newSprint = await sprintModudles.createSprint( start_date, end_date, project_id,name);
        await redisClient.del(`sprint_project:${project_id}`)
        res.status(201).json(newSprint);
    },

    async getAllSprints(req, res) {

        const sprints = await sprintModudles.getAllSprints();
        res.status(201).json(sprints);
    },

    async getSprintById(req, res) {
        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
    
        const cacheKey = `sprint:${id}`;
        const cacheData = await redisClient.get(cacheKey);
        
        if(cacheData){
            const projects = JSON.parse(cacheData)
            console.log(projects);
            return res.status(201).json(projects)
                }

    
         const sprint = await sprintModudles.getSprintById(id);
         await redisClient.set(`sprint:${id}`, JSON.stringify(sprint));
         console.log(sprint)
         return res.status(201).json(sprint);
    },

    async getSprintByProjectId(req, res) {
        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
    
        const cacheKey = `sprint_project:${id}`;
            const cacheData = await redisClient.get(cacheKey);
        
            if(cacheData){
              const sprints = JSON.parse(cacheData)
              console.log(sprints);
              return res.status(200).json(sprints)
                }
    
    
         const sprints = await sprintModudles.getSprintsByProjectId(id);
         console.log("Sptints: " + sprints)
         await redisClient.set(`sprint_project:${id}`, JSON.stringify(sprints));
         console.log("Before sending response, headers sent?", res.headersSent);
         console.log(sprints)
         return res.status(200).json(sprints);
    },

     async getSprintByProjectNameAndSprintId(req, res) {
        console.log(req.params)
        const name = req.params.project_name
        const id = req.params.id;
        console.log("id: " + id)
    
        // const cacheKey = `sprint_project:${id}`;
        //     const cacheData = await redisClient.get(cacheKey);
        
        //     if(cacheData){
        //       const sprints = JSON.parse(cacheData)
        //       console.log(sprints);
        //       return res.status(200).json(sprints)
        //         }
    
    
         const sprints = await sprintModudles.getSprintsByProjectNameAndSprintName(id,name);
         console.log("Sptints: " + sprints)
        //  await redisClient.set(`sprint_project:${id}`, JSON.stringify(sprints));
         console.log(sprints)
         return res.status(200).json(sprints);
    },

    async getSprintByProjectNameAndSprintName(req, res) {
        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
    
        const cacheKey = `sprint_project:${id}`;
            const cacheData = await redisClient.get(cacheKey);
        
            if(cacheData){
              const sprints = JSON.parse(cacheData)
              console.log(sprints);
              return res.status(200).json(sprints)
                }
    
    
         const sprints = await sprintModudles.getSprintsByProjectId(id);
         console.log("Sptints: " + sprints)
         await redisClient.set(`sprint_project:${id}`, JSON.stringify(sprints));
         console.log("Before sending response, headers sent?", res.headersSent);
         console.log(sprints)
         return res.status(200).json(sprints);
    },

    async updateSprint(req, res) {
        console.log(req.params);
        const id = req.params.id;
        const { start_date, end_date } = req.body;
         const updatedSprint = await sprintModudles.updatSprint(id,start_date, end_date);
         await redisClient.del(`sprint:${id}`)

         res.status(201).json(updatedSprint);   
    },

    async DeleteSprint(req, res) {

        console.log(req.params)
        const id = req.params.id;
        const project_id = req.params.project_id;
        console.log("id: " + id)
        await velocityModules.deleteVelocityBuSprintId(id)
        await onCallModule.deleteOnCallBuSprintId(id)
        await storyCardModules.deleteStoryCard(id); 
        const response = await sprintModudles.deleteSprint(id);
        await redisClient.del(`sprint_project:${project_id}`)    
         res.status(201).json(response);
    },

}

module.exports = sprintContoller;