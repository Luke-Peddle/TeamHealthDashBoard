const db = require('../utils/db')

const storyCardsModules = {

    async createStoryCard (description,sprint ) {

        try{
            const results = await db.query(
            'INSERT INTO story_cards(description,project_id,completed) VALUES ($1,$2,$3)',
            [description,sprint,false]
            )

            console.log(results)
            return results.rows[0];

        }

        catch (error) {
            console.log(error)
            throw error;
          }
        
        
    },

    async getStoryCardById(id){
        try{
                const results = await db.query(
                    'SELECT * FROM story_Cards WHERE id = $1',
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

    async getStoryCardsByProjectId(sprint_id){
            try{
                 const results = await db.query(
                               'SELECT * FROM story_cards WHERE project_id = $1',
                                [sprint_id]
                                
                            )
    
                console.log(results)
                return results.rows;
    
            }
            catch (error) {
                console.log(error)
                throw error;
              }
        },

        async getAllStoryCards(){
            try{
                const results = await db.query(
                    'SELECT * FROM story_cards ',
                    
                )
    
                console.log(results)
                return results.rows;
    
            }
            catch (error) {
                console.log(error)
                throw error;
              }
        },

         async updatStoryCard(id, discription, ){
                try{
                   
                    const results = await db.query(
                       ' UPDATE story_cards  SET description = $2 WHERE id = $1',
                        [id,discription]
                        
                    )
            
                    console.log(results)
                    return results.rows;
            
                }
                catch (error) {
                    console.log(error)
                    throw error;
                  }
            },

        async deleteStoryCard(id){
            try{
                
                const results = await db.query(
                    'DELETE FROM story_cards WHERE id = $1',
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

module.exports = storyCardsModules;