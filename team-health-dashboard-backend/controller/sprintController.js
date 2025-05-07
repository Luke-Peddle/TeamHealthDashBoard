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

    async getSprintByProjectId(req, res) {
        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
    
        const cacheKey = `sprint:${id}`;
            const cacheData = await redisClient.get(cacheKey);
        
            if(cacheData){
              const sprints = JSON.parse(cacheData)
              console.log(sprints);
              res.status(201).json(sprints)
                    }
    
    
         const sprints = await sprintModudles.getSprintsByProjectId(id);
         await redisClient.set(`storyCards:${id}`, JSON.stringify(sprints));
         console.log(sprints)
         res.status(201).json(sprints);
    },
}

module.exports = sprintContoller;