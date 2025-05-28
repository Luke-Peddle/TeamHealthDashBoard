const db = require('../utils/db')

const velocityModules ={
    async createVolocityRecord(sprint_id,project_id, storyPoints){
            try{
                        const results = await db.query(
                        'INSERT INTO velocity_metrics(sprint_id, project_id,  story_points_completed) VALUES ($1,$2,$3)',
                        [sprint_id, project_id, storyPoints]
                        )
            
                        console.log(results)
                        return results.rows[0];
            
                    }
            
                    catch (error) {
                        console.log(error)
                        throw error;
                      }
    },
    async getVelocityBySprintId (sprint_id){
        try{
            const results = await db.query(
                        'Select * FROM velocity_metrics WHERE sprint_id = $1 ',
                        [sprint_id]
                        )
            
                        console.log(results)
                        return results.rows[0];
        }
        catch (error){
            console.log(error)
            throw error;
        }
    },

    async getVelocityByProjectId (project_id){
        try{
            const results = await db.query(
                        'Select * FROM velocity_metrics WHERE project_id = $1 ',
                        [project_id]
                        )
            
                        console.log(results)
                        return results.rows;
        }
        catch (error){
            console.log(error)
            throw error;
        }
    },

     async deleteVelocityBuSprintId(id){
            try{
                
                const results = await db.query(
                    'DELETE  FROM velocity_metrics WHERE sprint_id = $1',
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




module.exports = velocityModules;