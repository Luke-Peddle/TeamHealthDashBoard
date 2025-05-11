const db = require('../utils/db')

const sprintModules = {

    async createSprint (start_date,end_date,project ) {

        try{
            const results = await db.query(
            'INSERT INTO sprints(start_date,end_date, project_id) VALUES ($1,$2,$3)',
            [start_date,end_date,project ]
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
                            'SELECT * FROM sprints WHERE project_id = $1',
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