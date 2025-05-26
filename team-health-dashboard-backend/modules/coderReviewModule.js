const db = require('../utils/db');


const codeReviewModule ={
    async createCodeReviewRecord(user_id,project_id, sprint_id, prs_reviewed, avg_review_time_hours ){
            try{
                        const results = await db.query(
                        'INSERT INTO codereview_metrics(user_id,project_id, sprint_id, prs_reviewed, avg_review_time_hours) VALUES ($1,$2,$3,$4,$5)',
                        [user_id,project_id, sprint_id, prs_reviewed, avg_review_time_hours]
                        )
            
                        console.log(results)
                        return results.rows[0];
            
                    }
            
                    catch (error) {
                        console.log(error)
                        throw error;
                      }
    },
    async getCodeReviewBySprintIdAndUserID (sprint_id, user_id){
        try{
            const results = await db.query(
                        'Select * FROM codereview_metrics WHERE sprint_id = $1 AND user_id = $2',
                        [sprint_id,user_id]
                        )
            
                        console.log(results)
                        return results.rows[0];
        }
        catch (error){
            console.log(error)
            throw error;
        }
    },

     async deleteCodeReviewBuSprintId(id){
            try{
                
                const results = await db.query(
                    'DELETE  FROM codereview_metrics WHERE sprint_id = $1',
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




module.exports = codeReviewModule;