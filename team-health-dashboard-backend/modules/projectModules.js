const db = require('../utils/db')

const projectModules = {

    async createProject (name,manager) {

        try{
            const results = await db.query(
            'INSERT INTO project(name, manager) VALUES ($1,$2)',
            [name, manager ]
            )

            console.log(results)
            return results.rows[0];

        }

        catch (error) {
            console.log(error)
            throw error;
          }
        
        
    },

    async getProjectByManagerId(manager_id){
            try{
                    const results = await db.query(
                                'SELECT * FROM project WHERE manager = $1',
                                [manager_id]
                                
                            )
    
                console.log(results)
                return results.rows;
    
            }
            catch (error) {
                console.log(error)
                throw error;
                }
        },

    

    async getAllProjects(){
            try{
                const results = await db.query(
                    'SELECT * FROM project ',
                    
                )
    
                console.log(results)
                return results.rows;
    
            }
            catch (error) {
                console.log(error)
                throw error;
              }
        },
}

module.exports = projectModules;