const db = require('../utils/db')

const userModel ={

    async createUser(username, password, firstName,lastName, email, role){
        try{
            const results = await db.query(
                'INSERT INTO users(username, password, first_name,last_name, email, role,dark_mode) VALUES ($1,$2,$3,$4,$5,$6,false)',
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

    async getUserByEmail(email){
        try{
            const results = await db.query(
               'SELECT * FROM users WHERE email = $1',
                [email]
                
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
    },

    async getContributors(){
        const role = "contributor"
        try{
            const results = await db.query(
               'SELECT * FROM users WHERE role = $1',
                [role]
            )
    
            console.log(results)
            return results.rows[0];
    
        }
        catch (error) {
            console.log(error)
            throw error;
          }
    },
    async getTeamMembers(id){
        try{
            const results = await db.query(
               'SELECT DISTINCT u.* FROM users u JOIN project_members p ON u.user_id = p.user_id WHERE p.project_id = $1',
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

     

    async getUsersNotInProject(id){
        const role = 'contributor'
        try{
            const results = await db.query(
               'SELECT u.* FROM users u WHERE u.role = $2 AND u.user_id NOT IN (SELECT user_id FROM project_members WHERE project_id = $1)',
                [id,role]
            )
    
            console.log(results)
            return results.rows;
    
        }
        catch (error) {
            console.log(error)
            throw error;
          }
    },

    async removeUserFromProject(project_id, user_id){
        try{
            const results = await db.query(
               'DELETE FROM project_members WHERE user_id = $2 AND project_id = $1',
                [project_id, user_id]
            )
    
            console.log(results)
            return results.rows;
    
        }
        catch (error) {
            console.log(error)
            throw error;
          }
    },

    async removeUserFromProjectByProject_id(project_id){
        try{
            const results = await db.query(
               'DELETE FROM project_members WHERE project_id = $1',
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

    async checkIfUserInTeam(user_id, project_id){
        try{
            const results = await db.query(
               'SELECT * FROM project_members WHERE user_id = $1 AND  project_id = $2',
                [user_id, project_id]
            )
    
            console.log(results)
            return results.rows;
    
        }
        catch (error) {
            console.log(error)
            throw error;
          }
    },

    async updateUserToDarkMode(id, ){
        try{
           
            const results = await db.query(
               ' UPDATE users  SET dark_mode = true WHERE user_id = $1',
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

    async updateUserToLightMode(id ){
        try{
           
            const results = await db.query(
               ' UPDATE users  SET dark_mode = false WHERE user_id = $1',
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
}






module.exports = userModel;