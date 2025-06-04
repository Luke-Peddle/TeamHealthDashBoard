const db = require('../utils/db')

const pulseSurveyModules = {
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
   },
   
   async getPulseByDateAndUserId (user_id, day, project_id){
    try{
        const results = await db.query(
            'SELECT * FROM pulse_surveys WHERE user_id = $1 AND day = $2 AND project_id = $3',
            [user_id, day, project_id]
        )

        console.log(results)
        return results.rows[0]
    }
    catch (error){
        console.log(error)
        throw error
    }
   },

   async getPulseByProjectId ( project_id){
    try{
        const results = await db.query(
            'SELECT * FROM pulse_surveys WHERE  project_id = $1 ORDER BY day DESC',
            [project_id]
        )

        console.log(results)
        return results.rows
    }
    catch (error){
        console.log(error)
        throw error
    }
   }
   
    }




module.exports = pulseSurveyModules;