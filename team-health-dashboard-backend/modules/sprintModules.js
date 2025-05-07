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
}

module.exports = sprintModules;