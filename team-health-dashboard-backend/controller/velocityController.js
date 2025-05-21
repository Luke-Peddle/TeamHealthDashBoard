const velocityModules = require('../modules/velocityModules')
const sprintModudles = require('../modules/sprintModules');
const redisClient = require('../utils/redis');

const volocityController ={
    async createVolocityRecord(req,res){
        const { project_id, name,story_points } = req.body;

        if(story_points <0){
            console.log("Invalid entry for story points");
            return res.status(500).end();
        }
       const sprintResponse = await sprintModudles.getSprintsByProjectIDeAndSprintName(project_id,name);

       const VelocityExisted = await velocityModules.getVelocityBySprintId(sprintResponse[0].id);

       if(VelocityExisted != null){
        console.log("Enter");
        return
       }
       console.log("sprint: " +  JSON.stringify(sprintResponse[0].id));
       const newVolocityRecord = await velocityModules.createVolocityRecord(sprintResponse[0].id,story_points);
       res.status(201).json(newVolocityRecord);
    }
}

module.exports = volocityController;