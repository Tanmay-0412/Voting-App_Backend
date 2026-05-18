const express = require('express')
const UserAuth = require('../middleware/auth')
const userModel = require('../models/user')
const profileRouter = express.Router()

profileRouter.get('/profile/view', UserAuth, async(req,res)=>{
    try{
        const user = req.user
        res.json({message:'User data fetched successfully ', data : user})
    }catch(err){
        res.status(400).json({error: err.message})
    }
})

profileRouter.post('/profile/update', UserAuth, async(req,res)=>{
    try{
        const user = req.user
        const data = req.body
        const allowedFields = [ "age", "email", "mobile", "username"]
        const isAllowed = Object.keys(data).every(field => allowedFields.includes(field))
        console.log(isAllowed)
        if(!isAllowed){
            res.status(400).json({message:'Invalid Edit Request'})
        }
        const User = await userModel.findById(user._id)

        await User.save()
        res.json({message:'Profile updated successfully !'})
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

module.exports = profileRouter