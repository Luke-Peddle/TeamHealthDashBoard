const onCallModule = require('../modules/onCallModules')
const userModeles = require('../modules/userModules');
const sprintModules = require('../modules/sprintModules')
const redisClient = require('../utils/redis');

const onCallController ={
    async createOncallRecord(req,res){
        const { user_email,project_id,sprint_name,incidents_count,week_starting_date } = req.body;
        
        if(incidents_count < 0){
            return res.status(500).end();
        }
        console.log(user_email)
       const user = await userModeles.getUserByEmail(user_email);
       if(!user){
            console.log("enter");

        return res.status(200).end();
       }

       const userInProject = await userModeles.checkIfUserInTeam(user.user_id,project_id);

       console.log(userInProject);
       if(!userInProject){
            console.log("enter");
        return res.status(200).end();
       }

       const sprintResponse = await sprintModules.getSprintsByProjectIDeAndSprintName(project_id,sprint_name);

       console.log(sprintResponse);
        if(!sprintResponse){
            console.log("enter");

            return res.status(200).end();
       }

       const oncallExist = await onCallModule.getOncallByUserIdAndProjectIdAndWeek(user.user_id,project_id,week_starting_date);

       console.log(oncallExist)
       if(oncallExist != null){
        console.log("User already have call back for this week")
            return res.status(200).end(); 
       }

       const newOncallRecord = await onCallModule.createOnCallRecord(user.user_id,project_id, sprintResponse[0].id,incidents_count,week_starting_date);
       await redisClient.del(`on_calls:${project_id}`); 
       res.status(201).json(newOncallRecord);
    },
    async getOnCallByProjectId(req, res) {
        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
    
        const cacheKey = `on_calls:${id}`;
        const cacheData = await redisClient.get(cacheKey);
        
        if(cacheData){
            const onCalls = JSON.parse(cacheData)
            console.log(onCalls);
            return res.status(201).json(onCalls)
                }

    
         const onCalls = await onCallModule.getOnCallByProjectId(id);
         await redisClient.set(`on_calls:${id}`, JSON.stringify(onCalls));
         console.log(onCalls)
         return res.status(201).json(onCalls);
    },
}

module.exports = onCallController;