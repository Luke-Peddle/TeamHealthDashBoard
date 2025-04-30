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
}
}

module.exports = userController;