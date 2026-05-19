const express = require('express')
const UserAuth = require('../middleware/auth')
const userModel = require('../models/user')
const adminRouter = express.Router()
const checkAdminRole = require('../utilis/validation')
const candidateModel = require('../models/candidate')

adminRouter.get('/users/list', UserAuth, async(req,res)=>{
        try{
            const isAdmin = await checkAdminRole(req.user._id);
            if(!isAdmin){
                res.status(404).json({message:"User is not a Admin"})
            }
            const users = await userModel.find()
            res.json({message:'Users fetched successfully', data : users})

        }catch(err){
            res.status(500).json({message:err.message})
        }
})

adminRouter.get('/candidates/list', UserAuth, async(req,res)=>{
    try{
        const candidates = await candidateModel.find()
        res.json({message:'Candidates fetched successfully', data : candidates})
    }catch(err){
        res.status(400).json({message:err.message})
    }
    
})

module.exports = adminRouter