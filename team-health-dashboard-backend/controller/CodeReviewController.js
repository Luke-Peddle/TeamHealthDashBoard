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

      
        if(!sprintResponse){
            console.log("enter");

            return res.status(200).end();
       }
        console.log("Sprint Response: " + sprintResponse);

       const oncallExist = await codeReviewModule.getCodeReviewBySprintIdAndUserID(sprintResponse[0].id,user.user_id);

       console.log(oncallExist)
       if(oncallExist){
        console.log("User already have record for code revire for this sprint")
            return res.status(200).end(); 
       }

       const newOncallRecord = await codeReviewModule.createCodeReviewRecord(user.user_id,project_id, sprintResponse[0].id, prs_reviewed,avg_review_time_hours);
       
       console.log("code Review Record: " + newOncallRecord)
       await redisClient.del(`code_reviews:${project_id}`);

       res.status(201).json(newOncallRecord);
    },
     async getCodeReviewByProjectId(req, res) {
        console.log(req.params)
        const id = req.params.id;
        console.log("id: " + id)
    
        const cacheKey = `code_reviews:${id}`;
        const cacheData = await redisClient.get(cacheKey);
        
        if(cacheData){
            const codeReviews = JSON.parse(cacheData)
            console.log(codeReviews);
            return res.status(201).json(codeReviews)
                }

    
         const codeReviews = await codeReviewModule.getCodeReviewByProjectId(id);
         await redisClient.set(`code_reviews:${id}`, JSON.stringify(codeReviews));
         console.log(codeReviews)
         return res.status(201).json(codeReviews);
    },
}

module.exports = CodeReviewController;