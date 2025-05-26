const db = require('../utils/db');


const onCallModule ={
    async createOnCallRecord(user_id,project_id,sprint_id, incidents_count,week_starting_date){
        try{
                    const results = await db.query(
                    'INSERT INTO oncall_metrics(user_id,project_id,sprint_id, incidents_count,week_starting_date) VALUES ($1,$2,$3,$4,$5)',
                    [user_id,project_id,sprint_id, incidents_count,week_starting_date]
                    )
        
                    console.log(results)
                    return results.rows[0];
        
                }
        
                catch (error) {
                    console.log(error)
                    throw error;
                    }
    },

     async getOncallByUserIdAndProjectIdAndWeek (user_id,project_id,week){
            try{
                const results = await db.query(
                            'Select * FROM oncall_metrics WHERE user_id = $1 AND  project_id = $2 and  week_starting_date = $3',
                            [user_id,project_id,week]
                            )
                
                            console.log(results)
                            return results.rows[0];
            }
            catch (error){
                console.log(error)
                throw error;
            }
        },

         async deleteOnCallBuSprintId(id){
            try{
                
                const results = await db.query(
                    'DELETE  FROM oncall_metrics WHERE sprint_id = $1',
                    [id]
                )
        
                console.log(results)
                return results.rows;
        
            }
            catch (error) {
                console.log(error)
                throw error;
                }
        }
}

module.exports = onCallModule;