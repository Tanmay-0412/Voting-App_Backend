const express = require('express')
const userRouter = express.Router()
const bcrypt = require('bcrypt')
const userModel = require('../models/user')

userRouter.post('/signup', async(req,res)=>{
    try {
        const {username, aadharCardNumber, password} = req.body
        const existingUser = await userModel.findOne({
            $or : [{username}, {aadharCardNumber}]
        })

        if(existingUser){
            if(existingUser.username === username){
                return res.status(400).json({message:'Username already exists ! Please try a different name'})
            }
            if(existingUser.aadharCardNumber === Number(aadharCardNumber)){
                return res.status(400).json({message: 'Aadhaar card number already exists !'})
            }
        }
        
        const hashPassword = await bcrypt.hash(password, 10)
        // New instance of the user model 
        const userObj = {username, aadharCardNumber, password : hashPassword} 
        const user = new userModel(userObj)
        
        await user.save()
        res.json({message : 'Signup successfull', data : user})
    }catch(err){
        res.status(400).json({error : err.message})
    }
})

userRouter.post('/login', async(req,res)=>{
    try{
        const { username, password, role} = req.body

        const user = await userModel.findOne({username})
        if(!user){
            return res.status(400).json({message:'User not Found'})
        }
        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message:'Passowrd incorrect.. please try again'})
        }
        const token = await user.getJWT()
        res.cookie("token", token, {expires: new Date(Date.now()+ 1* 3600000)})

        res.json({message:'Login successfull !'})
    }catch(err){
        res.status(400).json({error :err.message})
    }
})

userRouter.post('/logout', async(req,res)=>{

})
module.exports = userRouter
