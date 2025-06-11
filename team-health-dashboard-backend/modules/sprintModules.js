const db = require('../utils/db')

const sprintModules = {

    async createSprint (start_date,end_date,project,name,storyPointTarget ) {

        try{
            const results = await db.query(
            'INSERT INTO sprints(start_date,end_date, project_id, name,story_point_target) VALUES ($1,$2,$3,$4,$5)',
            [start_date,end_date,project,name, storyPointTarget ]
            )

            console.log(results)
            return results.rows[0];

        }

        catch (error) {
            console.log(error)
            throw error;
          }
        
        
    },
    async getSprintById(id){
        try{
                const results = await db.query(
                            'SELECT * FROM sprints WHERE id = $1',
                            [id]
                            
                        )

            console.log(results)
            return results.rows;

        }
        catch (error) {
            console.log(error)
            throw error;
            }
    },
    async getSprintsByProjectId(project_id){
        try{
                const results = await db.query(
                            'SELECT * FROM sprints WHERE project_id = $1 ORDER BY start_date ASC',
                            [project_id]  
                        )

            console.log(results)
            return results.rows;

        }
        catch (error) {
            console.log(error)
            throw error;
            }
    },

    async getSprintsByProjectIDeAndSprintName(id,name){
        console.log("Sprint id: " + id);
        try{
                const results = await db.query(
                            'SELECT * FROM sprints WHERE project_id = $1 AND name = $2',
                            [id,name]  
                        )

            console.log(results)
            return results.rows;

        }
        catch (error) {
            console.log(error)
            throw error;
            }
    },

    async getAllSprints(){
            try{
                const results = await db.query(
                    'SELECT * FROM sprints ',
                    
                )
    
                console.log(results)
                return results.rows;
    
            }
            catch (error) {
                console.log(error)
                throw error;
              }
        },

        async updatSprint(id, start_date, end_date ){
                        try{
                           
                            const results = await db.query(
                               ' UPDATE sprints  SET start_date = $2, end_date = $3 WHERE id = $1',
                                [id,start_date, end_date]
                                
                            )
                    
                            console.log(results)
                            return results.rows;
                    
                        }
                        catch (error) {
                            console.log(error)
                            throw error;
                          }
                    },

        async deleteSprint(id){
                    try{
                        
                        const results = await db.query(
                            ' DELETE FROM sprints WHERE id = $1',
                            [id]
                        )
                
                        console.log(results)
                        return results.rows;
                
                    }
                    catch (error) {
                        console.log(error)
                        throw error;
                        }
                },

    async deleteSprintbyProjectId(id){
            try{
                
                const results = await db.query(
                    ' DELETE FROM sprints WHERE project_id = $1',
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

module.exports = sprintModules;