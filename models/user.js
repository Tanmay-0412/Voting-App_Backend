const { JsonWebTokenError } = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        validate(value){
            if(value < 18 || value > 100)
            throw new Error('Enter valid user age. Age must be between 18 to 100')
        }
    },
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Enter valid emailId')
            }
        }
    },
    mobile:{
        type:String,
        validate : {
            validator : function(value){
                return validator.isMobilePhone(value, 'en-IN')
            },
            message : props => `${props.value} is not a valid number !`
        }   
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        index:true,
        validate(value){
            if(!/^\d{12}$/.test(value)){
                throw new Error('Aadhar Card Number must be exactly 12 digits')
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Please enter a strong password')
            }
        }
    },
    role:{
        type:String,
        enum : ['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
})   

userSchema.methods.getJWT = async function(passwordInput){
    const user = this
    const token = await jwt.sign({_id:user._id}, "VotingApp@2026", {expiresIn:"1h"})
    return token
}

const userModel = mongoose.model('User', userSchema)
module.exports = userModel