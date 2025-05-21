const onCallModule = require('../modules/onCallModules')
const userModeles = require('../modules/userModules');
const sprintModules = require('../modules/sprintModules')
const redisClient = require('../utils/redis');

const onCallController ={
    async createOncallRecord(req,res){
        const { user_email,project_id,sprint_name,incidents_count,week_starting_date } = req.body;
        console.log('Enter oncall backend')
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
       res.status(201).json(newOncallRecord);
    }
}

module.exports = onCallController;