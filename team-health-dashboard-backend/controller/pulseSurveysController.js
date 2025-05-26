const pulseSurveyModules = require('../modules/pulseSurveysModules')
const redisClient = require('../utils/redis');



const pulseSurveyController ={
    async createPulseRecord(req,res){
       const { user_id,project_id,score, comment,day } = req.body;
       console.log("Enter pulse survey")

       if(score < 1 || score > 5){
        console.log("Enter failed valied score");
        return res.status(500).end();
       }
    const newPulse = await pulseSurveyModules.createPulse( user_id,project_id,score, comment,day);
    console.log(newPulse)
    res.status(201).json(newPulse);
    },
}

module.exports = pulseSurveyController;