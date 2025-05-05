const userModel = require('../modules/userModules');

const userController = {

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

    console.log(req.params)
    const { id, username,password, firstName,lastName,email, role } = req.body;
    console.log(id, username,password, firstName,lastName,email, role)
    console.log("id: " + id)
     const user = await userModel.updateUser(id, username, firstName,lastName,email, role);
     res.status(201).json(user);
},
async DeleteUsers(req, res) {

    console.log(req.params)
    const id = req.params.id;
    console.log("id: " + id)
     const response = await userModel.deleteUser(id);
     
     res.status(201).json(response);
},
}

module.exports = userController;