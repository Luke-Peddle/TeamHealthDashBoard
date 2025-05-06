const userModel = require('../modules/userModules');

const redisClient = require('../utils/redis')




const userController = {
    
    async connectToRedis(){
       
    },

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
     const user = await userModel.getUser(id);
     
     res.status(201).json(user);
},

async updateUser(req, res) {
    await redisClient.connect();
    console.log(req.params)
    const { user_id, username,password, first_name,last_name,email, role } = req.body;
    console.log(user_id, username,password, first_name,last_name,email, role)
    console.log("id: " + first_name)
     const user = await userModel.updateUser(user_id, username, first_name,last_name,email, role);
     await redisClient.del(`user:${user_id}`)
     res.status(201).json(user);

     
},
async DeleteUsers(req, res) {
    await redisClient.connect();
    console.log(req.params)
    const id = req.params.id;
    console.log("id: " + id)
    const response = await userModel.deleteUser(id);
    await redisClient.del(`user:${user_id}`)
     res.status(201).json(response);
},
}

module.exports = userController;