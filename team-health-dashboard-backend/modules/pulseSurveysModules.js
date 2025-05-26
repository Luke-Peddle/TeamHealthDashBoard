const db = require('../utils/db')

const pulseSurveyModules ={
   async createPulse (user_id,project_id,score, comment,day){
        try{
                    const results = await db.query(
                    'INSERT INTO pulse_surveys(user_id,project_id,score, comment,day) VALUES ($1,$2,$3,$4,$5)',
                    [user_id,project_id,score, comment,day]
                    )
        
                    console.log(results)
                    return results.rows[0];
        
                }
        
                catch (error) {
                    console.log(error)
                    throw error;
                  }
   }
   
    }




module.exports = pulseSurveyModules;