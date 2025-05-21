const codeReviewModule = require('../modules/coderReviewModule')
const userModeles = require('../modules/userModules');
const sprintModules = require('../modules/sprintModules')
const redisClient = require('../utils/redis');

const CodeReviewController ={
    async createCodeReviewlRecord(req,res){
        const { project_id, user_email,sprint_name,prs_reviewed,avg_review_time_hours } = req.body;
        
        if(avg_review_time_hours < 0 || prs_reviewed < 0){
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

       const oncallExist = await codeReviewModule.getCodeReviewBySprintId(sprintResponse[0].id);

       console.log(oncallExist)
       if(oncallExist != null){
        console.log("User already have call back for this week")
            return res.status(200).end(); 
       }

       const newOncallRecord = await codeReviewModule.createCodeReviewRecord(user.user_id,project_id, sprintResponse[0].id, prs_reviewed,avg_review_time_hours);
       res.status(201).json(newOncallRecord);
    }
}

module.exports = CodeReviewController;