const userModel = require('../models/user')
const validator = require('validator')

const checkAdminRole = async(userId) =>{
    try{
        const user = await userModel.findById(userId)
        return user.role === 'admin'
    }catch(err){
        return false
    }
}

const validatePassword = (password) => {
    if(!password){
        throw new Error('Enter valida password')
    }
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    
    if(!strongPasswordRegex.test(password)){
        throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)')
    }
}

const validateMobile = (mobile) => {
    if(!mobile){
        throw new Error('Mobile number is required')
    }
    
    if(!validator.isMobilePhone(mobile, 'en-IN')){
        throw new Error('Mobile number must be a valid Indian phone number (10 digits starting with 6-9)')
    }
}

module.exports = { checkAdminRole, validatePassword, validateMobile }