const db = require('../db')

const userModel ={

    async createUser(username, password, firstName,lastName, email, role){
        try{
            const results = await db.query(
                'INSERT INTO users(username, password, first_name,last_name, email, role) VALUES ($1,$2,$3,$4,$5,$6)',
                [username, password, firstName,lastName, email, role]
            )

            console.log(results)
            return results.rows[0];

        }
        catch (error) {
            console.log(error)
            throw error;
          }
    },

    async getAllUser(){
        try{
            const results = await db.query(
                'SELECT * FROM users ',
                
            )

            console.log(results)
            return results.rows;

        }
        catch (error) {
            console.log(error)
            throw error;
          }
    },
    async getUser(id){
        try{
            const results = await db.query(
               'SELECT * FROM users WHERE user_id = $1',
                [id]
                
            )
    
            console.log(results)
            return results.rows[0];
    
        }
        catch (error) {
            console.log(error)
            throw error;
          }
    },

    async updateUser(id, username, firstName,lastName, email, role){
        try{
           
            const results = await db.query(
               ' UPDATE users  SET username = $2,first_name = $3,last_name = $4,email = $5,role = $6 WHERE user_id = $1',
                [id,username, firstName,lastName, email, role]
                
            )
    
            console.log(results)
            return results.rows;
    
        }
        catch (error) {
            console.log(error)
            throw error;
          }
    },

    async deleteUser(id){
        try{
           
            const results = await db.query(
               ' DELETE FROM users WHERE user_id = $1',
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




module.exports = userModel;