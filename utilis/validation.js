const userModel = require('../models/user')

const checkAdminRole = async(userId) =>{
    try{
        const user = await userModel.findById(userId)
        return user.role === 'admin'
    }catch(err){
        return false
    }
}

module.exports = checkAdminRole