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
                'Select * from users',
                
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

module.exports = userModel;