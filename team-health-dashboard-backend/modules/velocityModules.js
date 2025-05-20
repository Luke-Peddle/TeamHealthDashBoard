const db = require('../utils/db')

const velocityModules ={
    async createVolocityRecord(sprint_id,storyPoints){
            try{
                        const results = await db.query(
                        'INSERT INTO velocity_metrics(sprint_id, story_points_completed) VALUES ($1,$2)',
                        [sprint_id, storyPoints]
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




module.exports = velocityModules;