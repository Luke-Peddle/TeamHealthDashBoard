const userModel = require('../modules/userModules');

const redisClient = require('../utils/redis')




const userController = {
    
    

    async removeKey(id){
        await redisClient.del(`user: ${id}`)
    },

async createUser(req, res) {

    const { username, password, firstName,lastName,email, role } = req.body;
    const newUser = await userModel.createUser( username, password, firstName,lastName,email, role);
    res.status(201).json(newUser);
},

async getAllUsers(req, res) {

    const users = await userModel.getAllUser();
    res.status(201).json(users);
},

async getUsers(req, res) {
    console.log(req.params)
    const id = req.params.id;
    console.log("id: " + id)

    const cacheKey = `user:${id}`;
        const cacheData = await redisClient.get(cacheKey);
    
        if(cacheData){
          const user = JSON.parse(cacheData)
          console.log(user);
          res.status(201).json(user)
                }


     const user = await userModel.getUser(id);
     await redisClient.set(`user:${id}`, JSON.stringify(user));
     console.log(user)
     res.status(201).json(user);
},

async updateUser(req, res) {
    console.log(req.params)
    const { user_id, username,password, first_name,last_name,email, role } = req.body;
    console.log(user_id, username,password, first_name,last_name,email, role)
    console.log("id: " + first_name)
     const user = await userModel.updateUser(user_id, username, first_name,last_name,email, role);
     await redisClient.del(`user:${user_id}`)
     res.status(201).json(user);

     
},
async DeleteUsers(req, res) {

    console.log(req.params)
    const id = req.params.id;
    console.log("id: " + id)
    const response = await userModel.deleteUser(id);
    await redisClient.del(`user:${id}`)

     res.status(201).json(response);
},

async getContributors(req, res) {
   

    // const cacheKey = `users:${id}`;
    //     const cacheData = await redisClient.get(cacheKey);
    
    //     if(cacheData){
    //       const user = JSON.parse(cacheData)
    //       console.log(user);
    //       res.status(201).json(user)
    //             }


     const users = await userModel.getContributors();
    //  await redisClient.set(`user:${id}`, JSON.stringify(user));
     console.log(users)
     res.status(201).json(users);
},

async getTeamMembers(req, res) {
   
    
        const id = req.params.project_id;

    const cacheKey = `members:${id}`;
        const cacheData = await redisClient.get(cacheKey);
    
        if(cacheData){
          const user = JSON.parse(cacheData)
          console.log(user);
         return res.status(201).json(user)
                }


     const users = await userModel.getTeamMembers(id);
     console.log(users);
     await redisClient.set(`members:${id}`, JSON.stringify(users));

     res.status(201).json(users);
},

async getNonTeamMembers(req, res) {
   
    
        const id = req.params.project_id;

    const cacheKey = `nonMembers:${id}`;
        const cacheData = await redisClient.get(cacheKey);
    
        if(cacheData){
          const user = JSON.parse(cacheData)
          console.log(user);
          return res.status(201).json(user)
        }


     const users = await userModel.getUsersNotInProject(id);
     await redisClient.set(`nonMembers:${id}`, JSON.stringify(users));
     console.log(users)
     res.status(201).json(users);
},

async removeMember(req, res) {

    console.log(req.params)
    const user_id = req.params.user_id;
    const project_id = req.params.project_id;
    console.log(project_id);

    const response = await userModel.removeUserFromProject(project_id, user_id);
    await redisClient.del(`members:${project_id}`);
    await redisClient.del(`nonMembers:${project_id}`);


     res.status(201).json(response);
},
}

module.exports = userController;